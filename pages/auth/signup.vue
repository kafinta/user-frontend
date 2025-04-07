<template>
  <Toast position="top-center" />
  <div class="flex flex-row-reverse select-none">
    <div class="background hidden lg:flex w-2/3 bg-cover bg-center py-5 px-10 relative flex-col justify-end">

      <div class="bg-white rounded-md bg-opacity-80 p-5 w-full">
        <h1 class="text-2xl text-secondary">With the top of the line products and services available, my home has never looked or felt better. Amazing platform, definitely recommend!</h1>

        <p class="text-base 2xl:text-lg text-primary mt-5">Olivia Rhye</p>
        <p class="text-sm text-secondary 2xl:text-base">Founder, Catalog</p>

      </div>
    </div>

    <div class="w-full lg:w-1/2 h-screen flex items-center justify-center mx-auto px-6 md:px-8 lg:px-10 relative">
      <NavigationLogo @click="returnHome()" class="absolute top-5 left-10 w-36 lg:hidden" :class="is_small ? 'hidden' : ''" />

      <main class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : ''">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Create account.</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">You are just a few steps away.</p>

        
        <form @submit.prevent="handleSignup()" action="" class="grid gap-4">
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

          <FormButton :loading="isLoading" class="">Sign Up</FormButton>
        </form>
        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Already a member? <NuxtLink to="/auth/login" class="duration-500 ease-in-out hover:text-primary">Sign In</NuxtLink></p>
      </main>
    </div>
  </div>

</template>
<script setup>
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
const email = ref('');
const username = ref('');
const password = ref('');

function returnHome() {
  router.push('/');
}

async function handleSignup() {
  try {
    authStore.clearMessages();
    await authStore.signup({
      email: email.value,
      password: password.value,
      username: username.value
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
  background-image: url('/images/register.jpg');
}
</style>