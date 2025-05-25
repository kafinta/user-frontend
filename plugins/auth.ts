// plugins/auth.ts
import { useAuthStore } from '~/stores/auth'
import { useAppToast } from '~/utils/toastify'

export default defineNuxtPlugin((_nuxtApp) => {
  const authStore = useAuthStore()

  // Initialize auth state
  authStore.initialize()

  // Use the toast utility directly instead of duplicating functionality
  const toast = useAppToast()

  // Auth error handling functions
  const authErrorHandlers = {
    /**
     * Handle unauthorized (401) responses
     */
    handleUnauthorized: (skipRedirect = false) => {
      if (!import.meta.client) {
        return { status: 'error', message: 'Unauthorized' }
      }

      const route = useRoute()
      const currentPath = route.fullPath

      // Don't redirect or show notifications if we're on auth pages
      const isAuthPage = currentPath.includes('/auth/login') ||
                        currentPath.includes('/auth/signup') ||
                        currentPath.includes('/auth/verify')

      if (!isAuthPage) {
        // Show session expired notification
        toast.sessionExpired()

        // Only redirect if not on an auth page and redirect is not skipped
        if (!skipRedirect) {
          navigateTo({
            path: '/auth/login',
            query: { redirect: currentPath }
          })
        }
      }

      return {
        status: 'error',
        message: 'Unauthorized. Please log in again.'
      }
    },

    /**
     * Handle forbidden (403) responses
     */
    handleForbidden: () => {
      if (import.meta.client) {
        toast.accessDenied('You do not have permission to access this resource')
      }

      return {
        status: 'error',
        message: 'Forbidden. You do not have permission to access this resource.'
      }
    }
  }

  // Navigation helpers - simplified role-based routing
  const navigation = {
    /**
     * Navigate to the appropriate dashboard based on user roles
     */
    toDashboard: () => {
      // If not authenticated or no username, go to home page
      if (!authStore.isAuthenticated || !authStore.user?.username) {
        return navigateTo('/')
      }

      // Get the username
      const username = authStore.user.username

      // Route based on role
      if (authStore.isSeller) {
        return navigateTo(`/${username}/selling/dashboard`)
      } else if (authStore.isCustomer) {
        return navigateTo(`/${username}/buying/dashboard`)
      }

      // Default fallback
      return navigateTo('/')
    }
  }

  // Provide auth utility methods to the app
  return {
    provide: {
      auth: {
        // Authentication
        isAuthenticated: () => authStore.isAuthenticated,
        getUser: () => authStore.user,
        isVerified: () => authStore.isVerified,
        needsVerification: () => authStore.needsVerification,

        // Roles
        getRoles: () => authStore.roles,
        hasRole: (roleSlug: string) => authStore.hasRole(roleSlug),
        isSeller: () => authStore.isSeller,
        isCustomer: () => authStore.isCustomer,

        // Actions
        fetchRoles: async () => {
          if (authStore.isAuthenticated && authStore.roles.length === 0) {
            return await authStore.fetchRoles()
          }
          return { status: 'success', message: 'Roles already loaded' }
        },

        login: async (credentials: { email: string, password: string, remember_me?: boolean }) => {
          return await authStore.login(credentials)
        },

        logout: async () => {
          return await authStore.logout()
        },

        // Toast notifications
        toast,

        // Error handlers
        handleUnauthorized: authErrorHandlers.handleUnauthorized,
        handleForbidden: authErrorHandlers.handleForbidden,

        // Navigation
        navigation
      }
    }
  }
})