<template>
  <div class="flex select-none">
    <div class="background hidden lg:flex w-2/3 bg-cover bg-center py-5 px-10 relative flex-col justify-between">
      <NavigationLogoMonotone @click="returnHome()" class="w-36 cursor-pointer text-secondary" />

      <div class="bg-white rounded-md bg-opacity-80 p-5 bottom-5 w-full">
        <h1 class="text-2xl text-secondary">With the top of the line products and services available, my home has never looked or felt better. Amazing platform, definitely recommend!</h1>

        <p class="text-base 2xl:text-lg text-primary mt-5">Olivia Rhye</p>
        <p class="text-sm text-secondary 2xl:text-base">Founder, Catalog</p>

      </div>
    </div>

    <div class="w-full lg:w-1/2 h-screen flex items-center justify-center mx-auto px-6 md:px-8 lg:px-10 relative">
      <NavigationLogo @click="returnHome()" class="absolute top-5 left-10 w-36 lg:hidden" :class="is_small ? 'hidden' : ''" />

      <div @submit.prevent="signIn()" action="" class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : ''">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Welcome back.</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">Enter your details to resume your session.</p>

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

        <form class="grid gap-4">
          <FormInput label="Email" v-model="form.email" placeholder="Enter your email address"></FormInput>

          <div class="w-full mb-5">
            <FormInput :error="error_state" label="Password" type="password" v-model="form.password" placeholder="Enter your password"></FormInput>

            <div class="flex justify-between items-center mt-2 w-full">
            
              <p :class="error_state ? 'opacity-100' : 'opacity-0'" class="text-sm text-red-600 mt-2 duration-300 ease-in-out ">Wrong username or password</p>

              <nuxt-link to="/forgot" :class="error_state ? 'hidden' : 'block'" class="text-sm text-secondary text-opacity-50 hover:text-opacity-100 duration-500 ease-in-out">Forgot password?</nuxt-link>

            </div>

          </div>

          <FormButton :loading="loadingState">Sign In</FormButton>
        </form>
        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Not a member yet? <nuxt-link to="/signup" class="duration-500 ease-in-out hover:text-primary">Create Account</nuxt-link></p>
      </div>
    </div>
  </div>

</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  data() {
    return {
      error_state: false,
      form: {
        email: '',
        password: ''
      },
      is_small: false,
      loadingState: false
    }
  },

  methods: {
    ...mapActions({
      login : 'authentication/loginUser'
    }),


    signIn(){
      this.loadingState = true
      this.login({
        email: this.form.email,
        password: this.form.password,
      })
      .then(() => {
        this.$router.push({name: '_user-buying', params: {user: user_info.username}})
        this.loadingState = false
        console.log(user)
      })
      .catch(error => {
        this.error_state = true
        this.loadingState = false
        this.form.password = ''
        // this.$toast.error("Wrong username or password", {
        //   duration: 2000,
        // });
      })
    },  
  },
  
  mounted(){
    if (window.innerWidth <= 320) {
      this.is_small = true
    }
  },

  computed: {
    ...mapGetters({
      user_info: "authentication/getUserInfo",
    }),
  },
}
</script>
<style>
.background {
  background: url('../assets/images/login.jpg');
}
</style>