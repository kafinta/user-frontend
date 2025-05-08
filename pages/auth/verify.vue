<template>
  <div class="flex justify-center items-center h-screen">
    <div class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl  text-secondary text-center">Verify your email.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">We sent a six digit code to your email. Enter it below to verify your account</UiTypographyP>
      </div>
      <form @submit.prevent="handleVerification()" class="grid gap-4">
        <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
        <FormButton :loading="loadingState">Verify</FormButton>
      </form>
    </div>

  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  isVerifyRoute: true
})

import { useRouter } from 'vue-router';
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useToast } from "primevue/usetoast";

const router = useRouter();
const authStore = useAuthStore();
const { user, message, status } = storeToRefs(authStore);
const toast = useToast();

const loadingState = ref(false);
const code = ref('');

const handleVerification = async () => {
  if (!code.value || code.value.length !== 6) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please enter a valid 6-digit verification code',
      life: 3000
    });
    return;
  }

  loadingState.value = true;

  try {
    await authStore.verifyEmail(code.value);

    if (status.value === 'success') {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message.value || 'Email verified successfully',
        life: 3000
      });

      // Redirect to dashboard
      router.push({
        name: 'username-buying-dashboard',
        params: {username: user.value.username}
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message.value || 'Verification failed',
        life: 3000
      });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred',
      life: 3000
    });
  } finally {
    loadingState.value = false;
  }
}
</script>
