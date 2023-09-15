<template>
  <div class="flex flex-row-reverse select-none">
    <div class="background hidden lg:flex w-2/3 bg-cover bg-center py-5 px-10 relative flex-col justify-between">
      <div class="flex justify-end">
        <NavigationLogoMonotone @click="returnHome()"  class="w-36 cursor-pointer text-white" />
      </div>

      <div class="bg-white rounded-md bg-opacity-80 p-5 bottom-5 w-full">
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

        <div class="mb-6">
          <div class="mt-10 flex gap-5 items-center">
            <NuxtLink to="" class="hover:-translate-y-1 duration-300 ease-in-out flex gap-3 items-center justify-center w-full border rounded-md border-secondary border-opacity-20 py-3">
              <img src="@/assets/images/logos/facebook.svg" class="w-7" alt="">
              Facebook
            </NuxtLink>

            <NuxtLink to="" class="hover:-translate-y-1 duration-300 ease-in-out flex gap-3 items-center justify-center w-full border rounded-md border-secondary border-opacity-20 py-3">
              <img src="@/assets/images/logos/google.svg" class="w-7" alt="">
              Google
            </NuxtLink>
          </div>

          <div class="flex items-center justify-center relative w-full mt-5">
            <p class="text-secondary text-sm absolute bg-white px-6">OR</p>
            <div class="w-full h-[1px] bg-secondary bg-opacity-20"></div>
          </div> 
        </div>

        <form @submit.prevent="register()" action="" class="grid gap-4">
          <FormInput label="Email" v-model:inputValue="form.email" placeholder="Enter your email address"></FormInput>
          <FormInput label="Username" v-model:inputValue="form.username" placeholder="Choose your username"></FormInput>
          <div>
            <FormInput :error="error_state" label="Password" type="password" v-model:inputValue="form.password" placeholder="Enter your password"></FormInput>
            <p :class="error_state ? 'opacity-100' : 'opacity-0'" class="text-sm text-red-600 mt-2">Password must be at least 8 characters</p>
          </div>

          <FormButton :loading="loadingState" class="-mt-3">Sign Up</FormButton>
        </form>
        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Already a member? <NuxtLink to="/login" class="duration-500 ease-in-out hover:text-primary">Sign In</NuxtLink></p>
      </main>
    </div>
  </div>

</template>

<script>
import { mapActions } from 'pinia';
import { UserAuth } from '@/store/authentication';
export default {
  data() {
    return {
      form: {
        email: '',
        username: '',
        password: ''
      },
      is_small: false,
      loadingState: false,
      error_state: false
    }
  },

  methods: {
    ...mapActions(UserAuth, ['signup']),
    register(){
      this.loadingState = true
      this.signup({
        email: this.form.email,
        username: this.form.username,
        password: this.form.password,
      });
    },

    returnHome(){
      this.$router.push({path: '/'})
    }
  },
  
  mounted(){
    if (process.client && window.innerWidth <= 320) {
      this.is_small = true
    }
  },
}
</script>
<style>
.background {
  background-image: url('../assets/images/register.jpg');
}
</style>