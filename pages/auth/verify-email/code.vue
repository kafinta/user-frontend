<template>
  <div class="flex justify-center items-center py-16">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <div v-if="mode === 'verify'">
        <NavigationLogo @click="router.push('/');" class="w-48 mx-auto mb-6" />
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Verify your email</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center mt-2">
          We've sent a verification code to <strong>{{ userEmail }}</strong>.
          Enter it below to verify your account and continue to your dashboard.
        </UiTypographyP>
        <form @submit.prevent="handleVerifyWithCode" class="grid gap-6 mt-6 w-full">
          <div class="space-y-2">
            <FormOtpInput 
              ref="otpInput"
              v-model="code" 
              :length="6" 
              integerOnly 
              class="justify-between" 
              :error="codeError"
              @complete="autoSubmitHandler"
            />
            <p class="text-xs text-accent-600 text-center">
              The code will expire in 10 minutes. You can request a new one anytime.
            </p>
          </div>
          <FormButton :loading="isLoading">Verify Email</FormButton>
          <div class="flex flex-col items-center gap-2">
            <button
              type="button"
              @click="mode = 'changeEmail'"
              class="text-sm text-accent-600 hover:text-primary"
              :disabled="isLoading"
            >
              Use a different email address
            </button>
            <button
              type="button"
              @click="resendCode"
              class="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="resendCooldown > 0 || isLoading"
            >
              {{ resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code' }}
            </button>
          </div>
        </form>
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
      </div>

      <div v-else-if="mode === 'changeEmail'">
        <NavigationLogo @click="router.push('/');" class="w-48 mx-auto mb-6" />
        <UiTypographyH3 class="text-lg font-medium text-secondary mb-2 text-center">Change your email address</UiTypographyH3>
        <form @submit.prevent="handleChangeEmail" class="space-y-3 mt-6">
          <FormInput
            label="New Email"
            type="email"
            v-model:inputValue="newEmail"
            :error="changeEmailErrors.email || undefined"
            class="w-full"
          />
          <FormInput
            label="Password"
            type="password"
            v-model:inputValue="password"
            :error="changeEmailErrors.password || undefined"
            class="w-full"
          />
          <FormButton :loading="isLoading">Update Email</FormButton>
          <button type="button" @click="mode = 'verify'" class="text-sm text-primary hover:underline block mx-auto mt-2">Back to verification</button>
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
import { useAuthApi } from "~/composables/useAuthApi";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const {
  code,
  isLoading,
  resendCooldown,
  codeError,
  userEmail,
  initializeEmail,
  verifyWithCode,
  resendCode: resendCodeComposable,
  updateEmail,
} = useEmailVerification();

const mode = ref('verify');
const newEmail = ref('');
const password = ref('');
const changeEmailErrors = ref({ email: '', password: '' });
const otpInput = ref(null);

// Initialize on mount
onMounted(async () => {
  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    await navigateToDashboard();
    return;
  }

  // Initialize user email
  initializeEmail(route.query.email);

  // Auto-focus the OTP input after a short delay
  setTimeout(() => {
    if (otpInput.value) {
      otpInput.value.focus();
    }
  }, 500);
});

// Resend code with focus callback
async function resendCode() {
  await resendCodeComposable(() => {
    // Focus the OTP input after resending
    if (otpInput.value) {
      otpInput.value.focus();
    }
  });
}

// Navigate to dashboard
async function navigateToDashboard() {
  const authApi = useAuthApi();
  await authApi.navigateToDashboard();
}

async function handleChangeEmail() {
  changeEmailErrors.value = { email: '', password: '' };
  if (!newEmail.value) {
    changeEmailErrors.value.email = 'Email is required.';
  }
  if (!password.value) {
    changeEmailErrors.value.password = 'Password is required.';
  }
  if (changeEmailErrors.value.email || changeEmailErrors.value.password) return;
  const result = await updateEmail(newEmail.value, password.value);
  if (result.success) {
    mode.value = 'verify';
    newEmail.value = '';
    password.value = '';
  }
}

async function handleVerifyWithCode() {
  const result = await verifyWithCode();
  if (result) {
    await navigateToDashboard();
  }
}

function autoSubmitHandler() {
  handleVerifyWithCode();
}
</script>

