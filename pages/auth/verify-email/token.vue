<template>
  <div class="flex justify-center items-center py-16">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <!-- Loading State -->
      <div v-if="verificationStatus === 'loading'" class="text-center space-y-6">
        <UiIconsLoading class="w-12 h-12 text-primary mx-auto" />
        <UiTypographyH3 class="font-medium text-3xl text-secondary">Verifying your email...</UiTypographyH3>
        <UiTypographyP class="text-sm text-secondary">Please wait while we verify your email address.</UiTypographyP>
      </div>

      <!-- Success State -->
      <div v-else-if="verificationStatus === 'success'" class="text-center space-y-6">
        <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center">
          <UiIconsSuccess class="w-16 h-16 text-green-600" />
        </div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary">Email Verified!</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary">Your email has been successfully verified.</UiTypographyP>
        <button @click="navigateToDashboard" class="w-full py-2 px-5 text-white font-medium text-base 2xl:text-lg justify-center rounded-md bg-secondary hover:bg-primary transition-colors duration-500">Continue to Dashboard</button>
      </div>

      <!-- Error State -->
      <div v-else-if="verificationStatus === 'error'" class="text-center space-y-6">
        <div class="w-20 h-20 mx-auto bg-red-200 rounded-full flex items-center justify-center">
          <UiIconsError class="w-16 h-16 text-red-600" />
        </div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary">Verification Failed</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary">{{ errorMessage }}</UiTypographyP>
        <div class="space-y-4">
          <NuxtLink to="/auth/verify-email/code" class="block w-full py-2 px-5 text-white font-medium text-base 2xl:text-lg justify-center rounded-md bg-secondary hover:bg-primary transition-colors duration-500 text-center">
            Enter Code Instead
          </NuxtLink>
          <NuxtLink to="/auth/verify-email/code" class="text-sm text-primary hover:underline block text-center">
            Try again with a new verification email
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

const { verifyWithToken } = useEmailVerification();

const verificationStatus = ref('loading'); // 'loading', 'success', 'error'
const errorMessage = ref('');

// Handle token verification on mount
onMounted(async () => {
  // If user is already verified, redirect them to dashboard
  if (authStore.isAuthenticated && authStore.isVerified) {
    await navigateToDashboard();
    return;
  }

  // Get token from URL
  const token = route.query.token;

  if (!token) {
    // No token provided, redirect to code verification
    await router.push('/auth/verify-email/code');
    return;
  }

  // Verify the token
  await handleTokenVerification(token);
});

// Handle token verification
async function handleTokenVerification(token) {
  verificationStatus.value = 'loading';

  const result = await verifyWithToken(token);

  if (result.success) {
    verificationStatus.value = 'success';
    // Auto-redirect after 2 seconds to allow UI to update
    setTimeout(async () => {
      await navigateToDashboard();
    }, 2000);
  } else {
    verificationStatus.value = 'error';
    errorMessage.value = result.message;
  }
}

// Navigate to dashboard
async function navigateToDashboard() {
  const authApi = useAuthApi();
  await authApi.navigateToDashboard();
}
</script>

