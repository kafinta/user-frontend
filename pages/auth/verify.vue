<template>
  <div class="flex flex-row-reverse select-none">
    <div style="" class="verify background hidden lg:flex w-2/3 bg-cover bg-center py-5 px-10 relative flex-col justify-end">
      <div class="bg-white rounded-md bg-opacity-80 p-5 w-full">
        <h1 class="text-2xl text-secondary">With the top of the line products and services available, my home has never looked or felt better. Amazing platform, definitely recommend!</h1>
        <p class="text-base 2xl:text-lg text-primary mt-5">Olivia Rhye</p>
        <p class="text-sm text-secondary 2xl:text-base">Founder, Catalog</p>
      </div>
    </div>
    <div class="w-full lg:w-1/2 h-screen flex items-center justify-center mx-auto px-6 md:px-8 lg:px-10 relative">
      <NavigationLogo @click="returnHome()" class="absolute top-5 left-10 w-36 lg:hidden" :class="is_small ? 'hidden' : ''" />

      <form @submit.prevent="handleVerification()" action="" class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : ''">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Verify your email.</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">We sent a six digit code to your email. Enter it below to verify your account</p>

        <div class="grid gap-6">
          <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
          <FormButton :loading="loadingState">Verify</FormButton>
        </div>
      </form>
    </div>

  </div>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true
})

import { ref, onMounted } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

const router = useRouter()
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

let is_small = false;
const loadingState = ref(false);
let error_state = false;
const code = ref();

const handleVerification = async () => {
loadingState.value = true;
router.push({name: 'username-buying-dashboard', params: {username: user.value.username}})
loadingState.value = false
}
onMounted(() => {
})
</script>
<style>
.verify {
  background: url('/images/verify.jpg');
}
</style>