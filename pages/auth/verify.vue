<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Verify your email</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">We've sent a verification code to your email. Enter it below to verify your account.</UiTypographyP>
      </div>

      <form @submit.prevent="verifyEmail()" class="grid gap-6 w-full">
        <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
        <FormButton :loading="isLoading">Verify Email</FormButton>

        <div class="flex flex-col items-center gap-4 mt-2">
          <button
            type="button"
            @click="requestNewCode()"
            class="text-sm text-primary hover:underline"
            :disabled="resendCooldown > 0"
          >
            {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
          </button>

          <!-- Debug button -->
          <button
            type="button"
            @click="debugAuth()"
            class="text-xs text-gray-400 hover:underline"
          >
            Debug Auth State
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  isVerifyRoute: true
});

import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";
import { useNuxtApp } from '#app';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useAppToast();
const { $auth } = useNuxtApp();

// State variables
const code = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);

// Check verification status on mount
onMounted(async () => {
  // Clear any previous messages
  authStore.clearMessages();

  // Debug auth state in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Verify page mounted, auth state:', {
      isAuthenticated: authStore.isAuthenticated,
      isVerified: authStore.isVerified,
      user: authStore.user,
      needsVerification: authStore.needsVerification
    });
  }

  // Check if we came from signup or login
  const fromSignup = route.query.fromSignup === 'true';
  const fromLogin = route.query.fromLogin === 'true';

  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('User is already verified, redirecting to dashboard');
    }
    navigateToDashboard();
    return;
  }

  // If user is not authenticated and didn't come from signup/login, redirect to login
  if (!authStore.isAuthenticated && !fromSignup && !fromLogin) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('User is not authenticated and didn\'t come from signup/login, redirecting to login');
    }
    router.push('/auth/login');
    return;
  }

  // Request a new verification code on page load (silently)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Requesting verification code silently');
  }
  await requestNewCode(true);
});

// Clean up interval on component unmount
onBeforeUnmount(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }
});

// Verify email with code
async function verifyEmail() {
  if (!code.value || code.value.length !== 6) {
    toast.error('Error', 'Please enter a valid 6-digit verification code');
    return;
  }

  isLoading.value = true;

  try {
    // Show loading toast
    toast.info('Verifying', 'Verifying your email...');

    const result = await authStore.verifyEmail(code.value);

    if (result.success) {
      toast.success('Success', result.message || 'Email verified successfully');

      // Reset the form
      code.value = '';

      // Redirect to dashboard after successful verification with a short delay
      setTimeout(() => {
        navigateToDashboard();
      }, 1000);
    } else {
      toast.error('Error', result.message || 'Verification failed. Please try again.');
    }
  } catch (err) {
    console.error('Verification error:', err);
    toast.error('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

// Request a new verification code
async function requestNewCode(silent = false) {
  if (resendCooldown.value > 0 && !silent) return;

  if (!silent) {
    isLoading.value = true;
  }

  try {
    // Request the verification code
    const result = await authStore.requestEmailVerification();

    if (result.success) {
      if (!silent) {
        toast.success('Success', result.message || 'Verification code sent successfully');
      }

      // Start cooldown
      startCooldown();
    } else {
      if (!silent) {
        toast.error('Error', result.message || 'Failed to send verification code');
      }
    }
  } catch (err) {
    console.error('Request code error:', err);
    if (!silent) {
      toast.error('Error', 'An unexpected error occurred');
    }
  } finally {
    if (!silent) {
      isLoading.value = false;
    }
  }
}

// Start cooldown timer for resend button
function startCooldown() {
  resendCooldown.value = 60; // 60 seconds cooldown

  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }

  cooldownInterval.value = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(cooldownInterval.value);
    }
  }, 1000);
}

// Navigate to dashboard after verification
function navigateToDashboard() {
  // Use the auth plugin's navigation helper if available
  if ($auth && $auth.navigation) {
    return $auth.navigation.toDashboard();
  }

  // Fallback to manual navigation
  if (process.env.NODE_ENV !== 'production') {
    console.log('Navigating to dashboard with user:', authStore.user);
  }

  if (authStore.user && authStore.user.username) {
    // Use direct path navigation instead of named route to avoid potential issues
    if (authStore.isSeller) {
      router.push(`/${authStore.user.username}/selling/dashboard`);
    } else {
      router.push(`/${authStore.user.username}/buying/dashboard`);
    }
  } else {
    // Fallback to home page
    router.push('/');
  }
}

// Debug auth state
function debugAuth() {
  const debug = authStore.debugAuthState();
  console.log('Debug result:', debug);

  // Also check if we can get the profile
  useCustomFetch('/api/user/profile', {
    method: 'GET'
  }).then(response => {
    console.log('Profile check response:', response);
  }).catch(error => {
    console.error('Profile check failed:', error);
  });

  // Check localStorage
  try {
    const storedUser = authStore.loadFromStorage('user');
    const storedRoles = authStore.loadFromStorage('roles');
    console.log('Stored user:', storedUser);
    console.log('Stored roles:', storedRoles);
  } catch (err) {
    console.error('Failed to check localStorage:', err);
  }

  toast.info('Debug', 'Auth state logged to console');
}
</script>