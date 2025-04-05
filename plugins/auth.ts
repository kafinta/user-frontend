import { useAuthStore } from '~/stores/auth'
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth from localStorage
  authStore.initialize()
  
  // Listen for unauthorized events from useCustomFetch
  if (import.meta.client) {
    window.addEventListener('auth:unauthorized', () => {
      authStore.setToken(null)
      authStore.setUser(null)
      // Optionally redirect to login page
      navigateTo('/login')
    })
  }
})