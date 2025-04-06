import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  authStore.initialize()
  
  // Listen for unauthorized events from useCustomFetch
  if (import.meta.client) {
    window.addEventListener('auth:unauthorized', () => {
      authStore.setToken(null)
      authStore.setUser(null)

      toast.error('Unauthorized. Please login again', {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'colored'
      })
      navigateTo('/login')
    })
  }
  // onUnmounted(() => {
  //   authStore.cleanup()
  // })
})