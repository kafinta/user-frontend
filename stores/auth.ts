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
  VERIFIED: 'kafinta_verified'
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
      return null;
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
   * Initialize the auth store - load from localStorage only
   */
  async function initialize() {
    if (initialized.value) return;

    try {
      // Always fetch the current user profile from the backend
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET',
        suppressAuthError: true // Prevent session expired toast/redirect on app launch
      });

      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
        setVerified(!!response.data.user.email_verified_at);
        if (response.data.roles) {
          setRoles(response.data.roles);
        } else if (response.data.user.roles) {
          setRoles(response.data.user.roles);
        }
        // Save to localStorage
        saveToStorage(STORAGE_KEYS.USER, response.data.user);
        saveToStorage(STORAGE_KEYS.ROLES, response.data.roles || response.data.user.roles || []);
        saveToStorage(STORAGE_KEYS.VERIFIED, !!response.data.user.email_verified_at);
      } else {
        // If not authenticated or no user, clear auth data
        clearAuthData();
      }
    } catch (error) {
      // On error (e.g., not authenticated), clear auth data
      clearAuthData();
    }

    initialized.value = true;
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
        }

        // Set roles if included in response
        if (response.data?.roles) {
          setRoles(response.data.roles);
        } else if (response.data?.user?.roles) {
          setRoles(response.data.user.roles);
        }

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
        }

        // Set roles if included in response
        if (response.data?.roles) {
          setRoles(response.data.roles);
        } else if (response.data?.user?.roles) {
          setRoles(response.data.user.roles);
        }

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

  /**
   * Validate the current session by fetching the user profile.
   * Updates the store and returns the user if authenticated, otherwise throws.
   */
  async function validateSession() {
    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET',
        suppressAuthError: true
      });
      if (response.status === 'success' && response.data?.user) {
        setUser(response.data.user);
        setVerified(!!response.data.user.email_verified_at);
        if (response.data.roles) {
          setRoles(response.data.roles);
        } else if (response.data.user.roles) {
          setRoles(response.data.user.roles);
        }
        return response.data.user;
      } else {
        clearAuthData();
        throw new Error('Not authenticated');
      }
    } catch (error) {
      clearAuthData();
      throw error;
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

    // Core authentication actions
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

    rolesLoaded,
    initialized
  }
})
