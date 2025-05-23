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
        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Already a member? <NuxtLink to="/auth/login" class="duration-500 ease-in-out hover:text-primary">Sign In</NuxtLink></p>
      </form>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true
});

import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";

const authStore = useAuthStore();
// Use a separate loading state for the button instead of the auth store's loading state
const buttonLoading = ref(false);
const router = useRouter();
const toast = useAppToast();

const email = ref('');
const username = ref('');
const password = ref('');

onMounted(() => {
  authStore.clearMessages();
});

async function handleSignup() {
  try {
    // Set button loading state to true
    buttonLoading.value = true;

    authStore.clearMessages();

    if (!email.value || !username.value || !password.value) {
      toast.error('Error', 'Please fill in all fields');
      buttonLoading.value = false; // Reset loading state
      return;
    }

    const result = await authStore.signup({
      email: email.value,
      password: password.value,
      username: username.value
    });

    if (result.success) {
      toast.success('Success', result.message);
      router.push('/auth/verify');
      email.value = '';
      username.value = '';
      password.value = '';
    } else {
      toast.error('Error', result.message);
    }
  } catch (err) {
    console.error('Signup error:', err);
    toast.error('Error', 'An unexpected error occurred');
  } finally {
    // Always reset button loading state
    buttonLoading.value = false;
  }
}
</script>