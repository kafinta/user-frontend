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
          <UiTypographyP class="text-sm text-secondary text-center">
            We've sent a verification code to <strong>{{ userEmail }}</strong>. 
            Enter it below to verify your account and continue to your dashboard.
          </UiTypographyP>
        </div>

        <form @submit.prevent="verifyWithCode()" class="grid gap-6 mt-6 w-full">
          <div class="space-y-2">
            <FormOtpInput 
              ref="otpInput"
              v-model="code" 
              :length="6" 
              integerOnly 
              class="justify-between" 
              :error="codeError"
              @complete="autoSubmit"
            />
            <p class="text-xs text-accent-600 text-center">
              The code will expire in 10 minutes. You can request a new one anytime.
            </p>
          </div>
          <FormButton :loading="isLoading">Verify Email</FormButton>
          <div class="flex flex-col items-center gap-3 mt-4">
            <button
              type="button"
              @click="resendCode"
              class="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="resendCooldown > 0 || isLoading"
            >
              {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
            </button>
            <button
              type="button"
              @click="changeEmail"
              class="text-sm text-accent-600 hover:text-primary"
              :disabled="isLoading"
            >
              Use a different email address
            </button>
          </div>
          
          <!-- Troubleshooting Section -->
          <div class="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-200">
            <UiTypographyH3 class="text-sm font-medium text-secondary mb-2">Didn't receive the email?</UiTypographyH3>
            <ul class="text-xs text-accent-600 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes - emails can take time to arrive</li>
              <li>• Try requesting a new code above</li>
            </ul>
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

import { ref, onMounted } from "vue";
import { useAuthStore } from '~/stores/auth';
import { useEmailVerification } from "~/composables/useEmailVerification";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Use the email verification composable
const {
  code,
  isLoading,
  resendCooldown,
  codeError,
  userEmail,
  initializeEmail,
  verifyWithCode,
  verifyWithToken,
  resendCode: resendCodeComposable,
  autoSubmit
} = useEmailVerification();

// Additional state for token verification
const verificationMode = ref('code'); // 'token' or 'code'
const tokenVerificationStatus = ref('loading'); // 'loading', 'success', 'error'
const errorMessage = ref('');
const otpInput = ref(null);

// Smart routing: Check URL for token parameter
onMounted(async () => {
  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    await navigateToDashboard();
    return;
  }

  // Initialize user email
  initializeEmail(route.query.email);

  // Check if there's a token in the URL
  const token = route.query.token;

  if (token) {
    // Token verification mode
    verificationMode.value = 'token';
    await handleTokenVerification(token);
  } else {
    // Code verification mode (default)
    verificationMode.value = 'code';
    // Auto-focus the OTP input after a short delay
    setTimeout(() => {
      if (otpInput.value) {
        otpInput.value.focus();
      }
    }, 500);
  }
});

// Handle token verification
async function handleTokenVerification(token) {
  tokenVerificationStatus.value = 'loading';

  const result = await verifyWithToken(token);

  if (result.success) {
    tokenVerificationStatus.value = 'success';
    // Auto-redirect after 2 seconds
    setTimeout(async () => {
      await navigateToDashboard();
    }, 2000);
  } else {
    tokenVerificationStatus.value = 'error';
    errorMessage.value = result.message;
  }
}

// Switch from token mode to code mode (when token verification fails)
function switchToCodeMode() {
  verificationMode.value = 'code';
  // Clear the token from URL
  router.replace('/auth/verify');
  // Auto-focus the OTP input
  setTimeout(() => {
    if (otpInput.value) {
      otpInput.value.focus();
    }
  }, 100);
}

// Resend code with focus callback
async function resendCode() {
  await resendCodeComposable(() => {
    // Focus the OTP input after resending
    if (otpInput.value) {
      otpInput.value.focus();
    }
  });
}

// Change email function
function changeEmail() {
  // Redirect to signup or login page to change email
  router.push('/auth/signup');
}

// Navigate to dashboard
async function navigateToDashboard() {
  const authApi = useAuthApi();
  await authApi.navigateToDashboard();
}
</script>