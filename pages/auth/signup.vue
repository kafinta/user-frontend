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
        />
        <FormInput
          label="Username"
          type="text"
          v-model:inputValue="username"
          class="w-full"
        />
        <FormInput
          label="Password"
          type="password"
          v-model:inputValue="password"
          class="w-full"
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
  guestOnly: true
});

import { useRouter } from 'vue-router';
import { ref } from "vue";
import { useAppToast } from "~/utils/toastify";

const buttonLoading = ref(false);
const router = useRouter();
const toast = useAppToast();

const email = ref('');
const username = ref('');
const password = ref('');

async function handleSignup() {
  try {
    buttonLoading.value = true;

    if (!email.value || !username.value || !password.value) {
      toast.error('Please fill in all fields');
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
      // Use the enhanced auth API to handle success
      const authApi = useAuthApi();
      await authApi.handleAuthSuccess(response);

      toast.success(response.message);
      router.push('/auth/verify');
    } else {
      toast.error(response.message);
    }
  } catch (err) {
    console.error('Signup error:', err);
    toast.error('An unexpected error occurred');
  } finally {
    buttonLoading.value = false;
  }
}
</script>
