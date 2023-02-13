<template>
  <div class="flex select-none">
    <div style="" class="background hidden lg:flex w-2/3 bg-cover bg-center py-5 px-10 relative flex-col justify-between">
      <NavigationLogoOneColor @click="returnHome()"  class="w-36 cursor-pointer text-white" />

      <div class="bg-white rounded-md bg-opacity-80 p-5 bottom-5 w-full">
        <h1 class="text-2xl text-secondary">With the top of the line products and services available, my home has never looked or felt better. Amazing platform, definitely recommend!</h1>

        <p class="text-base 2xl:text-lg text-primary mt-5">Olivia Rhye</p>
        <p class="text-sm text-secondary 2xl:text-base">Founder, Catalog</p>

      </div>
    </div>

    <div class="w-full lg:w-1/2 h-screen flex items-center justify-center mx-auto px-6 md:px-8 lg:px-10 relative">
      <NavigationLogo @click="returnHome()" class="absolute top-5 left-10 w-36 lg:hidden" :class="is_small ? 'hidden' : ''" />

      <form @submit.prevent="verify()" action="" class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : verification_passed ? 'hidden' : ''">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Verify your email.</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">We sent a six digit code to your email. Enter it below to verify your account</p>

        <div class="grid gap-4">
          <FormInput :centerText="true" label="Verification code" v-model="code" placeholder="X X X X X X"></FormInput>
          <FormButton :loading="loadingState">Verify</FormButton>
        </div>
      </form>

      <form @submit.prevent="updatePassword()" action="" class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : verification_passed ? 'block' : 'hidden'">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Reset your password</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">Choose a new password to use with your account.</p>

        <div class="grid gap-4">
          <FormInput label="New password" v-model="new_password" placeholder="Enter your new password"></FormInput>
          <FormButton :loading="loadingStatePassword">Update Password</FormButton>
        </div>
      </form> 
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      error_state: false,
      code: '',
      is_small: false,
      loadingState: false,
      loadingStatePassword: false,
      new_password: '',
      verification_passed: false,
    }
  },

  methods: {
    verify(){
      this.loadingState = true
      setTimeout(() => {
        this.verification_passed = true
      }, 2000);
    },

    updatePassword(){
      this.loadingStatePassword = true
      setTimeout(() => {
        return navigateTo('/login')
      }, 2000);
    },

    returnHome(){
      return navigateTo('/')
    }
  },
  
  created(){
    if (process.client && window.innerWidth <= 320) {
      this.is_small = true
    }
  },
}
</script>
<style>
.background {
  background: url('../assets/images/forgot.jpg');
}
</style>