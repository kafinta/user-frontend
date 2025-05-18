<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Create account.</UiTypographyH2>
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
import { ref, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toast";

const authStore = useAuthStore();
const { message, isLoading, isAuthenticated } = storeToRefs(authStore);
const router = useRouter();
const toast = useAppToast();

const email = ref('');
const username = ref('');
const password = ref('');

// Clear any previous messages when the component is mounted
onMounted(() => {
  authStore.clearMessages();

  // If user is already authenticated, redirect them
  if (isAuthenticated.value) {
    navigateAfterAuth();
  }
});

async function handleSignup() {
  try {
    // Clear any previous messages
    authStore.clearMessages();

    console.log('Attempting signup with:', {
      email: email.value,
      username: username.value
    });

    const result = await authStore.signup({
      email: email.value,
      password: password.value,
      username: username.value
    });

    console.log('Signup result:', result);
    console.log('Auth state after signup:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
      needsVerification: authStore.needsVerification,
      isVerified: authStore.isVerified
    });

    // Check if we have user data and email verification is required, regardless of status
    if (result.data?.user) {
      toast.success('Success', 'Account created successfully');

      // Check if email verification is required
      const emailVerificationRequired = result.emailVerificationRequired === true;
      console.log('Email verification required:', emailVerificationRequired);

      if (emailVerificationRequired) {
        // Navigate to verification page
        console.log('Redirecting to verification page');
        router.push('/auth/verify?fromSignup=true');
      } else {
        // Navigate to dashboard or home
        console.log('No verification needed, proceeding to dashboard');
        navigateAfterAuth();
      }
    } else {
      console.log('Signup failed:', message.value);
      toast.error('Error', message.value || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Signup error:', error);
    toast.error('Error', 'An unexpected error occurred');
  }
}

function navigateAfterAuth() {
  const { user, isVerified } = storeToRefs(authStore);

  if (!isVerified.value) {
    // If not verified, go to verification page
    router.push({ name: 'auth-verify' });
  } else if (user.value && user.value.username) {
    // If verified and we have a username, go to dashboard
    router.push({
      name: 'username-buying-dashboard',
      params: { username: user.value.username }
    });
  } else {
    // Fallback to home page
    router.push('/');
  }
}
</script>