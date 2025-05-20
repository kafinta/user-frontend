<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />
      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Welcome back.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">Enter your details to resume your session.</UiTypographyP>
      </div>
      <form @submit.prevent="handleSignin()" class="grid gap-4">
        <FloatLabel variant="on" class="w-full">
          <InputText id="email_label" type="email" v-model="email" fluid/>
          <label for="email_label">Email</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <InputText id="password_label" type="password" v-model="password" fluid />
          <label for="password_label">Password</label>
        </FloatLabel>
        <nuxt-link to="/auth/forgot" class="mb-5 text-sm text-secondary text-opacity-50 hover:text-opacity-100 duration-500 ease-in-out">Forgot password?</nuxt-link>
        <ClientOnly>
          <FormButton :loading="isLoading">Sign In</FormButton>
          <template #fallback>
            <FormButton :loading="false">Sign In</FormButton>
          </template>
        </ClientOnly>

        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Not a member yet? <nuxt-link to="/auth/signup" class="duration-500 ease-in-out hover:text-primary">Create Account</nuxt-link></p>
      </form>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true  // Only accessible when NOT authenticated, else redirect to dashboard
});

import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";
import { useNuxtApp } from '#app';

const toast = useAppToast();
const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);
const router = useRouter();
const route = useRoute();
const { $auth } = useNuxtApp();

// Check if there's a redirect parameter in the URL
const redirectPath = computed(() => {
  return route.query.redirect ? String(route.query.redirect) : null;
});

const email = ref('');
const password = ref('');

// Check authentication status when the component is mounted
onMounted(() => {
  // Only run on client side
  if (import.meta.client) {
    authStore.clearMessages();

    // Initialize auth store if needed
    if (!authStore.isAuthenticated) {
      authStore.initialize();
    }
  }
});

async function handleSignin() {
  try {
    authStore.clearMessages();

    if (!email.value || !password.value) {
      toast.error('Error', 'Please enter your email and password');
      return;
    }

    // Show loading toast
    toast.info('Logging in', 'Please wait while we log you in...');

    const result = await authStore.login({
      email: email.value,
      password: password.value,
      remember_me: true // Enable remember me by default
    });

    if (result.success) {
      // Show success toast
      toast.success('Success', result.message || 'Login successful');

      // Check if verification is needed
      if (result.needsVerification) {
        // Navigate to verification page
        setTimeout(() => {
          router.push('/auth/verify?fromLogin=true');
        }, 500);
      } else {
        // Navigate to dashboard
        setTimeout(() => {
          navigateToDashboard();
        }, 500);
      }
    } else {
      // Show error message
      toast.error('Error', result.message || 'Login failed. Please try again.');
    }
  } catch (err) {
    console.error('Login error:', err);
    toast.error('Error', 'An unexpected error occurred');
  }
}

function navigateToDashboard() {
  // Use the auth plugin's navigation helper if available
  if ($auth && $auth.navigation) {
    return $auth.navigation.toDashboard();
  }

  // Fallback to manual navigation
  const { user } = storeToRefs(authStore);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Navigating to dashboard with user:', user.value);
  }

  // Check if there's a redirect URL in the query parameters
  if (redirectPath.value) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Redirecting to:', redirectPath.value);
    }
    router.push(redirectPath.value);
    return;
  }

  if (user.value && user.value.username) {
    // Use direct path navigation instead of named route to avoid potential issues
    if (authStore.isSeller) {
      router.push(`/${user.value.username}/selling/dashboard`);
    } else {
      router.push(`/${user.value.username}/buying/dashboard`);
    }
  } else {
    // Fallback to home page
    router.push('/');
  }
}
</script>