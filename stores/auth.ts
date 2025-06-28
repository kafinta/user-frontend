import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCustomFetch } from '~/composables/useCustomFetch'
import { useAuthApi } from '~/composables/useAuthApi'

// Types
export interface User {
  id?: number | string
  email?: string
  name?: string
  username?: string
  email_verified_at?: string | null
  roles?: string[] // Roles are now simple strings (slugs)
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
    roles?: string[] // Roles are now simple strings (slugs)
  }
}

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

// localStorage keys
const STORAGE_KEYS = {
  USER: 'kafinta_user',
  ROLES: 'kafinta_roles',
  VERIFIED: 'kafinta_verified',
  LAST_VALIDATION: 'kafinta_last_validation'
} as const;

// Helper functions for localStorage
function saveToStorage(key: string, data: any): void {
  if (import.meta.client) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save to localStorage (${key}):`, error);
    }
  }
}

function loadFromStorage<T>(key: string): T | null {
  if (import.meta.client) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to load from localStorage (${key}):`, error);
    }
  }
  return null;
}

function clearStorage(): void {
  if (import.meta.client) {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

// Session validation cache duration (5 minutes)
const SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const roles = ref<string[]>([]) // Roles are now simple strings (slugs)
  const isLoading = ref(false)
  const message = ref<string | null>(null)
  const status = ref<string | null>(null)
  const isVerified = ref(false)

  const error = ref<string | null>(null)
  const initialized = ref(false)
  const rolesLoaded = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const needsVerification = computed(() => isAuthenticated.value && !isVerified.value)
  const hasRole = computed(() => (roleSlug: string) => roles.value.includes(roleSlug))
  const isSeller = computed(() => hasRole.value('seller'))
  // All users have customer role by default - sellers get it after completing onboarding
  const isCustomer = computed(() => isAuthenticated.value) // All authenticated users are customers by default

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

  // Basic state management with localStorage persistence
  function setUser(newUser: User | null) {
    user.value = newUser;
    if (newUser) {
      saveToStorage(STORAGE_KEYS.USER, newUser);
    } else {
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  }

  function setVerified(verified: boolean) {
    isVerified.value = verified;
    saveToStorage(STORAGE_KEYS.VERIFIED, verified);
  }

  function setRoles(newRoles: string[]) {
    roles.value = newRoles;
    rolesLoaded.value = true;
    saveToStorage(STORAGE_KEYS.ROLES, newRoles);
  }

  function clearRoles() {
    roles.value = [];
    rolesLoaded.value = false;
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.ROLES);
    }
  }

  // Actions

  /**
   * Initialize the auth store - load from localStorage first, then validate session if needed
   */
  async function initialize() {
    if (initialized.value) return;

    // Load from localStorage first
    const storedUser = loadFromStorage<User>(STORAGE_KEYS.USER);
    const storedRoles = loadFromStorage<string[]>(STORAGE_KEYS.ROLES);
    const storedVerified = loadFromStorage<boolean>(STORAGE_KEYS.VERIFIED);

    if (storedUser) {
      setUser(storedUser);
      if (storedVerified !== null) {
        setVerified(storedVerified);
      }
    }

    if (storedRoles && storedRoles.length > 0) {
      setRoles(storedRoles);
    }

    // If we have user data from localStorage, validate the session to ensure it's still valid
    if (storedUser) {
      try {
        await validateSession();
      } catch (error) {
        // If session validation fails, clear the stored data
        log('Session validation failed, clearing stored data:', error);
        clearAuthData();
      }
    }

    initialized.value = true;
  }

  /**
   * Validate current session and restore auth state if user is authenticated
   * Now optimized with caching to reduce unnecessary API calls
   */
  async function validateSession() {
    // Check if we have a recent validation timestamp
    const lastValidation = loadFromStorage<number>(STORAGE_KEYS.LAST_VALIDATION);
    const now = Date.now();
    
    // If we validated recently (within cache duration), skip the API call
    if (lastValidation && (now - lastValidation) < SESSION_CACHE_DURATION) {
      log('Using cached session validation');
      return;
    }

    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET'
      });

      if (response.status === 'success' && response.data?.user) {
        // User is authenticated, restore auth state
        setUser(response.data.user);
        setVerified(!!response.data.user.email_verified_at);

        // Set roles if included in response (preferred approach)
        if (response.data.roles) {
          setRoles(response.data.roles);
        } else if (response.data.user.roles) {
          // If roles are nested in user object
          setRoles(response.data.user.roles);
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

        // Save validation timestamp
        saveToStorage(STORAGE_KEYS.LAST_VALIDATION, now);
      } else {
        // No valid session, clear stored data
        clearAuthData();
      }
    } catch (error) {
      // Session is invalid or user is not authenticated
      // This is normal for unauthenticated users, so we don't show errors
      clearAuthData();
    }
  }

  /**
   * Force validate session (bypass cache) - useful for critical operations
   */
  async function forceValidateSession() {
    // Clear the last validation timestamp to force a fresh API call
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEYS.LAST_VALIDATION);
    }
    return await validateSession();
  }

  /**
   * Clear all authentication data
   */
  function clearAuthData(): SimpleResponse {
    user.value = null;
    roles.value = [];
    isVerified.value = false;
    rolesLoaded.value = false;
    clearStorage();

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
    forceValidateSession,

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

    rolesLoaded,
    initialized
  }
})
