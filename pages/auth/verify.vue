<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Verify your email</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">We've sent a verification code to your email. Enter it below to verify your account.</UiTypographyP>
      </div>

      <form @submit.prevent="verifyEmail()" class="grid gap-6 w-full">
        <FormOtpInput v-model="code" :length="6" integerOnly class="justify-between" />
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

import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";

const authStore = useAuthStore();
const { isVerified } = storeToRefs(authStore);
const router = useRouter();
const toast = useAppToast();

// State variables
const code = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);
const checkingStatus = ref(false);
const lastChecked = ref(null);
const autoCheckInterval = ref(null);
const tokenVerificationHandler = ref(null);

// Check verification status on mount
onMounted(async () => {
  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    await navigateToDashboard();
    return;
  }

  // Check if token verification was already successful (in case user navigated here after token verification)
  if (authStore.tokenVerificationSuccess) {
    toast.success('Your email has been verified via email link!');
    authStore.setTokenVerificationSuccess(false);
    setTimeout(async () => {
      await navigateToDashboard();
    }, 1500);
    return;
  }

  // Listen for immediate token verification events
  const handleTokenVerification = (event) => {
    console.log('Received immediate token verification event:', event.detail);
    toast.success('Your email has been verified via email link!');

    // Clear intervals
    if (autoCheckInterval.value) {
      clearInterval(autoCheckInterval.value);
    }
    if (cooldownInterval.value) {
      clearInterval(cooldownInterval.value);
    }

    // Reset store state
    authStore.setTokenVerificationSuccess(false);

    // Navigate immediately
    setTimeout(async () => {
      await navigateToDashboard();
    }, 1000); // Shorter delay for immediate event
  };

  // Store handler reference for cleanup
  tokenVerificationHandler.value = handleTokenVerification;
  window.addEventListener('email-verified-via-token', handleTokenVerification);

  // Request a new verification code silently
  await requestNewCode(true);

  // Start automatic verification status checking every 30 seconds
  startAutoCheck();
});

// Watch for changes in verification status
watch(isVerified, (newValue) => {
  if (newValue === true) {
    // If user becomes verified, show success message and redirect
    toast.success('Your email has been verified successfully!');
    setTimeout(() => {
      navigateToDashboard();
    }, 1500); // Short delay to show the toast
  }
});

// Clean up intervals and event listeners on component unmount
onBeforeUnmount(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }

  if (autoCheckInterval.value) {
    clearInterval(autoCheckInterval.value);
  }

  // Clean up event listener
  if (import.meta.client && tokenVerificationHandler.value) {
    window.removeEventListener('email-verified-via-token', tokenVerificationHandler.value);
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

// Watch for token verification success from verify-token page (fallback method)
watch(() => authStore.tokenVerificationSuccess, async (newValue) => {
  if (newValue) {
    // Use nextTick for immediate response
    await nextTick();

    // Token verification was successful, update UI
    toast.success('Your email has been verified via email link!');

    // Reset the state
    authStore.setTokenVerificationSuccess(false);

    // Clear any intervals since verification is complete
    if (autoCheckInterval.value) {
      clearInterval(autoCheckInterval.value);
    }
    if (cooldownInterval.value) {
      clearInterval(cooldownInterval.value);
    }

    // Short delay before redirecting
    setTimeout(async () => {
      await navigateToDashboard();
    }, 1500);
  }
}, {
  immediate: true, // Check immediately in case the state is already set
  flush: 'sync' // Execute synchronously for faster response
});

// Check if the user's email has been verified (page-specific API call)
async function checkVerificationStatus(silent = false) {
  // Don't check if already checking
  if (checkingStatus.value) return;

  checkingStatus.value = true;

  try {
    // Direct API call on page (page-specific, not reusable)
    const response = await useCustomFetch('/api/user/email-verification-status', {
      method: 'GET'
    });

    // Update last checked timestamp
    lastChecked.value = Date.now();

    if (response.status === 'success' && response.data?.email_verified) {
      // Update auth state directly
      authStore.setVerified(true);

      if (!silent) {
        toast.success('Your email has been verified!');
      }

      // Short delay before redirecting
      setTimeout(() => {
        navigateToDashboard();
      }, 1500);
    } else if (!silent) {
      toast.info('Your email has not been verified yet.');
    }
  } catch (err) {
    console.error('Check verification status error:', err);
    if (!silent) {
      toast.error('Failed to check verification status.');
    }
  } finally {
    checkingStatus.value = false;
  }
}

// Verify email with code (page-specific API call)
async function verifyEmail() {
  if (!code.value || code.value.length !== 6) {
    toast.error('Please enter a valid 6-digit verification code');
    return;
  }

  isLoading.value = true;

  try {
    // Direct API call on page (page-specific, not reusable)
    const response = await useCustomFetch('/api/verify-email/code', {
      method: 'POST',
      body: { code: code.value }
    });

    if (response.status === 'success' || response?.data?.email_verified) {
      // Handle auth success (no longer async)
      const authApi = useAuthApi();
      authApi.handleAuthSuccess(response);

      toast.success(response.message || 'Email verified successfully');
      code.value = '';
      await navigateToDashboard();
    } else {
      toast.error(response?.message || 'Verification failed');
      code.value = '';
    }
  } catch (err) {
    console.error('Verification error:', err);
    toast.error('An unexpected error occurred. Please try again.');
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
    // Use the auth API composable for consistency
    const authApi = useAuthApi();
    const result = await authApi.requestEmailVerification();

    if (result?.success) {
      if (!silent) {
        toast.success(result.message);
      }

      // Start cooldown
      startCooldown();
    } else {
      if (!silent) {
        toast.error(result?.message || 'Failed to send verification email');
      }
    }
  } catch (err) {
    console.error('Request code error:', err);
    if (!silent) {
      toast.error('An unexpected error occurred');
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
async function navigateToDashboard() {
  const authApi = useAuthApi();
  await authApi.navigateToDashboard();
}
</script>