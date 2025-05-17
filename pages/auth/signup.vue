<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl  text-secondary text-center">Create account.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">You are just a few steps away.</UiTypographyP>
      </div>

      <form @submit.prevent="handleSignup()" class="grid gap-4">
        <FloatLabel variant="on" class="w-full">
          <InputText id="email_label" type="email" v-model="email" fluid/>
          <label for="email_label">Email</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="username_label" type="text" v-model="username" fluid />
          <label for="username_label">Username</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="password_label" type="password" v-model="password" fluid />
          <label for="password_label">Password</label>
        </FloatLabel>

        <FormButton :loading="isLoading">Sign Up</FormButton>
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
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toast";

const authStore = useAuthStore();
const { message, isLoading, status } = storeToRefs(authStore);
const router = useRouter();
const toast = useAppToast();

const email = ref('');
const username = ref('');
const password = ref('');

async function handleSignup() {
  try {
    console.log('Starting signup process...');
    authStore.clearMessages();

    // Debug auth state before signup
    authStore.debugAuthState();

    const result = await authStore.signup({
      email: email.value,
      password: password.value,
      username: username.value
    });

    console.log('Signup result:', result);

    // Debug auth state after signup
    authStore.debugAuthState();

    if(status.value === 'success') {
      console.log('Showing success toast...');
      toast.success('Success', message.value || 'Account created successfully');

      // Add a small delay before navigation to ensure toast is shown
      setTimeout(() => {
        router.push({name: 'auth-verify'});
      }, 500);
    } else if (status.value === 'error') {
      console.log('Showing error toast...');
      toast.error('Error', message.value || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('Error', 'An unexpected error occurred');
  }
}
</script>