import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCustomFetch } from '~/composables/useCustomFetch'
import { useAuthApi } from '~/composables/useAuthApi'

// Types
export interface Role {
  id: number
  name: string
  slug: string
}

export interface User {
  id?: number | string
  email?: string
  name?: string
  username?: string
  email_verified_at?: string | null
}

interface ApiResponse {
  status: string
  message: string
  status_code?: number
  data?: {
    user?: User
    email_verification_required?: boolean
    verification_email_sent?: boolean
    email_verified?: boolean
    roles?: Role[]
  }
}

// Removed RolesApiResponse - API calls handled by pages/composables

// Simple response type for actions
export interface SimpleResponse {
  success: boolean
  message: string
  status: string
  [key: string]: any
}

// Helper functions
function log(message: string, ...args: any[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const roles = ref<Role[]>([])
  const isLoading = ref(false)
  const message = ref<string | null>(null)
  const status = ref<string | null>(null)
  const isVerified = ref(false)

  const error = ref<string | null>(null)
  const initialized = ref(false)
  const rolesLoaded = ref(false)

  // Remove auto-initialization to prevent premature session validation
  // Session validation will be handled by middleware when routes require authentication

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const needsVerification = computed(() => isAuthenticated.value && !isVerified.value)
  const hasRole = computed(() => (roleSlug: string) => roles.value.some(role => role.slug === roleSlug))
  const isSeller = computed(() => hasRole.value('seller'))
  // All users have customer role by default - sellers get it after completing onboarding
  const isCustomer = computed(() => isAuthenticated.value) // All authenticated users are customers by default

  // Session validation removed - auth state comes from login/signup responses
  // Middleware handles authentication checks when needed

  // Helper methods

  /**
   * Set loading state and clear messages
   */
  function startLoading(): void {
    isLoading.value = true;
    message.value = null;
    status.value = null;
    error.value = null;
  }

  // Basic state management
  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  function setVerified(verified: boolean) {
    isVerified.value = verified;
  }

  function setRoles(newRoles: Role[]) {
    roles.value = newRoles;
    rolesLoaded.value = true;
  }

  function clearRoles() {
    roles.value = [];
    rolesLoaded.value = false;
  }

  // Actions

  /**
   * Initialize the auth store - now simplified since auth state comes from login/signup
   */
  async function initialize() {
    // Fetch roles if authenticated and not already loaded
    if (isAuthenticated.value && !rolesLoaded.value) {
      const { fetchRoles } = useAuthApi();
      await fetchRoles();
    }
    initialized.value = true;
  }

  /**
   * Validate current session and restore auth state if user is authenticated
   */
  async function validateSession() {
    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET'
      });

      if (response.status === 'success' && response.data?.user) {
        // User is authenticated, restore auth state
        setUser(response.data.user);
        setVerified(!!response.data.user.email_verified_at);

        // Set roles if included in response
        if (response.data.roles) {
          setRoles(response.data.roles);
        } else {
          // If roles not included, fetch them separately to ensure they're available
          try {
            const rolesResponse = await useCustomFetch<ApiResponse>('/api/user/profile/roles', {
              method: 'GET'
            });

            if (rolesResponse.status === 'success' && rolesResponse.data?.roles) {
              setRoles(rolesResponse.data.roles);
            }
          } catch (rolesError) {
            // If roles fetch fails, continue without roles
            // This prevents session validation from failing due to roles endpoint issues
            console.warn('Failed to fetch roles during session validation:', rolesError);
          }
        }
      }
    } catch (error) {
      // Session is invalid or user is not authenticated
      // This is normal for unauthenticated users, so we don't show errors
      clearAuthData();
    }
  }

  // Removed fetchRoles - API calls should be handled by pages/composables

  // Removed login - API calls should be handled by pages

  // Removed signup - API calls should be handled by pages

  // Removed logout - API calls should be handled by pages

  /**
   * Clear all authentication data
   */
  function clearAuthData(): SimpleResponse {
    user.value = null;
    roles.value = [];
    isVerified.value = false;
    rolesLoaded.value = false;

    return {
      success: true,
      message: 'Authentication data cleared',
      status: 'success'
    };
  }

  /**
   * Debug helper to log the current auth state
   */
  function debugAuthState(): Record<string, any> {
    const state = {
      user: user.value,
      roles: roles.value,
      isAuthenticated: isAuthenticated.value,
      isVerified: isVerified.value,
      needsVerification: needsVerification.value,
      status: status.value,
      message: message.value
    };

    log('Auth Store State:', state);
    return state;
  }

  // Removed verifyEmail - this is now handled directly on pages as it's page-specific

  /**
   * Verify email with a token
   */
  async function verifyEmailWithToken(token?: string): Promise<SimpleResponse> {
    startLoading();

    // Return error if no token provided
    if (!token) {
      status.value = 'error';
      message.value = 'Verification token not found';
      isLoading.value = false;
      return {
        success: false,
        message: 'Verification token not found',
        status: 'error'
      };
    }

    try {
      // Call the API to verify the email with the token
      const response = await useCustomFetch<ApiResponse>('/api/verify-email/token', {
        method: 'POST',
        body: { token }
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Verify email with token API response:', response);
      }

      // Check for success
      const isSuccess = response.status === 'success' ||
        (response.data && response.data.email_verified === true);

      if (isSuccess) {
        setVerified(true);

        status.value = 'success';
        message.value = response.message || 'Email verified successfully';

        // Update user data if included in response
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          // Fetch profile if not included
          try {
            const profileResponse = await useCustomFetch<ApiResponse>('/api/user/profile', {
              method: 'GET'
            });

            if (profileResponse.status === 'success' && profileResponse.data?.user) {
              setUser(profileResponse.data.user);
            }
          } catch (profileError) {
            console.error('Failed to fetch profile after token verification', profileError);
          }
        }

        // Roles should be fetched by pages/composables after verification

        // Create response object
        const responseObj = {
          success: true,
          message: message.value,
          status: 'success',
          data: response.data
        };

        // Debug log the final response object
        if (process.env.NODE_ENV !== 'production') {
          console.log('Verify email with token response object being returned:', responseObj);
        }

        return responseObj;
      } else {
        status.value = 'error';
        message.value = response.message || 'Verification failed';

        return {
          success: false,
          message: message.value,
          status: 'error',
          data: response.data
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return {
        success: false,
        message: errorMessage,
        status: 'error'
      };
    } finally {
      isLoading.value = false;
    }
  }

  // Removed checkEmailVerificationStatus - this is now handled directly on pages as it's page-specific

  /**
   * Verify email with a direct link
   */
  async function verifyEmailWithDirectLink(token: string): Promise<SimpleResponse> {
    startLoading();

    try {
      // Verify email with direct link
      const response = await useCustomFetch<ApiResponse>(`/api/verify-email/${token}`, {
        method: 'GET'
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Verify email with direct link API response:', response);
      }

      // Check for success
      const isSuccess = response.status === 'success' ||
        (response.data && response.data.email_verified === true);

      if (isSuccess) {
        setVerified(true);
        status.value = 'success';
        message.value = response.message || 'Email verified successfully';

        // Update user data if included
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          // Fetch profile if not included
          try {
            const profileResponse = await useCustomFetch<ApiResponse>('/api/user/profile', {
              method: 'GET'
            });

            if (profileResponse.status === 'success' && profileResponse.data?.user) {
              setUser(profileResponse.data.user);
            }
          } catch (profileError) {
            console.error('Failed to fetch profile after direct link verification', profileError);
          }
        }

        // Roles should be fetched by pages/composables

        // Create response object
        const responseObj = {
          success: true,
          message: message.value,
          status: 'success',
          data: response.data
        };

        // Debug log the final response object
        if (process.env.NODE_ENV !== 'production') {
          console.log('Verify email with direct link response object being returned:', responseObj);
        }

        return responseObj;
      } else {
        status.value = 'error';
        message.value = response.message || 'Verification failed';

        return {
          success: false,
          message: message.value,
          status: 'error',
          data: response.data
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return {
        success: false,
        message: errorMessage,
        status: 'error'
      };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // Essential state for UI
    user,
    roles,
    isLoading,
    message,
    status,
    error,
    isVerified,

    // Essential getters for navigation and permissions
    isAuthenticated,
    needsVerification,
    hasRole,
    isSeller,
    isCustomer,

    // Core authentication actions (API calls removed - handled by pages)
    initialize,
    validateSession,

    // Email verification actions (token-based methods are reusable)
    verifyEmailWithToken,
    verifyEmailWithDirectLink,

    // Clear auth data
    clearAuthData,

    // Basic state setters (for composables)
    setUser,
    setVerified,

    setRoles,
    clearRoles,

    // Debugging (only in development)
    ...(process.env.NODE_ENV !== 'production' ? { debugAuthState } : {}),

    rolesLoaded
  }
})
