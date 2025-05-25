<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Email Verification</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">
          {{ statusMessage }}
        </UiTypographyP>
      </div>

      <div v-if="isLoading" class="flex justify-center">
        <UiIconsLoading class="w-12 h-12 text-primary" />
      </div>

      <div v-else-if="verificationStatus === 'success'" class="flex flex-col items-center gap-4">
        <UiIconsCheckCircle class="w-16 h-16 text-success" />
        <UiTypographyP class="text-center text-success">Your email has been successfully verified!</UiTypographyP>
        <FormButton @click="navigateToDashboard" class="mt-4">Continue to Dashboard</FormButton>
      </div>

      <div v-else-if="verificationStatus === 'error'" class="flex flex-col items-center gap-4">
        <UiIconsXCircle class="w-16 h-16 text-error" />
        <UiTypographyP class="text-center text-error">{{ errorMessage }}</UiTypographyP>
        <div class="flex flex-col gap-2 mt-4">
          <FormButton @click="requestNewVerification" :loading="requestingNewCode">
            Request New Verification Email
          </FormButton>
          <NuxtLink to="/auth/verify" class="text-sm text-primary hover:underline text-center mt-2">
            Use verification code instead
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  isVerifyRoute: true
});

import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from "vue";
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useAppToast();

// State variables
const isLoading = ref(true);
const verificationStatus = ref('pending'); // 'pending', 'success', 'error'
const statusMessage = ref('Verifying your email...');
const errorMessage = ref('');
const requestingNewCode = ref(false);

// Get token from URL query parameter
const token = route.query.token;

// Verify email with token on mount
onMounted(async () => {
  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    navigateToDashboard();
    return;
  }

  // If no token is provided, show error
  if (!token) {
    verificationStatus.value = 'error';
    errorMessage.value = 'Verification token is missing. Please check your email link or request a new verification email.';
    statusMessage.value = 'Verification Failed';
    isLoading.value = false;
    return;
  }

  try {
    // Direct API call for token verification (page-specific)
    const response = await useCustomFetch('/api/verify-email/token', {
      method: 'POST',
      body: { token: token.toString() }
    });

    if (response.status === 'success' || response?.data?.email_verified) {
      verificationStatus.value = 'success';
      statusMessage.value = 'Email Verified Successfully';

      // Update auth state
      authStore.setVerified(true);
      authStore.setTokenVerificationSuccess(true); // Signal to verify page

      // Update user data if provided
      if (response.data?.user) {
        authStore.setUser(response.data.user);
      }

      toast.success(response.message || 'Email verified successfully');

      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigateToDashboard();
      }, 3000);
    } else {
      verificationStatus.value = 'error';
      errorMessage.value = response?.message || 'Verification failed. The token may be invalid or expired.';
      statusMessage.value = 'Verification Failed';
      toast.error(errorMessage.value);
    }
  } catch (err) {
    console.error('Verification error:', err);
    verificationStatus.value = 'error';
    errorMessage.value = 'An unexpected error occurred during verification. Please try again.';
    statusMessage.value = 'Verification Failed';
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
});

// Request a new verification email
async function requestNewVerification() {
  requestingNewCode.value = true;

  try {
    const result = await authStore.requestEmailVerification();

    if (result.success) {
      toast.success('Success', result.message);
      router.push('/auth/verify'); // Redirect to code verification page
    } else {
      toast.error('Error', result.message);
    }
  } catch (err) {
    console.error('Request verification error:', err);
    toast.error('Error', 'An unexpected error occurred. Please try again.');
  } finally {
    requestingNewCode.value = false;
  }
}

// Navigate to dashboard after verification
function navigateToDashboard() {
  const authApi = useAuthApi();
  authApi.navigateToDashboard();
}
</script>
