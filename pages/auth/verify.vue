<template>
  <div class="flex justify-center items-center h-screen">
    <div class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="returnHome()" class="w-48 mx-auto" />

      <div>
        <UiTypographyH2 class="font-medium text-3xl  text-secondary text-center">Verify your email.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">We sent a six digit code to your email. Enter it below to verify your account</UiTypographyP>
      </div>
      <form @submit.prevent="handleVerification()" class="grid gap-4">
        <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
        <FormButton :loading="loadingState">Verify</FormButton>
      </form>
    </div>

  </div>
</template>
<script setup>
// definePageMeta({
//   middleware: ['auth'],
//   authOnly: true
// })

import { useRouter } from 'vue-router';
import { ref } from "vue";
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const loadingState = ref(false);
const code = ref();

const handleVerification = async () => {
  loadingState.value = true;
  router.push({name: 'username-buying-dashboard', params: {username: user.value.username}});
  loadingState.value = false;
}
</script>
