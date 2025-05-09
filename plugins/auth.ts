// plugins/auth.ts
import { useAuthStore } from '~/stores/auth'
import { useToast } from 'primevue/usetoast'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Initialize auth state
  authStore.initialize()

  // Centralized toast notification functions
  const notifications = {
    // Show success notification
    showSuccess: (summary: string, message: string, duration = 3000) => {
      if (import.meta.client) {
        try {
          const toast = useToast()
          toast.add({
            severity: 'success',
            summary,
            detail: message,
            life: duration
          })
        } catch (error) {
          console.error('Failed to show toast notification:', error)
        }
      }
    },

    // Show error notification
    showError: (summary: string, message: string, duration = 3000) => {
      if (import.meta.client) {
        try {
          const toast = useToast()
          toast.add({
            severity: 'error',
            summary,
            detail: message,
            life: duration
          })
        } catch (error) {
          console.error('Failed to show toast notification:', error)
        }
      }
    },

    // Authentication specific notifications
    showAuthError: (message: string) => {
      notifications.showError('Authentication Error', message || 'Authentication error')
    },

    // Role specific notifications
    showRoleError: (message: string) => {
      notifications.showError('Access Denied', message || 'You do not have the required permissions')
    },

    // Session expiration notification
    showSessionExpired: () => {
      notifications.showError('Unauthorized', 'Your session has expired. Please login again.')
    },

    // Forbidden action notification
    showForbidden: () => {
      notifications.showError('Access Denied', 'You do not have permission to perform this action.')
    }
  }

  // Provide auth utility methods to the app
  return {
    provide: {
      auth: {
        // Authentication
        isAuthenticated: () => authStore.isAuthenticated,
        getUser: () => authStore.user,

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

        logout: async () => {
          return await authStore.logout()
        },

        // Notifications (centralized)
        notifications
      }
    }
  }
})