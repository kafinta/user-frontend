<template>
  <div class="flex justify-center items-center h-screen">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="router.push('/');" class="w-48 mx-auto" />
      <div>
        <UiTypographyH2 class="font-medium text-3xl text-secondary text-center">Welcome back.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">Enter your details to resume your session.</UiTypographyP>
      </div>
      <form @submit.prevent="handleSignin()" class="grid gap-4">
        <FormInput label="Email" type="email" v-model:inputValue="email" class="w-full" />
        <FormInput label="Password" type="password" v-model:inputValue="password" class="w-full" />
        <div class="flex justify-between items-center mb-5">
          <nuxt-link to="/auth/forgot" class="text-sm text-secondary hover:text-primary duration-300 ease-in-out">Forgot password?</nuxt-link>
          <FormCheckbox
            v-model="remember_me"
            binary
            size="small"
            label="Remember Me?"
          />
        </div>
        <FormButton :loading="buttonLoading">Sign In</FormButton>
        <p class="text-sm text-secondary text-center">
          Not a member yet?
          <nuxt-link to="/auth/signup" class="duration-300 ease-in-out hover:text-primary">
            Create Account
          </nuxt-link>
        </p>
      </form>

      <!-- OAuth Login Options -->
      <AuthOAuthButtons />
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  guestOnly: true  // Only accessible when NOT authenticated, else redirect to dashboard
});

import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from "~/utils/toastify";

const toast = useAppToast();
const authStore = useAuthStore();
// Use a separate loading state for the button instead of the auth store's loading state
const buttonLoading = ref(false);
const router = useRouter();
const route = useRoute();

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
    if (!authStore.isAuthenticated) {
      authStore.initialize();
    }
  }
});

async function handleSignin() {
  try {
    buttonLoading.value = true;

    if (!email.value || !password.value) {
      toast.error('Please enter your email and password');
      return;
    }

    // Direct API call in the page component
    const response = await useCustomFetch('/api/user/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        remember_me: remember_me.value
      }
    });

    if (response.status === 'success') {
      // Use the enhanced auth API to handle success
      const authApi = useAuthApi();
      await authApi.handleAuthSuccess(response);

      toast.success(response.message || 'Login successful');

      if (response.needsVerification || !authStore.isVerified) {
        router.push('/auth/verify');
      } else {
        navigateToDashboard();
      }
    } else {
      toast.error(response?.message || 'Login failed');
    }
  } catch (err) {
    console.error('Login error:', err);
    toast.error('An unexpected error occurred');
  } finally {
    buttonLoading.value = false;
  }
}

function navigateToDashboard() {
  // Check if there's a redirect URL in the query parameters first
  if (redirectPath.value) {
    router.push(redirectPath.value);
    return;
  }

  // Use the shared navigation helper
  const authApi = useAuthApi();
  authApi.navigateToDashboard();
}
</script>
