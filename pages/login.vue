<script setup>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()

let is_small = ref(false);
let loadingState = ref(false);
let error_state = ref(false);
const email = ref();
const password = ref();

const signIn= async () => {
  loadingState.value = true;
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')

  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('/user/auth/login', {
    method: 'POST',
    body: {
        email: email.value,
        password: password.value
    },
    onResponse(res) {
      if (res.response.status == 200) {
        toast.success(res.response._data.message, {
          theme: 'colored',
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        router.push({name: 'username-buying', params: {username: res.response._data.data.account.username}})
      } else {
      toast.error(res.response._data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored'
      })
    }
      email.value = '',
      password.value = ''
      loadingState.value = false
    },
  })
}
</script>
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
      <div @submit.prevent="signIn()" action="" class="w-full md:w-2/3 lg:w-full rounded-xl p-5" :class="is_small ? 'p-0' : ''">
        <h1 :class="is_small ? 'text-2xl' : ''" class="font-medium text-3xl w-fit text-secondary">Welcome back.</h1>
        <p :class="is_small ? 'mb-4' : ''" class="text-sm text-secondary mb-8">Enter your details to resume your session.</p>

        <form class="grid gap-4">
          <FormInput label="Email" v-model:inputValue="email" placeholder="Enter your email address"></FormInput>
          <div class="w-full mb-5">
            <FormInput :error="error_state" label="Password" type="password" v-model:inputValue="password" placeholder="Enter your password"></FormInput>
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
<style>
.background {
  background: url('/images/login.jpg');
}
</style>