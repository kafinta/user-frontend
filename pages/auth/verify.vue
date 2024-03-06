<script setup>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { ref, onMounted } from "vue";
const router = useRouter()

let is_small = false;
const loadingState = ref(false);
let error_state = false;
const email = ref();
const username = ref();
const password = ref();
const code = ref();

const handleVerification = async () => {
loadingState.value = true;
router.push({name: 'username-buying', params: {
  username: 'testing'
}})
// const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
// const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('/api/user/auth/register', {
//   method: 'POST',
//   body: {
//     email: email,
//     password: password,
//     username: username
//   },
//   onResponse(res) {
//     console.log(res.response)
//     if (res.response.status == 200) {
//       toast.success(res.response._data.message, {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         theme: 'colored'
//       })
//       router.push({name: 'verify'})
//     } else {
//       toast.error(res.response._data.message, {
//         position: toast.POSITION.BOTTOM_RIGHT,
//         theme: 'colored'
//       })
//     }
//   },
// })
loadingState.value = false
}

const getUserDetails = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('/api/user/profile', {
    method: 'GET',

    onResponse(res) {
      console.log(res.response)
      if (res.response.status == 200) {
        toast.success(res.response._data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: 'colored'
        })
        router.push({name: 'username-buying'})
      } else {
        toast.error(res.response._data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: 'colored'
        })
      }
    },
  })
}
onMounted(() => {
  getUserDetails()
})
</script>
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

        <div class="grid gap-4">
          <FormInput :centerText="true" label="Verification code" v-model:inputValue="code" placeholder="X X X X X X"></FormInput>
          <FormButton :loading="loadingState">Verify</FormButton>
        </div>
      </form>
    </div>

  </div>
</template>
<style>
.verify {
  background: url('/images/verify.jpg');
}
</style>