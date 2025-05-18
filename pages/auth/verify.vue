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
  // Temporarily remove middleware to debug the issue
  // middleware: ['auth'],
  isVerifyRoute: true
});

import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toast";

const authStore = useAuthStore();
const { message, status } = storeToRefs(authStore);
const router = useRouter();
const toast = useAppToast();

// State variables
const code = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);

// Check verification status on mount
onMounted(async () => {
  // Clear any previous messages
  authStore.clearMessages();

  // Debug auth state
  console.log('Auth state on verify page mount:', {
    isAuthenticated: authStore.isAuthenticated,
    isVerified: authStore.isVerified,
    user: authStore.user,
    needsVerification: authStore.needsVerification
  });

  // Check if we need to manually check authentication status
  if (!authStore.isAuthenticated) {
    console.log('Not authenticated, checking profile...');
    try {
      // Try to get user profile to check authentication status
      const response = await useCustomFetch('/api/user/profile', {
        method: 'GET',
        skipCsrf: true,
        // Skip the automatic redirect
        onResponseError: ({ response }) => {
          console.log('Profile check failed:', response.status);
        }
      });

      console.log('Profile check response:', response);

      if (response.success && response.data?.user) {
        // Update user data
        authStore.setUser(response.data.user);

        // Update verification status
        authStore.setVerified(!!response.data.user.email_verified_at);

        console.log('Updated auth state:', {
          isAuthenticated: authStore.isAuthenticated,
          isVerified: authStore.isVerified,
          user: authStore.user
        });
      }
    } catch (error) {
      console.error('Failed to check profile:', error);
    }
  }

  // If user is already verified, redirect them
  if (authStore.isAuthenticated && authStore.isVerified) {
    console.log('User is authenticated and verified, redirecting to dashboard');
    navigateToDashboard();
    return;
  }

  // If user is not authenticated, check if we have a query parameter indicating we just signed up or logged in
  if (!authStore.isAuthenticated) {
    const route = useRoute();
    const fromSignup = route.query.fromSignup === 'true';
    const fromLogin = route.query.fromLogin === 'true';

    if (fromSignup || fromLogin) {
      console.log('User came from signup/login, proceeding with verification');
      // Continue with verification even though isAuthenticated might be false
      // This handles the case where the cookie might not be immediately recognized

      // Try to check profile again after a short delay
      setTimeout(async () => {
        try {
          const response = await useCustomFetch('/api/user/profile', {
            method: 'GET',
            skipCsrf: true
          });

          console.log('Delayed profile check:', response);

          if (response.success && response.data?.user) {
            authStore.setUser(response.data.user);
            authStore.setVerified(!!response.data.user.email_verified_at);
            console.log('Updated auth state after delay:', {
              isAuthenticated: authStore.isAuthenticated,
              user: authStore.user
            });
          }
        } catch (error) {
          console.error('Delayed profile check failed:', error);
        }
      }, 1000);
    } else {
      console.log('User is not authenticated, redirecting to login');
      router.push('/auth/login');
      return;
    }
  }

  console.log('User needs verification, requesting code');
  // Request a new verification code on page load (silently)
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
    const result = await authStore.verifyEmail(code.value);
    console.log('Verification result:', result);

    // Check if the verification was successful based on the result
    if (result.success || result.status === 'success' ||
        (result.message && result.message.toLowerCase().includes('success'))) {
      toast.success('Success', 'Email verified successfully');

      // Reset the form
      code.value = '';

      // Check if the user state was updated
      console.log('Auth state after verification in component:', {
        isAuthenticated: authStore.isAuthenticated,
        isVerified: authStore.isVerified,
        user: authStore.user
      });

      // Fetch user profile to ensure we have the latest data
      try {
        const profileResponse = await useCustomFetch('/api/user/profile', {
          method: 'GET',
          skipCsrf: true
        });

        if (profileResponse.success && profileResponse.data?.user) {
          authStore.setUser(profileResponse.data.user);
          authStore.setVerified(!!profileResponse.data.user.email_verified_at);
          console.log('User profile updated after verification in component');
        }
      } catch (profileError) {
        console.error('Failed to fetch profile after verification in component:', profileError);
      }

      // Redirect to dashboard after successful verification
      setTimeout(() => {
        navigateToDashboard();
      }, 1000);
    } else {
      toast.error('Error', message.value || 'Verification failed. Please try again.');
    }
  } catch (error) {
    console.error('Verification error:', error);
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
    // Check if we're authenticated first
    if (!authStore.isAuthenticated) {
      console.log('Not authenticated yet, checking profile before requesting code');
      try {
        const profileResponse = await useCustomFetch('/api/user/profile', {
          method: 'GET',
          skipCsrf: true
        });

        if (profileResponse.success && profileResponse.data?.user) {
          authStore.setUser(profileResponse.data.user);
          authStore.setVerified(!!profileResponse.data.user.email_verified_at);
          console.log('Updated auth state before requesting code:', {
            isAuthenticated: authStore.isAuthenticated,
            user: authStore.user
          });
        } else {
          console.log('Profile check failed, proceeding anyway');
        }
      } catch (profileError) {
        console.error('Profile check failed:', profileError);
      }
    }

    // Now request the verification code
    await authStore.requestEmailVerification();

    if (status.value === 'success') {
      if (!silent) {
        toast.success('Success', message.value || 'Verification code sent successfully');
      }

      // Start cooldown
      startCooldown();
    } else {
      if (!silent) {
        toast.error('Error', message.value || 'Failed to send verification code');
      }
    }
  } catch (error) {
    console.error('Request code error:', error);
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
  console.log('Navigating to dashboard with user:', authStore.user);

  if (authStore.user && authStore.user.username) {
    // Log the route we're navigating to
    console.log('Navigating to dashboard for user:', authStore.user.username);

    // Use direct path navigation instead of named route to avoid potential issues
    router.push(`/${authStore.user.username}/buying/dashboard`);
  } else {
    console.log('No username available, navigating to home page');
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
    method: 'GET',
    skipCsrf: true
  }).then(response => {
    console.log('Profile check response:', response);
  }).catch(error => {
    console.error('Profile check failed:', error);
  });

  toast.info('Debug', 'Auth state logged to console');
}
</script>