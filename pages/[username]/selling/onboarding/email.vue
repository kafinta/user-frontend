<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <main class="w-full lg:w-1/2 2xl:w-1/2 mx-auto">
      <UiTypographyH3 class="text-center">Email Verification</UiTypographyH3>

      <div>
        <img src="/images/open_email.svg" alt="Open Email Icon" class="w-56 mx-auto mt-6">
        <UiTypographyP class="mt-4">We've sent a verification code to your email. Enter the code below to verify your email.</UiTypographyP>

        <form @submit.prevent="verifyEmail()" class="grid gap-6 w-full mt-6">
          <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
          <FormButton :loading="isLoading" class="max-w-64 mx-auto">Verify Email</FormButton>

          <div class="flex justify-center mt-2">
            <button
              type="button"
              @click="requestNewCode()"
              class="text-sm text-primary hover:underline"
              :disabled="resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
            </button>
          </div>
        </form>

        <div v-if="isVerified" class="flex justify-center mt-6">
          <FormButton @click="continueOnboarding" class="max-w-64">Continue Onboarding</FormButton>
        </div>
      </div>
    </main>
  </LayoutsSellerDashboard>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toast';
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
      onboardingState.updateStep('email', true);
      toast.success('Success', message.value || 'Email verified successfully');

      // Reset the form
      code.value = '';

      // Immediately continue to the next onboarding step
      continueOnboarding();
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
    if (!silent) {
      toast.error('Error', 'An unexpected error occurred');
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
const continueOnboarding = () => {
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