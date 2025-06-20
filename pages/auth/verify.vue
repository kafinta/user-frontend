<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <!-- Token Verification Mode (Auto-triggered when token in URL) -->
      <div v-if="verificationMode === 'token'">
        <!-- Loading State -->
        <div v-if="tokenVerificationStatus === 'loading'" class="text-center space-y-6">
          <UiIconsLoading class="w-12 h-12 text-primary mx-auto" />
          <UiTypographyH3 class="font-medium text-3xl text-secondary">Verifying your email...</UiTypographyH3>
          <UiTypographyP class="text-sm text-secondary">Please wait while we verify your email address.</UiTypographyP>
        </div>

        <!-- Success State -->
        <div v-else-if="tokenVerificationStatus === 'success'" class="text-center space-y-6">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Email Verified!</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary">Your email has been successfully verified.</UiTypographyP>
          <FormButton @click="navigateToDashboard" class="w-full">Continue to Dashboard</FormButton>
        </div>

        <!-- Error State -->
        <div v-else-if="tokenVerificationStatus === 'error'" class="text-center space-y-6">
          <div class="w-20 h-20 mx-auto bg-red-200 rounded-full flex items-center justify-center">
            <UiIconsError class="w-16 h-16 text-red-600" />
          </div>
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Verification Failed</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary">{{ errorMessage }}</UiTypographyP>
          <div class="space-y-4">
            <FormButton @click="switchToCodeMode" class="w-full">Enter Code Instead</FormButton>
            <NuxtLink to="/auth/verify" class="text-sm text-primary hover:underline block text-center">
              Try again with a new verification email
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Code Verification Mode -->
      <div v-else>
        <div>
          <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Verify your email</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary text-center">We've sent a verification code to your email. Enter it below to verify your account.</UiTypographyP>
        </div>

        <form @submit.prevent="verifyWithCode()" class="grid gap-6 mt-6 w-full">
          <FormOtpInput v-model="code" :length="6" integerOnly class="justify-between" :error="codeError" />
          <FormButton :loading="isLoading">Verify Email</FormButton>
          <div class="flex flex-col items-center gap-4 mt-4">
            <button
              type="button"
              @click="resendCode"
              class="text-sm text-primary hover:underline"
              :disabled="resendCooldown > 0 || isLoading"
            >
              {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  isVerifyRoute: true
});

useHead({
  title: 'Verify Email | Kafinta',
  meta: [
    { name: 'description', content: 'Verify your email address to complete your Kafinta account setup' }
  ]
});

import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useAppToast();

// State variables
const verificationMode = ref('code'); // 'token' or 'code'
const tokenVerificationStatus = ref('loading'); // 'loading', 'success', 'error'
const code = ref('');
const isLoading = ref(false);
const resendCooldown = ref(0);
const cooldownInterval = ref(null);
const errorMessage = ref('');
const codeError = ref('');

// Smart routing: Check URL for token parameter
onMounted(async () => {
  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    await navigateToDashboard();
    return;
  }

  // Check if there's a token in the URL
  const token = route.query.token;

  if (token) {
    // Token verification mode
    verificationMode.value = 'token';
    await verifyWithToken(token);
  } else {
    // Code verification mode (default)
    verificationMode.value = 'code';
  }
});

// Clean up intervals on component unmount
onBeforeUnmount(() => {
  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
  }
});

// Verify email with token (from URL parameter)
async function verifyWithToken(token) {
  tokenVerificationStatus.value = 'loading';

  try {
    // Direct API call for token verification
    const response = await useCustomFetch('/api/verify-email/token', {
      method: 'POST',
      body: { token }
    });

    if (response.status === 'success' || response?.data?.email_verified) {
      // Handle auth success - backend now includes user data in response
      const authApi = useAuthApi();
      authApi.handleAuthSuccess(response);

      tokenVerificationStatus.value = 'success';
      toast.success(response.message || 'Email verified successfully');

      console.log('Token verification successful, auth state:', {
        isAuthenticated: authStore.isAuthenticated,
        user: authStore.user,
        isVerified: authStore.isVerified
      });

      // Auto-redirect after 2 seconds
      setTimeout(async () => {
        await navigateToDashboard();
      }, 2000);
    } else {
      tokenVerificationStatus.value = 'error';
      errorMessage.value = response?.message || 'Token verification failed';
    }
  } catch (err) {
    console.error('Token verification error:', err);
    tokenVerificationStatus.value = 'error';

    // Extract backend error message
    const backendErrorMessage = err?.data?.message || err?.message || 'Token verification failed. The link may be expired or invalid.';
    errorMessage.value = backendErrorMessage;
  }
}

// Switch from token mode to code mode (when token verification fails)
function switchToCodeMode() {
  verificationMode.value = 'code';
  // Clear the token from URL
  router.replace('/auth/verify');
}

// Verify email with code
async function verifyWithCode() {
  if (!code.value || code.value.length !== 6) {
    toast.error('Please enter a valid 6-digit verification code');
    return;
  }

  isLoading.value = true;
  codeError.value = '';

  try {
    // Direct API call for code verification
    const response = await useCustomFetch('/api/verify-email/code', {
      method: 'POST',
      body: { code: code.value }
    });

    if (response.status === 'success' || response?.data?.email_verified) {
      // Handle auth success
      const authApi = useAuthApi();
      authApi.handleAuthSuccess(response);

      toast.success(response.message || 'Email verified successfully');
      code.value = '';
      await navigateToDashboard();
    } else {
      codeError.value = Array.isArray(response.errors?.code) ? response.errors.code.join(' ') : (typeof response.errors?.code === 'string' ? response.errors.code : (response?.message || 'Verification failed'));
      toast.error(response?.message || 'Verification failed');
      code.value = '';
    }
  } catch (err) {
    console.error('Verification error:', err);
    // Extract backend error message
    codeError.value = err?.data?.errors?.code ? (Array.isArray(err.data.errors.code) ? err.data.errors.code.join(' ') : err.data.errors.code) : (err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.');
    toast.error(err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

// Resend verification code
async function resendCode() {
  if (resendCooldown.value > 0) return;

  isLoading.value = true;

  try {
    // Direct API call to resend verification email
    const response = await useCustomFetch('/api/user/resend-verification-email', {
      method: 'POST'
    });

    if (response.status === 'success') {
      toast.success(response.message || 'Verification email sent successfully');
      startCooldown();
    } else {
      toast.error(response?.message || 'Failed to send verification email');
    }
  } catch (err) {
    console.error('Request code error:', err);

    // Extract backend error message
    const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred';
    toast.error(errorMessage);
  } finally {
    isLoading.value = false;
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