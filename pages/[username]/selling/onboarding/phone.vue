<template>
  <LayoutsDashboard mode="seller" pageTitle="Onboarding">
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <main class="w-full max-w-md mx-auto rounded-xl p-8 border border-accent-200 bg-white space-y-6">
        <!-- Success Icon (when verified) -->
        <div v-if="step === 'verified'" class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Verify Phone</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary mt-2">
            <span v-if="step === 'phone_input'">Enter your phone number to receive a verification code.</span>
            <span v-else-if="step === 'code_verification'">Enter the verification code sent to your phone number.</span>
            <span v-else>Your phone number has been successfully verified!</span>
          </UiTypographyP>
        </div>

        <!-- Phone Input Step -->
        <div v-if="step === 'phone_input'" class="space-y-6">
          <form @submit.prevent="sendVerificationCode" class="space-y-6">
            <div class="space-y-2">
              <FormInput
                label="Phone Number"
                type="tel"
                v-model:inputValue="phoneNumber"
                placeholder="+1234567890"
                :error="!!phoneError"
                class="w-full"
              />
              <div v-if="phoneError" class="text-sm text-red-600">
                {{ phoneError }}
              </div>
            </div>
            <FormButton :loading="isLoading" class="w-full">Send Verification Code</FormButton>
          </form>
        </div>

        <!-- Code Verification Step -->
        <div v-else-if="step === 'code_verification'" class="space-y-6">
          <form @submit.prevent="verifyCode" class="space-y-6">
            <div class="space-y-4">
              <FormOtpInput v-model="verificationCode" :length="6" integerOnly class="justify-center"/>
            </div>
            <FormButton :loading="isLoading" class="w-full">Verify Phone</FormButton>
          </form>

          <div class="text-center">
            <button
              type="button"
              @click="resendCode"
              class="text-sm text-secondary hover:text-primary duration-300 ease-in-out"
              :disabled="resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
            </button>
          </div>
        </div>

        <!-- Success/Already Verified Step -->
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
import { useCustomFetch } from '~/composables/useCustomFetch';
import { useAppToast } from '~/utils/toastify';
import { useOnboarding } from '@/composables/useOnboarding';

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
});

const router = useRouter();
const route = useRoute();
const toast = useAppToast();
const onboarding = useOnboarding();

// State variables
const step = ref('phone_input');
const phoneNumber = ref('');
const verificationCode = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);
const phoneError = ref('');

// Check if phone is already verified
onMounted(async () => {
  // Fetch onboarding progress
  await onboarding.fetchProgress();

  // If phone is already verified, show verified state
  if (onboarding.phoneVerified.value) {
    step.value = 'verified';
  }
});

// Send verification code to phone
const sendVerificationCode = async () => {
  // Basic validation
  if (!phoneNumber.value) {
    phoneError.value = 'Please enter a phone number';
    return;
  }

  // Validate phone number format (basic validation)
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneError.value = 'Please enter a valid phone number (e.g., +1234567890)';
    return;
  }

  phoneError.value = '';
  isLoading.value = true;

  try {
    // In a real implementation, this would call an API to send a verification code
    // For now, we'll simulate it with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Move to code verification step
    step.value = 'code_verification';

    // Start cooldown for resend button
    startCooldown();

    toast.success('Success', 'Verification code sent to your phone');
  } catch (error) {
    toast.error('Error', 'Failed to send verification code');
  } finally {
    isLoading.value = false;
  }
};

// Verify the code
const verifyCode = async () => {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    toast.error('Error', 'Please enter a valid 6-digit verification code');
    return;
  }

  isLoading.value = true;

  try {
    // Call the API to verify the phone number
    const response = await useCustomFetch('/api/seller/verify-phone', {
      method: 'POST',
      body: {
        phone_number: phoneNumber.value,
        verification_code: verificationCode.value
      }
    });

    if (response.status === 'success') {
      // Move to verified step to show success state
      step.value = 'verified';

      // Show success message
      toast.success('Success', response.message || 'Phone number verified successfully');

      // Redirect to onboarding page after a brief delay
      setTimeout(() => {
        continueOnboarding();
      }, 1500);
    } else {
      toast.error('Error', response.message || 'Verification failed. Please try again.');
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

// Resend verification code
const resendCode = async () => {
  if (resendCooldown.value > 0) return;

  isLoading.value = true;

  try {
    // In a real implementation, this would call an API to resend the code
    // For now, we'll simulate it with a timeout
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Start cooldown
    startCooldown();

    toast.success('Success', 'Verification code resent');
  } catch (error) {
    toast.error('Error', 'Failed to resend verification code');
  } finally {
    isLoading.value = false;
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
