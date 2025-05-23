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
          <UiTypographyP class="text-xs text-secondary mt-2">
            Check your email for a verification link or enter the code above.
          </UiTypographyP>

          <div class="mt-4 w-full flex flex-col items-center">
            <div v-if="checkingStatus" class="flex items-center justify-center">
              <UiIconsLoading class="w-5 h-5 text-primary mr-2" />
              <span class="text-sm">Checking verification status...</span>
            </div>
            <button
              v-else
              type="button"
              @click="checkVerificationStatus()"
              class="text-sm text-primary hover:underline"
            >
              I've already verified my email
            </button>
            <UiTypographyP v-if="lastChecked" class="text-xs text-secondary mt-1">
              Last checked: {{ new Date(lastChecked).toLocaleTimeString() }}
            </UiTypographyP>
          </div>
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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";
import { useNuxtApp } from '#app';

const authStore = useAuthStore();
const { isVerified } = storeToRefs(authStore);
const router = useRouter();
const toast = useAppToast();
const { $auth } = useNuxtApp();

// State variables
const code = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);
const checkingStatus = ref(false);
const lastChecked = ref(null);
const autoCheckInterval = ref(null);

// Check verification status on mount
onMounted(async () => {
  // Clear any previous messages
  authStore.clearMessages();

  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    navigateToDashboard();
    return;
  }

  // Request a new verification code silently
  await requestNewCode(true);

  // Start automatic verification status checking every 30 seconds
  startAutoCheck();
});

// Watch for changes in verification status
watch(isVerified, (newValue) => {
  if (newValue === true) {
    // If user becomes verified, show success message and redirect
    toast.success('Success', 'Your email has been verified successfully!');
    setTimeout(() => {
      navigateToDashboard();
    }, 1500); // Short delay to show the toast
  }
});

// Clean up intervals on component unmount
onBeforeUnmount(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }

  if (autoCheckInterval.value) {
    clearInterval(autoCheckInterval.value);
  }
});

// Start automatic verification status checking
function startAutoCheck() {
  // Clear any existing interval
  if (autoCheckInterval.value) {
    clearInterval(autoCheckInterval.value);
  }

  // Check immediately
  checkVerificationStatus(true);

  // Then check every 30 seconds
  autoCheckInterval.value = setInterval(() => {
    checkVerificationStatus(true);
  }, 30000); // 30 seconds
}

// Check if the user's email has been verified
async function checkVerificationStatus(silent = false) {
  // Don't check if already checking
  if (checkingStatus.value) return;

  checkingStatus.value = true;

  try {
    // Call the API to check verification status
    const result = await authStore.checkEmailVerificationStatus();

    // Update last checked timestamp
    lastChecked.value = Date.now();

    if (result.success && result.isVerified) {
      if (!silent) {
        toast.success('Success', 'Your email has been verified!');
      }

      // Short delay before redirecting
      setTimeout(() => {
        navigateToDashboard();
      }, 1500);
    } else if (!silent) {
      toast.info('Info', 'Your email has not been verified yet.');
    }
  } catch (err) {
    console.error('Check verification status error:', err);
    if (!silent) {
      toast.error('Error', 'Failed to check verification status.');
    }
  } finally {
    checkingStatus.value = false;
  }
}

// Verify email with code
async function verifyEmail() {
  if (!code.value || code.value.length !== 6) {
    toast.error('Please enter a valid 6-digit verification code');
    return;
  }

  isLoading.value = true;

  try {
    const result = await authStore.verifyEmail(code.value);

    if (result.success) {
      toast.success('Success', result.message);
      code.value = '';
      navigateToDashboard();
    } else {
      toast.error('Error', result.message);
      code.value = '';
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
        toast.success('Success', result.message);
      }

      // Start cooldown
      startCooldown();
    } else {
      if (!silent) {
        toast.error('Error', result.message);
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
  // Use the auth plugin's navigation helper
  if ($auth && $auth.navigation) {
    return $auth.navigation.toDashboard();
  }

  // Fallback to direct navigation if plugin not available
  if (authStore.user && authStore.user.username) {
    const username = authStore.user.username;
    const path = authStore.isSeller
      ? `/${username}/selling/dashboard`
      : `/${username}/buying/dashboard`;

    router.push(path);
  } else {
    // Fallback to home page if no user
    router.push('/');
  }
}
</script>