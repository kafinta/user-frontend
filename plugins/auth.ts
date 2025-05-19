// plugins/auth.ts
import { useAuthStore } from '~/stores/auth'
import { useAppToast } from '~/utils/toastify'

export default defineNuxtPlugin((_nuxtApp) => {
  const authStore = useAuthStore()

  // Initialize auth state
  authStore.initialize()

  // Log plugin initialization for debugging
  console.log('Auth plugin initialized')

  // Centralized toast notification functions using our standardized utility
  const notifications = {
    // Show success notification
    showSuccess: (summary: string, message: string, duration = 3000) => {
      if (import.meta.client) {
        try {
          const appToast = useAppToast();
          appToast.success(summary, message, duration);
          console.log('Success toast notification shown:', summary, message);
        } catch (error) {
          console.error('Failed to show success toast notification:', error);
        }
      }
    },

    // Show error notification
    showError: (summary: string, message: string, duration = 3000) => {
      if (import.meta.client) {
        try {
          const appToast = useAppToast();
          appToast.error(summary, message, duration);
          console.log('Error toast notification shown:', summary, message);
        } catch (error) {
          console.error('Failed to show error toast notification:', error);
        }
      }
    },

    // Authentication specific notifications
    showAuthError: (message: string) => {
      if (import.meta.client) {
        try {
          const appToast = useAppToast();
          appToast.authError(message || 'Authentication error');
          console.log('Auth error notification triggered:', message);
        } catch (error) {
          console.error('Failed to show auth error notification:', error);
        }
      }
    },

    // Role specific notifications
    showRoleError: (message: string) => {
      if (import.meta.client) {
        try {
          console.log('Auth plugin: Attempting to show role error notification');
          const appToast = useAppToast();

          if (!appToast) {
            console.error('Auth plugin: appToast is not available');
            return;
          }

          // Use setTimeout to ensure the toast is shown after component mounting
          setTimeout(() => {
            appToast.accessDenied(message || 'You do not have the required permissions');
            console.log('Auth plugin: Role error notification triggered:', message);
          }, 100);
        } catch (error) {
          console.error('Auth plugin: Failed to show role error notification:', error);
        }
      } else {
        console.log('Auth plugin: Not showing role error notification on server side');
      }
    },

    // Session expiration notification
    showSessionExpired: () => {
      if (import.meta.client) {
        try {
          const appToast = useAppToast();
          appToast.sessionExpired();
          console.log('Session expired notification triggered');
        } catch (error) {
          console.error('Failed to show session expired notification:', error);
        }
      }
    },

    // Forbidden action notification
    showForbidden: () => {
      if (import.meta.client) {
        try {
          const appToast = useAppToast();
          appToast.error('Access Denied', 'You do not have permission to perform this action.');
          console.log('Forbidden action notification triggered');
        } catch (error) {
          console.error('Failed to show forbidden action notification:', error);
        }
      }
    }
  }

  // Auth error handling functions
  const authErrorHandlers = {
    /**
     * Handle unauthorized (401) responses
     * @param skipRedirect Whether to skip the redirect to login page
     * @returns Object with status and message
     */
    handleUnauthorized: (skipRedirect = false) => {
      if (import.meta.client) {
        const route = useRoute()
        const currentPath = route.fullPath

        // Don't redirect or show notifications if we're on auth pages
        const isAuthPage = currentPath.includes('/auth/login') ||
                          currentPath.includes('/auth/signup') ||
                          currentPath.includes('/auth/verify')

        if (!isAuthPage) {
          // Show session expired notification
          notifications.showSessionExpired()

          // Only redirect if not on an auth page and redirect is not skipped
          if (!skipRedirect) {
            navigateTo({
              path: '/auth/login',
              query: { redirect: currentPath }
            })
          }
        }
      }

      return {
        status: 'error',
        message: 'Unauthorized. Please log in again.'
      }
    },

    /**
     * Handle forbidden (403) responses
     * @returns Object with status and message
     */
    handleForbidden: () => {
      if (import.meta.client) {
        notifications.showForbidden()
      }

      return {
        status: 'error',
        message: 'Forbidden. You do not have permission to access this resource.'
      }
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
        notifications,

        // Auth error handlers
        handleUnauthorized: authErrorHandlers.handleUnauthorized,
        handleForbidden: authErrorHandlers.handleForbidden
      }
    }
  }
})