<script setup>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { ref } from "vue";
const router = useRouter()

let is_small = false;
let loadingState = ref(false);
let error_state = false;
const email = ref();
const username = ref();
const password = ref();

const createUserProfile = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('/api/user/profile', {
    method: 'POST',
    onResponse(res) {
      console.log(res.response)
      if (res.response.status == 200) {
        toast.success(res.response._data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: 'colored'
        })
        router.push({name: 'verify'})
      } else {
        toast.error(res.response._data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: 'colored'
        })
      }
    },
  })
}

const handleUserSignup = async () => {
loadingState.value = true;
const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('/api/user/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': document.cookie.split('; ').find(cookie => cookie.startsWith('XSRF-TOKEN=')).split('=')[1]
  },
  body: {
    email: email,
    password: password,
    username: username
  },
  onResponse(res) {
    console.log(res.response)
    if (res.response.status == 200) {
      toast.success(res.response._data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored'
      })
      createUserProfile()
      router.push({name: 'verify'})
    } else {
      toast.error(res.response._data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored'
      })
    }
  },
})
loadingState.value = pending.value
}
</script>
<template>
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

        <form @submit.prevent="handleUserSignup()" action="" class="grid gap-4">
          <FormInput label="Email" v-model:inputValue="email" placeholder="Enter your email address"></FormInput>
          <FormInput label="Username" v-model:inputValue="username" placeholder="Choose your username"></FormInput>
          <div>
            <FormInput :error="error_state" label="Password" type="password" v-model:inputValue="password" placeholder="Enter your password"></FormInput>
            <p :class="error_state ? 'opacity-100' : 'opacity-0'" class="text-sm text-red-600 mt-2">Password must be at least 8 characters</p>
          </div>

          <FormButton :loading="loadingState" class="-mt-3">Sign Up</FormButton>
        </form>
        <p class="text-sm w-fit mx-auto mt-2 text-secondary text-center">Already a member? <NuxtLink to="/login" class="duration-500 ease-in-out hover:text-primary">Sign In</NuxtLink></p>
      </main>
    </div>
  </div>

</template>
<style>
.background {
  background-image: url('/images/register.jpg');
}
</style>