<template>
  <div class="flex justify-center items-center h-screen">

    <div class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />
      <div v-if="!verification_passed">
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Reset your password</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">Enter your email to receive a verification code</UiTypographyP>

        <form v-if="!code" @submit.prevent="requestCode()" class="grid gap-4 mt-8">
          <FormInput label="Email" type="email" v-model:inputValue="email" class="w-full" />
          <FormButton :loading="loadingState">Send Reset Code</FormButton>
        </form>

        <form v-else @submit.prevent="verify()" class="grid gap-4 mt-8">
          <UiTypographyP class="text-sm text-secondary text-center">Enter the 6-digit code sent to your email</UiTypographyP>
          <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
          <FormButton :loading="loadingState">Verify Code</FormButton>
          <button
            type="button"
            @click="code = ''"
            class="text-sm text-primary hover:underline text-center"
          >
            Change email
          </button>
        </form>
      </div>


      <div v-else>
        <h1 class="font-medium text-3xl w-fit text-secondary">Reset your password</h1>
        <p class="text-sm text-secondary mb-8">Choose a new password to use with your account.</p>

        <form @submit.prevent="updatePassword()" class="grid gap-4 mt-8">
          <FormInput label="New password" v-model:inputValue="new_password" placeholder="Enter your new password"></FormInput>
          <FormButton :loading="loadingStatePassword">Update Password</FormButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true
});

import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";

const router = useRouter();
const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);
const toast = useAppToast();

const code = ref('');
const verification_passed = ref(false);
const loadingState = ref(false);
const loadingStatePassword = ref(false);
const new_password = ref('');
const email = ref('');

onMounted(() => {
  authStore.clearMessages();
});

async function requestCode() {
  if (!email.value) {
    toast.error('Error', 'Please enter your email address');
    return;
  }

  loadingState.value = true;

  try {
    // In a real implementation, you would call an API to send a reset code
    // For now, we'll simulate a successful code sending
    toast.info('Sending', 'Sending verification code to your email...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    loadingState.value = false;
    code.value = ''; // Clear any existing code but set to empty string to show code input
    toast.success('Success', 'Verification code sent to your email');
  } catch (err) {
    console.error('Request code error:', err);
    toast.error('Error', 'An unexpected error occurred. Please try again.');
    loadingState.value = false;
  }
}

async function verify() {
  if (!code.value || code.value.length !== 6) {
    toast.error('Error', 'Please enter a valid 6-digit verification code');
    return;
  }

  loadingState.value = true;

  try {
    // In a real implementation, you would call an API to verify the reset code
    // For now, we'll simulate a successful verification
    toast.info('Verifying', 'Verifying your code...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    loadingState.value = false;
    verification_passed.value = true;
    toast.success('Success', 'Code verified successfully');
  } catch (err) {
    console.error('Verification error:', err);
    toast.error('Error', 'An unexpected error occurred. Please try again.');
    loadingState.value = false;
  }
}

async function updatePassword() {
  if (!new_password.value) {
    toast.error('Error', 'Please enter a new password');
    return;
  }

  loadingStatePassword.value = true;

  try {
    // In a real implementation, you would call an API to update the password
    // For now, we'll simulate a successful password update
    toast.info('Updating', 'Updating your password...');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    loadingStatePassword.value = false;
    toast.success('Success', 'Password updated successfully');

    // Redirect to login page
    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  } catch (err) {
    console.error('Password update error:', err);
    toast.error('Error', 'An unexpected error occurred. Please try again.');
    loadingStatePassword.value = false;
  }
}

function returnHome() {
  router.push('/');
}
</script>
