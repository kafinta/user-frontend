<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Create account.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">You are just a few steps away.</UiTypographyP>
      </div>

      <form @submit.prevent="handleSignup()" class="grid gap-4">
        <FormInput
          label="Email"
          type="email"
          v-model:inputValue="email"
          class="w-full"
          :error="Array.isArray(errors.email) ? errors.email.join(' ') : (typeof errors.email === 'string' ? errors.email : '')"
        />
        <FormInput
          label="Username"
          type="text"
          v-model:inputValue="username"
          class="w-full"
          :error="Array.isArray(errors.username) ? errors.username.join(' ') : (typeof errors.username === 'string' ? errors.username : '')"
        />
        <FormInput
          label="Password"
          type="password"
          v-model:inputValue="password"
          class="w-full"
          :error="Array.isArray(errors.password) ? errors.password.join(' ') : (typeof errors.password === 'string' ? errors.password : '')"
        />

        <FormButton :loading="buttonLoading">Sign Up</FormButton>
        <p class="text-sm w-fit -mt-2 mx-auto text-secondary text-center">Already a member? <NuxtLink to="/auth/login" class="duration-500 ease-in-out hover:text-primary">Sign In</NuxtLink></p>
      </form>

      <!-- OAuth Signup Options -->
      <AuthOAuthButtons />
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true
});

useHead({
  title: 'Sign Up | Kafinta',
  meta: [
    { name: 'description', content: 'Create your Kafinta account to start buying and selling products' }
  ]
});

import { useRouter } from 'vue-router';
import { ref } from "vue";
import { useAppToast } from "~/utils/toastify";

const buttonLoading = ref(false);
const router = useRouter();
const toast = useAppToast();
const errors = ref({});

const email = ref('');
const username = ref('');
const password = ref('');

async function handleSignup() {
  try {
    buttonLoading.value = true;
    errors.value = {};

    // Required field validation
    let hasError = false;
    if (!email.value) {
      errors.value.email = 'Email is required.';
      hasError = true;
    }
    if (!username.value) {
      errors.value.username = 'Username is required.';
      hasError = true;
    }
    if (!password.value) {
      errors.value.password = 'Password is required.';
      hasError = true;
    }

    // Password validation: at least one uppercase and one special character
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[^A-Za-z0-9]/;
    if (password.value && (!uppercaseRegex.test(password.value) || !specialCharRegex.test(password.value))) {
      errors.value.password = 'Password must include at least one uppercase letter and one special character.';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const response = await useCustomFetch('/api/user/signup', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        username: username.value
      }
    });

    if (response.status === 'success') {
      // Handle auth success (no longer async)
      const authApi = useAuthApi();
      authApi.handleAuthSuccess(response);

      toast.success(response.message || 'Account created successfully');
      router.push('/auth/verify');
    } else {
      errors.value = response.errors || {};
      toast.error(response?.message || 'Signup failed');
    }
  } catch (err) {
    console.error('Signup error:', err);

    // Extract backend error message from the error response
    errors.value = err?.data?.errors || {};
    const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred';
    toast.error(errorMessage);
  } finally {
    buttonLoading.value = false;
  }
}
</script>
