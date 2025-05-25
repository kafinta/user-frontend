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
  guestOnly: true // Only allow unauthenticated users
});

import { ref } from "vue";
import { useRouter } from 'vue-router';
import { useAppToast } from "~/utils/toastify";

const router = useRouter();
const toast = useAppToast();

const code = ref('');
const verification_passed = ref(false);
const loadingState = ref(false);
const loadingStatePassword = ref(false);
const new_password = ref('');
const email = ref('');



async function requestCode() {
  if (!email.value) {
    toast.error('Please enter your email address');
    return;
  }

  loadingState.value = true;

  try {
    // Direct API call in the page component
    const response = await useCustomFetch('/api/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    });

    if (response?.success) {
      code.value = ''; // Show code input form
      toast.success(response.message || 'Verification code sent to your email');
    } else {
      toast.error(response?.message || 'Failed to send verification code');
    }
  } catch (err) {
    console.error('Request code error:', err);
    toast.error('An unexpected error occurred. Please try again.');
  } finally {
    loadingState.value = false;
  }
}

async function verify() {
  if (!code.value || code.value.length !== 6) {
    toast.error('Please enter a valid 6-digit verification code');
    return;
  }

  loadingState.value = true;

  try {
    // Direct API call in the page component
    const response = await useCustomFetch('/api/verify-reset-code', {
      method: 'POST',
      body: { code: code.value }
    });

    if (response?.success) {
      verification_passed.value = true;
      toast.success(response.message || 'Code verified successfully');
    } else {
      toast.error(response?.message || 'Invalid verification code');
    }
  } catch (err) {
    console.error('Verification error:', err);
    toast.error('An unexpected error occurred. Please try again.');
  } finally {
    loadingState.value = false;
  }
}

async function updatePassword() {
  if (!new_password.value) {
    toast.error('Please enter a new password');
    return;
  }

  if (new_password.value.length < 8) {
    toast.error('Password must be at least 8 characters long');
    return;
  }

  loadingStatePassword.value = true;

  try {
    // Direct API call in the page component
    const response = await useCustomFetch('/api/reset-password/code', {
      method: 'POST',
      body: {
        code: code.value,
        password: new_password.value,
        password_confirmation: new_password.value
      }
    });

    if (response?.success) {
      toast.success(response.message || 'Password updated successfully');

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
    } else {
      toast.error(response?.message || 'Failed to update password');
    }
  } catch (err) {
    console.error('Password update error:', err);
    toast.error('An unexpected error occurred. Please try again.');
  } finally {
    loadingStatePassword.value = false;
  }
}

function returnHome() {
  router.push('/');
}
</script>
