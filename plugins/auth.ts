// plugins/auth.ts
import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
          toast.error(message || 'Authentication error', {
            position: toast.POSITION.BOTTOM_RIGHT,
            theme: 'colored'
          })
        }
      }
    }
  }
})