<template>
  <LayoutsDashboard mode="seller" pageTitle="Onboarding">
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <main class="w-full max-w-md mx-auto rounded-xl p-8 border border-accent-200 bg-white space-y-6">
        <!-- Success Icon (when verified) -->
        <div v-if="onboardingState.emailVerified.value" class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Verify Email</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary mt-2">
            <span v-if="!onboardingState.emailVerified.value">Enter the verification code sent to your email address.</span>
            <span v-else>Your email address has been successfully verified!</span>
          </UiTypographyP>
        </div>

        <!-- Code Verification Form -->
        <div v-if="!onboardingState.emailVerified.value" class="space-y-6">
          <form @submit.prevent="verifyEmail" class="space-y-6">
            <div class="space-y-4">
              <FormOtpInput v-model="code" :length="6" integerOnly class="justify-center"/>
            </div>
            <FormButton :loading="isLoading" class="w-full">Verify Email</FormButton>
          </form>

          <div class="text-center">
            <button
              type="button"
              @click="requestNewCode"
              class="text-sm text-secondary hover:text-primary duration-300 ease-in-out"
              :disabled="resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
            </button>
          </div>
        </div>

        <!-- Success/Already Verified State -->
        <div v-else class="space-y-6 text-center">
          <FormButton @click="continueOnboarding" class="w-full">Continue Onboarding</FormButton>
        </div>
      </main>
    </div>
  </LayoutsDashboard>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify';
import { useOnboarding } from '@/composables/useOnboarding';

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { message, status, isVerified } = storeToRefs(authStore);
const toast = useAppToast();
const onboardingState = useOnboarding();

// State variables
const code = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);

// Check verification status on mount
onMounted(async () => {
  // Auth store auto-initializes when first accessed

  // Fetch onboarding progress
  await onboardingState.fetchProgress();

  // If email is already verified, show success state
  if (onboardingState.emailVerified.value) {
    // Email is already verified, no need to request new code
    return;
  }

  if (!isVerified.value) {
    // Request a new verification code on page load
    await requestNewCode(true);
  }
});

// Verify email with code
const verifyEmail = async () => {
  if (!code.value || code.value.length !== 6) {
    toast.error('Error', 'Please enter a valid 6-digit verification code');
    return;
  }

  isLoading.value = true;

  try {
    await authStore.verifyEmail(code.value);

    if (status.value === 'success') {
      // Update onboarding progress
      await onboardingState.fetchProgress();

      // Show success message
      toast.success('Success', message.value || 'Email verified successfully');

      // Reset the form
      code.value = '';

      // Redirect to onboarding page after a brief delay
      setTimeout(() => {
        continueOnboarding();
      }, 1500);
    } else {
      toast.error('Error', message.value || 'Verification failed. Please try again.');
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

// Request a new verification code
const requestNewCode = async (silent = false) => {
  if (resendCooldown.value > 0 && !silent) return;

  if (!silent) {
    isLoading.value = true;
  }

  try {
    // Direct API call on page (page-specific, not reusable)
    const response = await useCustomFetch('/api/user/resend-verification-email', {
      method: 'POST'
    });

    if (response.status === 'success') {
      if (!silent) {
        toast.success('Success', response.message || 'Verification code sent successfully');
      }

      // Start cooldown
      startCooldown();
    } else {
      if (!silent) {
        toast.error('Error', response?.message || 'Failed to send verification code');
      }
    }
  } catch (error) {
    if (!silent) {
      // Extract backend error message from the error response
      const errorMessage = error?.data?.message || error?.message || 'An unexpected error occurred';
      toast.error('Error', errorMessage);
    }
  } finally {
    if (!silent) {
      isLoading.value = false;
    }
  }
};

// Start cooldown for resend button
const startCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown

  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }

  cooldownInterval.value = setInterval(() => {
    resendCooldown.value--;

    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval.value);
      cooldownInterval.value = null;
    }
  }, 1000);
};

// Continue to next onboarding step
const continueOnboarding = async () => {
  // Refresh onboarding progress before continuing
  await onboardingState.fetchProgress();

  router.push({
    name: 'username-selling-onboarding',
    params: { username: route.params.username }
  });
};

// Clean up interval on component unmount
onBeforeUnmount(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }
});
</script>