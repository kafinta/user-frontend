<template>
  <div class="flex justify-center items-center h-screen">

    <div class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />
      <div v-if="!verification_passed">
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Reset your password</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">Enter your email to receive a verification code</UiTypographyP>

        <form v-if="!codeSent" @submit.prevent="requestCode()" class="grid gap-4 mt-8">
          <FormInput label="Email" type="email" v-model:inputValue="email" class="w-full" />
          <FormButton :loading="loadingState">Send Reset Code</FormButton>
          <button type="button" class="text-sm text-primary hover:underline mt-2" @click="codeSent = true">Have a code already?</button>
        </form>

        <form v-else @submit.prevent="verify()" class="grid gap-4 mt-8">
          <UiTypographyP class="text-sm text-secondary text-center">Enter the 6-digit code sent to your email</UiTypographyP>
          <FormOtpInput v-model="code" :length="6" integerOnly class="justify-between" :error="codeError"/>
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
        <h1 class="font-medium text-3xl text-secondary text-center">Reset your password</h1>
        <p class="text-sm text-secondary mb-8 text-center">Choose a new password to use with your account.</p>

        <form @submit.prevent="updatePassword()" class="grid gap-4 mt-8">
          <FormInput label="New password" type="password" v-model:inputValue="new_password" placeholder="Enter your new password" />
          <FormInput label="New password" type="password" v-model:inputValue="new_password" placeholder="Enter your new password" />
          <FormInput label="Confirm password" type="password" v-model:inputValue="confirm_password" placeholder="Re-enter your new password" :error="confirmPasswordError" />
          <FormButton :loading="loadingStatePassword">Update Password</FormButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true // Only allow unauthenticated users
});

useHead({
  title: 'Forgot Password | Kafinta',
  meta: [
    { name: 'description', content: 'Reset your Kafinta account password' }
  ]
});

import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { useAppToast } from "~/utils/toastify";

const router = useRouter();
const route = useRoute();
const toast = useAppToast();

const code = ref('');
const codeSent = ref(false);
const verification_passed = ref(false);
const loadingState = ref(false);
const loadingStatePassword = ref(false);
const new_password = ref('');
const confirm_password = ref('');
const confirmPasswordError = ref('');
const email = ref('');
const codeError = ref('');
const token = ref('');

// On mount, check for token in query and restore codeSent from localStorage
onMounted(() => {
  const storedCodeSent = localStorage.getItem('forgot_code_sent');
  codeSent.value = storedCodeSent === 'true';
  // If token is present in query, show password reset form directly
  if (route.query.token) {
    token.value = String(route.query.token);
    verification_passed.value = true;
  }
});

// Watch codeSent and persist to localStorage
watch(codeSent, (val) => {
  localStorage.setItem('forgot_code_sent', val ? 'true' : 'false');
});

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
      codeSent.value = true;
      code.value = '';
      toast.success(response.message || 'Verification code sent to your email');
    } else {
      toast.error(response?.message || 'Failed to send verification code');
    }
  } catch (err) {
    console.error('Request code error:', err);

    // Extract backend error message from the error response
    const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.';
    toast.error(errorMessage);
  } finally {
    loadingState.value = false;
  }
}

async function verify() {
  if (!code.value || code.value.length !== 6) {
    codeError.value = 'Please enter a valid 6-digit verification code';
    toast.error('Please enter a valid 6-digit verification code');
    return;
  }

  loadingState.value = true;
  codeError.value = '';

  try {
    // Direct API call in the page component
    const response = await useCustomFetch('/api/verify-reset-code', {
      method: 'POST',
      body: { code: code.value }
    });

    if (response.status === 'success') {
      verification_passed.value = true;
      toast.success(response.message || 'Code verified successfully');
      // Optionally clear codeSent from localStorage
      localStorage.removeItem('forgot_code_sent');
    } else {
      codeError.value = Array.isArray(response.errors?.code) ? response.errors.code.join(' ') : (typeof response.errors?.code === 'string' ? response.errors.code : (response?.message || 'Invalid verification code'));
      toast.error(response?.message || 'Invalid verification code');
    }
  } catch (err) {
    console.error('Verification error:', err);

    // Extract backend error message from the error response
    codeError.value = err?.data?.errors?.code ? (Array.isArray(err.data.errors.code) ? err.data.errors.code.join(' ') : err.data.errors.code) : (err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.');
    toast.error(err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.');
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

  if (new_password.value !== confirm_password.value) {
    confirmPasswordError.value = 'Passwords do not match';
    return;
  } else {
    confirmPasswordError.value = '';
  }

  loadingStatePassword.value = true;

  try {
    // Direct API call in the page component
    const response = await useCustomFetch(token.value
      ? '/api/reset-password/token'
      : '/api/reset-password/code', {
      method: 'POST',
      body: token.value
        ? {
            token: token.value,
            password: new_password.value,
            password_confirmation: new_password.value
          }
        : {
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

    // Extract backend error message from the error response
    const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.';
    toast.error(errorMessage);
  } finally {
    loadingStatePassword.value = false;
  }
}

function returnHome() {
  router.push('/');
}
</script>
