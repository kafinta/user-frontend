import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCustomFetch } from '~/composables/useCustomFetch'

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
  success: boolean
  message: string
  data?: {
    user?: User
    email_verification_required?: boolean
    verification_email_sent?: boolean
    email_verified?: boolean
    roles?: Role[]
  }
}

interface RolesApiResponse {
  success: boolean
  message: string
  data: {
    roles: Role[]
  }
}

// Response type for actions
interface ActionResponse {
  status: string
  message: string
  data?: any
  error?: any
  [key: string]: any
}

// Helper functions
function log(message: string, ...args: any[]): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
}

function logError(message: string, error: any): void {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error);
  } else {
    console.error(message);
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

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const needsVerification = computed(() => isAuthenticated.value && !isVerified.value)
  const hasRole = computed(() => (roleSlug: string) => roles.value.some(role => role.slug === roleSlug))
  const isSeller = computed(() => hasRole.value('seller'))
  const isCustomer = computed(() => hasRole.value('customer'))

  // Storage helpers
  function saveToStorage(key: string, data: any) {
    if (!import.meta.client) return

    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error saving to localStorage', error)
    }
  }

  function loadFromStorage(key: string) {
    if (!import.meta.client) return null

    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Check if data is less than 1 hour old for auth data
        const isRecent = (Date.now() - parsed.timestamp) < (1 * 60 * 60 * 1000)
        return isRecent ? parsed.data : null
      }
      return null
    } catch (error) {
      console.error('Error loading from localStorage', error)
      return null
    }
  }

  // Helper methods
  /**
   * Standard response formatter for actions
   */
  const formatResponse = (
    success: boolean,
    responseMessage: string,
    responseData?: any,
    error?: any,
    additionalProps?: Record<string, any>
  ): ActionResponse => {
    return {
      status: success ? 'success' : 'error',
      message: responseMessage,
      ...(responseData ? { data: responseData } : {}),
      ...(error ? { error } : {}),
      ...(additionalProps || {})
    };
  };

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
  }

  // Actions

  /**
   * Initialize the auth store by checking if the user is authenticated
   */
  async function initialize() {
    if (!import.meta.client) return;

    try {
      log('Initializing auth store');
      startLoading();

      // Try to load user from storage first
      const storedUser = loadFromStorage('user');
      const storedRoles = loadFromStorage('roles');

      if (storedUser) {
        setUser(storedUser);
        setVerified(!!storedUser.email_verified_at);

        if (storedRoles) {
          setRoles(storedRoles);
        }

        log('Loaded user from storage');
      }

      // Always verify with the server
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET'
      }).catch(error => {
        log('Profile fetch failed during initialization:', error);

        // Clear auth data if we get a 401
        if (error.response?.status === 401 && user.value) {
          clearAuthData();
        }

        return { success: false, message: 'Failed to fetch profile' } as ApiResponse;
      });

      if (response.success && response.data?.user) {
        // Update user data
        setUser(response.data.user);
        setVerified(!!response.data.user.email_verified_at);
        saveToStorage('user', response.data.user);

        log(`User authenticated: ${response.data.user.username}`);

        // Fetch roles
        await fetchRoles();
      } else {
        // Clear auth data if we're not authenticated
        if (user.value) {
          clearAuthData();
        }
        log('User not authenticated');
      }
    } catch (err) {
      logError('Failed to initialize auth:', err);
      error.value = err instanceof Error ? err.message : 'Failed to initialize authentication';
      status.value = 'error';
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Fetch user roles from the API
   */
  async function fetchRoles(): Promise<ActionResponse> {
    if (!isAuthenticated.value) {
      return formatResponse(false, 'User is not authenticated');
    }

    // Try to load from storage first
    const storedRoles = loadFromStorage('roles');
    if (storedRoles) {
      setRoles(storedRoles);
      return formatResponse(true, 'User roles loaded from cache', { roles: storedRoles });
    }

    startLoading();

    try {
      const response = await useCustomFetch<RolesApiResponse>('/api/user/profile/roles', {
        method: 'GET'
      });

      status.value = response.success ? 'success' : 'error';
      message.value = response.message || 'User roles retrieved successfully';

      if (response?.data?.roles) {
        setRoles(response.data.roles);
        saveToStorage('roles', response.data.roles);
      }

      return formatResponse(
        response.success,
        message.value || 'User roles retrieved',
        response.data
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user roles';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Log in a user with email and password
   */
  async function login(credentials: { email: string, password: string, remember_me?: boolean }): Promise<ActionResponse> {
    startLoading();

    try {
      log(`Attempting login for: ${credentials.email}`);

      // Force a CSRF token refresh before login
      if (import.meta.client) {
        try {
          await $fetch('/sanctum/csrf-cookie', {
            credentials: 'include',
            method: 'GET',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
            }
          });
        } catch (csrfError) {
          // Continue with login attempt even if CSRF refresh fails
          console.error('CSRF refresh failed, continuing with login attempt', csrfError);
        }
      }

      // Use useCustomFetch for consistent error handling
      const response = await useCustomFetch<ApiResponse>('/api/user/login', {
        method: 'POST',
        body: credentials
      });

      if (response.success && response.data?.user) {
        // Update user data
        setUser(response.data.user);
        setVerified(!!response.data.user.email_verified_at);
        saveToStorage('user', response.data.user);

        status.value = 'success';
        message.value = response.message || 'Login successful';

        // Fetch user roles after successful login
        await fetchRoles();

        // Transfer guest cart to user cart after login
        try {
          await useCustomFetch('/api/cart/transfer-after-login', {
            method: 'GET'
          });
        } catch (cartError) {
          // Non-critical error, just log it
          console.error('Failed to transfer guest cart', cartError);
        }

        return formatResponse(
          true,
          message.value,
          response.data,
          undefined,
          {
            needsVerification: !response.data.user.email_verified_at
          }
        );
      } else {
        status.value = 'error';
        message.value = response.message || 'Login failed';

        return formatResponse(
          false,
          message.value,
          response.data
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Sign up a new user
   */
  async function signup(userData: {
    email: string,
    password: string,
    username: string,
    phone_number?: string
  }): Promise<ActionResponse> {
    startLoading();

    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/signup', {
        method: 'POST',
        body: userData
      });

      if (response.success && response.data?.user) {
        status.value = 'success';
        message.value = response.message || 'Account created successfully';

        // Update user data
        setUser(response.data.user);
        saveToStorage('user', response.data.user);

        // Check if email verification is required
        const emailVerificationRequired = response.data.email_verification_required === true;
        setVerified(!emailVerificationRequired);

        // Fetch roles if available
        await fetchRoles();

        return formatResponse(
          true,
          message.value,
          response.data,
          undefined,
          {
            emailVerificationRequired: emailVerificationRequired,
            verificationEmailSent: response.data.verification_email_sent === true
          }
        );
      } else {
        status.value = 'error';
        message.value = response.message || 'Signup failed. Please try again.';

        return formatResponse(
          false,
          message.value,
          response.data
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Log out the current user
   */
  async function logout(): Promise<ActionResponse> {
    startLoading();

    try {
      // Call the logout API endpoint
      await useCustomFetch('/api/logout', {
        method: 'POST'
      }).catch((error) => {
        console.error('Logout API call failed, continuing with local logout', error);
      });

      // Clear all authentication data
      clearAuthData();

      // Clear storage
      if (import.meta.client) {
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('roles');
        } catch (e) {
          console.error('Failed to clear localStorage', e);
        }
      }

      status.value = 'success';
      message.value = 'Successfully logged out';

      // Reload the page to reset all app state
      if (import.meta.client) {
        window.location.reload();
      }

      return formatResponse(
        true,
        'Successfully logged out'
      );
    } catch (err) {
      // Clear auth data regardless of API result
      clearAuthData();

      // Clear storage
      if (import.meta.client) {
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('roles');
        } catch (e) {
          console.error('Failed to clear localStorage', e);
        }
      }

      status.value = 'success';
      message.value = 'Successfully logged out';

      // Reload page even on error
      if (import.meta.client) {
        window.location.reload();
      }

      return formatResponse(
        true,
        'Successfully logged out'
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Clear message and status
   */
  function clearMessages() {
    message.value = null;
    status.value = null;
  }

  /**
   * Clear all authentication data
   */
  function clearAuthData(): ActionResponse {
    user.value = null;
    roles.value = [];
    isVerified.value = false;

    return formatResponse(
      true,
      'Authentication data cleared'
    );
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
   * Verify email with a verification code
   */
  async function verifyEmail(verificationCode: string): Promise<ActionResponse> {
    startLoading();

    try {
      // Call the API to verify the email with the code
      const response = await useCustomFetch<ApiResponse>('/api/verify-email/code', {
        method: 'POST',
        body: { code: verificationCode }
      });

      const isSuccess = response.success === true ||
                       (response.data && response.data.email_verified === true);

      if (isSuccess) {
        setVerified(true);
        status.value = 'success';
        message.value = response.message || 'Email verified successfully';

        // Update user data if present in response
        if (response.data?.user) {
          setUser(response.data.user);
          saveToStorage('user', response.data.user);
        } else {
          // Fetch user profile if not included in the verification response
          try {
            const profileResponse = await useCustomFetch<ApiResponse>('/api/user/profile', {
              method: 'GET'
            });

            if (profileResponse.success && profileResponse.data?.user) {
              setUser(profileResponse.data.user);
              saveToStorage('user', profileResponse.data.user);
            }
          } catch (profileError) {
            console.error('Failed to fetch profile after verification', profileError);
          }
        }

        // Fetch roles after verification
        await fetchRoles();

        return formatResponse(
          true,
          message.value,
          response.data,
          undefined,
          { success: true }
        );
      } else {
        status.value = 'error';
        message.value = response.message || 'Verification failed';

        return formatResponse(
          false,
          message.value,
          response.data,
          undefined,
          { success: false }
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Verify email with a token
   */
  async function verifyEmailWithToken(token?: string): Promise<ActionResponse> {
    startLoading();

    // Return error if no token provided
    if (!token) {
      status.value = 'error';
      message.value = 'Verification token not found';
      isLoading.value = false;
      return formatResponse(
        false,
        'Verification token not found'
      );
    }

    try {
      // Call the API to verify the email with the token
      const response = await useCustomFetch<ApiResponse>('/api/verify-email/token', {
        method: 'POST',
        body: { token }
      });

      if (response.success) {
        setVerified(true);
        status.value = 'success';
        message.value = response.message || 'Email verified successfully';

        // Update user data if included in response
        if (response.data?.user) {
          setUser(response.data.user);
          saveToStorage('user', response.data.user);
        } else {
          // Fetch profile if not included
          try {
            const profileResponse = await useCustomFetch<ApiResponse>('/api/user/profile', {
              method: 'GET'
            });

            if (profileResponse.success && profileResponse.data?.user) {
              setUser(profileResponse.data.user);
              saveToStorage('user', profileResponse.data.user);
            }
          } catch (profileError) {
            console.error('Failed to fetch profile after token verification', profileError);
          }
        }

        // Fetch roles after verification
        await fetchRoles();

        return formatResponse(
          true,
          message.value,
          response.data,
          undefined,
          { success: true }
        );
      } else {
        status.value = 'error';
        message.value = response.message || 'Verification failed';

        return formatResponse(
          false,
          message.value,
          response.data,
          undefined,
          { success: false }
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Request a new verification email
   */
  async function requestEmailVerification(): Promise<ActionResponse> {
    startLoading();

    try {
      // Request a new verification code
      const response = await useCustomFetch<ApiResponse>('/api/user/resend-verification-email', {
        method: 'POST'
      });

      status.value = response.success ? 'success' : 'error';
      message.value = response.message || 'Verification email sent successfully';

      return formatResponse(
        response.success,
        message.value,
        response.data
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Check the current email verification status
   */
  async function checkEmailVerificationStatus(): Promise<ActionResponse> {
    startLoading();

    try {
      // Check email verification status
      const response = await useCustomFetch<ApiResponse>('/api/user/email-verification-status', {
        method: 'GET'
      });

      if (response.success) {
        status.value = 'success';
        message.value = response.message || 'Email verification status retrieved';

        // Update verification status
        if (response.data) {
          setVerified(response.data.email_verified === true);
        }

        return formatResponse(
          true,
          message.value,
          response.data,
          undefined,
          { isVerified: response.data?.email_verified === true }
        );
      } else {
        status.value = 'error';
        message.value = response.message || 'Failed to retrieve verification status';

        return formatResponse(
          false,
          message.value,
          response.data
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check verification status';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Verify email with a direct link
   */
  async function verifyEmailWithDirectLink(token: string): Promise<ActionResponse> {
    startLoading();

    try {
      // Verify email with direct link
      const response = await useCustomFetch<ApiResponse>(`/api/verify-email/${token}`, {
        method: 'GET'
      });

      if (response.success) {
        setVerified(true);
        status.value = 'success';
        message.value = response.message || 'Email verified successfully';

        // Update user data if included
        if (response.data?.user) {
          setUser(response.data.user);
          saveToStorage('user', response.data.user);
        } else {
          // Fetch profile if not included
          try {
            const profileResponse = await useCustomFetch<ApiResponse>('/api/user/profile', {
              method: 'GET'
            });

            if (profileResponse.success && profileResponse.data?.user) {
              setUser(profileResponse.data.user);
              saveToStorage('user', profileResponse.data.user);
            }
          } catch (profileError) {
            console.error('Failed to fetch profile after direct link verification', profileError);
          }
        }

        // Fetch roles
        await fetchRoles();

        return formatResponse(
          true,
          message.value,
          response.data,
          undefined,
          { success: true }
        );
      } else {
        status.value = 'error';
        message.value = response.message || 'Verification failed';

        return formatResponse(
          false,
          message.value,
          response.data,
          undefined,
          { success: false }
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return formatResponse(
        false,
        errorMessage,
        undefined,
        err
      );
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    user,
    roles,
    isLoading,
    message,
    status,
    isVerified,
    error,

    // Getters
    isAuthenticated,
    needsVerification,
    hasRole,
    isSeller,
    isCustomer,

    // Storage helpers
    saveToStorage,
    loadFromStorage,

    // Authentication actions
    initialize,
    login,
    signup,
    logout,

    // Email verification actions
    verifyEmail,
    verifyEmailWithToken,
    verifyEmailWithDirectLink,
    requestEmailVerification,
    checkEmailVerificationStatus,

    // Role management
    fetchRoles,

    // State management
    setUser,
    setVerified,
    setRoles,
    clearMessages,
    clearAuthData,

    // Debugging
    debugAuthState
  }
})
