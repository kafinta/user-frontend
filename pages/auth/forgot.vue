<template>
  <div class="flex justify-center items-center h-screen">

    <div class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <NavigationLogo @click="returnHome()" class="w-48 mx-auto" />
      <div v-if="!verification_passed">
        <UiTypographyH2 class="font-medium text-3xl  text-secondary text-center">Verify your email.</UiTypographyH2>
        <UiTypographyP class="text-sm text-secondary text-center">We sent a six digit code to your email. Enter it below to verify your account</UiTypographyP>

        <form @submit.prevent="verify()" class="grid gap-4 mt-8">
          <InputOtp v-model="code" :length="6" integerOnly class="justify-between"/>
          <FormButton :loading="loadingState">Verify</FormButton>
        </form>
      </div>


      <div v-else>
        <h1 class="font-medium text-3xl w-fit text-secondary">Reset your password</h1>
        <p class="text-sm text-secondary mb-8">Choose a new password to use with your account.</p>

        <form @submit.prevent="updatePassword()" class="grid gap-4 mt-8">
          <FormInput label="New password" v-model:inputValue="new_password" placeholder="Enter your new password"></FormInput>
          <FormButton :loading="loadingStatePassword">Update Password</FormButton>
        </form>
      </div> 
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  authOnly: true
})

import { ref } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();

const code = ref('');
const verification_passed = ref(false);
const loadingState = ref(false);
const loadingStatePassword = ref(false);
const new_password = ref('');

function verify(){
  loadingState.value = true;
  setTimeout(() => {
    loadingState.value = false;
    verification_passed.value = true;
  }, 2000);
}

function updatePassword(){
  loadingStatePassword.value = true;
  setTimeout(() => {
    loadingStatePassword.value = false;
    router.push({name: 'auth-login'});
  }, 2000);
}

function returnHome(){
  router.push({path: '/'})
}
</script>
