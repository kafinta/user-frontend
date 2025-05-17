<template>
  <div class="flex justify-center items-center h-screen">
    <div class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div v-if="verificationMethod === 'code'">
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Verify your email.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">We sent a six digit code to your email. Enter it below to verify your account</UiTypographyP>

        <form @submit.prevent="handleCodeVerification()" class="grid gap-4 mt-6">
          <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
          <FormButton :loading="loadingState">Verify</FormButton>

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
      </div>

      <div v-else-if="verificationMethod === 'token'">
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Verifying your email</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">Please wait while we verify your email address...</UiTypographyP>

        <div class="flex justify-center my-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>

      <div v-else>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Email Verification</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">Enter the verification code sent to your email</UiTypographyP>

        <form @submit.prevent="handleCodeVerification()" class="grid gap-4 mt-6">
          <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
          <FormButton :loading="loadingState">Verify</FormButton>

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
          <FormButton @click="goToDashboard()">Go to Dashboard</FormButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  isVerifyRoute: true
})

import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toast";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { user, message, status, isVerified } = storeToRefs(authStore);
const toast = useAppToast();

// State variables
const loadingState = ref(false);
const code = ref('');
const verificationMethod = ref('code'); // 'code', 'token'
const resendCooldown = ref(0);
const cooldownInterval = ref(null);

// Check if there's a token in the URL
const token = computed(() => {
  return String(route.query.token || '');
});

// Initialize the page
onMounted(async () => {
  // Check if user is already verified
  if (isVerified.value) {
    // User is already verified, redirect to dashboard
    goToDashboard();
    return;
  }

  // Check if there's a token in the URL
  if (token.value) {
    verificationMethod.value = 'token';
    await verifyWithToken(token.value);
  } else {
    verificationMethod.value = 'code';
  }
});

// Handle code-based verification
const handleCodeVerification = async () => {
  if (!code.value || code.value.length !== 6) {
    toast.error('Error', 'Please enter a valid 6-digit verification code');
    return;
  }

  loadingState.value = true;

  try {
    await authStore.verifyEmail(code.value);

    if (status.value === 'success') {
      toast.success('Success', message.value || 'Email verified successfully');

      // Reset the form
      code.value = '';

      // Immediately redirect to dashboard
      goToDashboard();
    } else {
      toast.error('Error', message.value || 'Verification failed. Please try again.');
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    loadingState.value = false;
  }
};

// Handle token-based verification
const verifyWithToken = async (verificationToken) => {
  try {
    await authStore.verifyEmailWithToken(verificationToken);

    if (status.value === 'success') {
      toast.success('Success', message.value || 'Email verified successfully');

      // Immediately redirect to dashboard
      goToDashboard();
    } else {
      toast.error('Error', message.value || 'Verification failed. Please try again.');
      verificationMethod.value = 'code';
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred. Please try again.');
    verificationMethod.value = 'code';
  }
};

// Request a new verification code
const requestNewCode = async () => {
  if (resendCooldown.value > 0) return;

  loadingState.value = true;

  try {
    await authStore.requestEmailVerification();

    if (status.value === 'success') {
      toast.success('Success', message.value || 'Verification code sent successfully');

      // Start cooldown
      startCooldown();
    } else {
      toast.error('Error', message.value || 'Failed to send verification code');
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred');
  } finally {
    loadingState.value = false;
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

// Navigate to dashboard
const goToDashboard = () => {
  if (user.value && user.value.username) {
    router.push({
      name: 'username-buying-dashboard',
      params: { username: user.value.username }
    });
  } else {
    router.push('/');
  }
};

// Clean up interval on component unmount
onBeforeUnmount(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }
});
</script>
