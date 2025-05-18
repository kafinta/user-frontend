/**
 * Composable for handling authentication-related events and notifications
 * This separates auth handling from the fetch composable
 */

import { useAuthStore } from '~/stores/auth'

export function useAuthHandlers() {
  const authStore = useAuthStore()
  const route = useRoute()
  const router = useRouter()

  /**
   * Handle unauthorized (401) responses
   * @param skipRedirect Whether to skip the redirect to login page
   * @returns Object with status and message
   */
  function handleUnauthorized(skipRedirect = false) {
    if (import.meta.client) {
      const currentPath = route.fullPath

      // Don't redirect or show notifications if we're on auth pages
      const isAuthPage = currentPath.includes('/auth/login') ||
                        currentPath.includes('/auth/signup') ||
                        currentPath.includes('/auth/verify')

      if (!isAuthPage) {
        // Use the centralized notification system from the auth plugin
        try {
          const { $auth } = useNuxtApp()
          $auth.notifications.showSessionExpired()
        } catch (error) {
          console.error('Failed to show notification:', error)
        }

        // Only redirect if not on an auth page and redirect is not skipped
        if (!skipRedirect) {
          router.push({
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
  }

  /**
   * Handle forbidden (403) responses
   * @returns Object with status and message
   */
  function handleForbidden() {
    if (import.meta.client) {
      try {
        const { $auth } = useNuxtApp()
        $auth.notifications.showForbidden()
      } catch (error) {
        console.error('Failed to show notification:', error)
      }
    }

    return {
      status: 'error',
      message: 'Forbidden. You do not have permission to access this resource.'
    }
  }

  /**
   * Check if the current response indicates an authentication error
   * @param response The response object
   * @param skipRedirect Whether to skip the redirect to login page
   * @returns True if the error was handled, false otherwise
   */
  function checkAuthError(response: any, skipRedirect = false): boolean {
    if (!response) return false

    // Check for HTTP status codes
    if (response.status === 401) {
      handleUnauthorized(skipRedirect)
      return true
    } else if (response.status === 403) {
      handleForbidden()
      return true
    }

    // Check for API-specific error indicators
    if (response.data && typeof response.data === 'object') {
      if (response.data.message && typeof response.data.message === 'string') {
        const message = response.data.message.toLowerCase()
        if (message.includes('unauthenticated') || message.includes('not logged in')) {
          handleUnauthorized(skipRedirect)
          return true
        } else if (message.includes('forbidden') || message.includes('unauthorized')) {
          handleForbidden()
          return true
        }
      }
    }

    return false
  }

  return {
    handleUnauthorized,
    handleForbidden,
    checkAuthError
  }
}
