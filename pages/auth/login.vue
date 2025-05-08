<template>
  <div class="flex justify-center items-center h-screen">

    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="returnHome()" class="w-48 mx-auto" />
      <div>
        <UiTypographyH2 class="font-medium text-3xl  text-secondary text-center">Welcome back.</UiTypographyH2>
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
        <FormButton :loading="isLoading">Sign In</FormButton>

        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Not a member yet? <nuxt-link to="/auth/signup" class="duration-500 ease-in-out hover:text-primary">Create Account</nuxt-link></p>
      </form>

    </main>

  </div>

</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true  // Only accessible when NOT authenticated, else redirect to home page
});
import { useRouter } from 'vue-router';
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const authStore = useAuthStore();
const { message, isLoading, status } = storeToRefs(authStore);
const router = useRouter();

const email = ref();
const password = ref();

async function handleSignin() {
  try {
    authStore.clearMessages();
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    if(status.value === 'success') {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: message.value, // Fixed: Need to use .value for refs
        life: 3000,
      });
      router.push({name: 'auth-verify'});
    } else if (status.value === 'error') { // Fixed: Using status.value
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message.value, // Fixed: Need to use .value for refs
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An unexpected error occurred',
      life: 3000,
    });
  }
}
</script>
<style>
.background {
  background: url('/images/login.jpg');
}
</style>