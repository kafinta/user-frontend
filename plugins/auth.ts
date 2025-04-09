// plugins/auth.ts
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'primevue/usetoast'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth state
  authStore.initialize()
  
  // Provide auth utility methods to the app
  return {
    provide: {
      auth: {
        isAuthenticated: () => authStore.isAuthenticated,
        getUser: () => authStore.user,
        showAuthError: (message: string) => {
          const toast = useToast()
          toast.add({
            severity: 'error',
            summary: 'Authentication Error',
            detail: message || 'Authentication error',
            life: 3000
          })
        }
      }
    }
  }
})