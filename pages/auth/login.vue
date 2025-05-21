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
        <div class="flex justify-between items-center mb-5">
        <nuxt-link to="/auth/forgot" class="text-sm text-secondary hover:text-primary duration-300 ease-in-out">Forgot password?</nuxt-link>

        <div class="flex items-center gap-2">
          <Checkbox v-model="remember_me" inputId="remember_me" name="size" binary checked size="small" />
          <label for="remember_me" class="text-sm">Remember Me?</label>
        </div>
        </div>


        <FormButton :loading="buttonLoading">Sign In</FormButton>

        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Not a member yet? <nuxt-link to="/auth/signup" class="duration-300 ease-in-out hover:text-primary">Create Account</nuxt-link></p>
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
// Use a separate loading state for the button instead of the auth store's loading state
const buttonLoading = ref(false);
const router = useRouter();
const route = useRoute();
const { $auth } = useNuxtApp();

// Check if there's a redirect parameter in the URL
const redirectPath = computed(() => {
  return route.query.redirect ? String(route.query.redirect) : null;
});

const email = ref('');
const password = ref('');
const remember_me = ref(true); // Default to true for now

// Check authentication status when the component is mounted
onMounted(() => {
  if (import.meta.client) {
    authStore.clearMessages();

    if (!authStore.isAuthenticated) {
      authStore.initialize();
    }
  }
});

async function handleSignin() {
  try {
    // Set button loading state to true
    buttonLoading.value = true;

    authStore.clearMessages();

    if (!email.value || !password.value) {
      toast.error('Error', 'Please enter your email and password');
      buttonLoading.value = false; // Reset loading state
      return;
    }

    const result = await authStore.login({
      email: email.value,
      password: password.value,
      remember_me: remember_me.value // Use the value of the checkbox
    });

    if (result.success) {
      toast.success('Success', result.message);

      if (result.needsVerification) {
        router.push('/auth/verify');
      } else {
        navigateToDashboard();
      }
      email.value = '';
      password.value = '';
    } else {
      toast.error('Error', result.message);
    }
  } catch (err) {
    console.error('Login error:', err);
    toast.error('Error', 'An unexpected error occurred');
  } finally {
    // Always reset button loading state
    buttonLoading.value = false;
  }
}

function navigateToDashboard() {
  // Use the auth plugin's navigation helper if available
  if ($auth && $auth.navigation) {
    return $auth.navigation.toDashboard();
  }

  // Fallback to manual navigation
  const { user } = storeToRefs(authStore);

  // Check if there's a redirect URL in the query parameters
  if (redirectPath.value) {
    router.push(redirectPath.value);
    return;
  }

  if (user.value && user.value.username) {
    const username = user.user.username;
    const path = authStore.isSeller
      ? `/${username}/selling/dashboard`
      : `/${username}/buying/dashboard`;

    router.push(path);
  } else {
    router.push('/');
  }
}
</script>