import { defineNuxtPlugin } from '#app'
import Vue3Toastify, { toast, type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  // Configure Vue3Toastify with default options
  const options: ToastContainerOptions = {
    autoClose: 3000,
    position: toast.POSITION.TOP_RIGHT,
    theme: 'light',
    clearOnUrlChange: false,
    transition: toast.TRANSITIONS.BOUNCE,
    hideProgressBar: false,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    closeOnClick: true,
    newestOnTop: true
  }

  nuxtApp.vueApp.use(Vue3Toastify, options)

  // Log plugin initialization for debugging
  console.log('Vue3Toastify plugin initialized')
})
