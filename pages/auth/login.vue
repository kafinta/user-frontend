<template>
  <div class="flex select-none">
    <div class="background hidden lg:flex w-2/3 bg-cover bg-center py-5 px-10 relative flex-col justify-end">
      <div class="bg-white rounded-md bg-opacity-80 p-5 w-full">
        <h1 class="text-2xl text-secondary">With the top of the line products and services available, my home has never looked or felt better. Amazing platform, definitely recommend!</h1>

        <p class="text-base 2xl:text-lg text-primary mt-5">Olivia Rhye</p>
        <p class="text-sm text-secondary 2xl:text-base">Founder, Catalog</p>

      </div>
    </div>

    <div class="w-full lg:w-1/2 h-screen flex items-center justify-center mx-auto px-6 md:px-8 lg:px-10 relative">
      <NavigationLogo @click="returnHome()" class="absolute top-5 left-10 w-36 lg:hidden" :class="is_small ? 'hidden' : ''" />
      <div @submit.prevent="handleSignin()" action="" class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : ''">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Welcome back.</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">Enter your details to resume your session.</p>

        <form class="grid gap-4">
          <FloatLabel variant="on" class="w-full">
            <InputText id="email_label" type="email" v-model="email" fluid/>
            <label for="email_label">Email</label>
          </FloatLabel>
          <FloatLabel variant="on">
            <InputText id="password_label" type="password" v-model="password" fluid />
            <label for="password_label">Password</label>
          </FloatLabel>
          <nuxt-link to="/auth/forgot" :class="error_state ? 'hidden' : 'block'" class="mb-5 text-sm text-secondary text-opacity-50 hover:text-opacity-100 duration-500 ease-in-out">Forgot password?</nuxt-link>

          <FormButton :loading="loadingState">Sign In</FormButton>
        </form>
        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Not a member yet? <nuxt-link to="/auth/signup" class="duration-500 ease-in-out hover:text-primary">Create Account</nuxt-link></p>
      </div>
    </div>

  </div>

</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true  // Only accessible when NOT authenticated
});
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';

const toast = useToast();
const authStore = useAuthStore();
const { message, isLoading, status } = storeToRefs(authStore);
const router = useRouter();

let is_small = ref(false);
let loadingState = ref(false);
let error_state = ref(false);
const email = ref();
const password = ref();

async function handleSignin() {
  try {
    authStore.clearMessages();
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    console.log(status.value)
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