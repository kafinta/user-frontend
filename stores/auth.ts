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
  status?: string
  status_code?: number
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
    // Skip full initialization on server
    if (import.meta.server) {
      return;
    }

    try {
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
      }

      // Always verify with the server
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET'
      }).catch(error => {
        // Clear auth data if we get a 401
        if (error.response?.status === 401 && user.value) {
          clearAuthData();
        }

        return { success: false, message: 'Failed to fetch profile' } as ApiResponse;
      });

      // Check if the response has a success status or contains a success message
      // Add more comprehensive checks for different response formats
      const isSuccess = response.success === true ||
                       (response.status === 'success') ||
                       (response.status_code === 200);

      // Check if we have user data in the response
      const userData = response.data?.user;

      if (isSuccess && userData) {
        // Update user data
        setUser(userData);
        setVerified(!!userData.email_verified_at);
        saveToStorage('user', userData);

        // Fetch roles
        await fetchRoles();
      } else if (isSuccess && !userData && user.value) {
        // Response was successful but didn't contain user data
        // If we already have a user in state, keep it
      } else if (!isSuccess) {
        // Clear auth data if we're not authenticated
        if (user.value) {
          clearAuthData();
        }
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
   * This method should not set any messages or status that would be displayed to the user
   */
  async function fetchRoles(): Promise<SimpleResponse> {
    if (!isAuthenticated.value) {
      return {
        success: false,
        message: 'User is not authenticated',
        status: 'error'
      };
    }

    // Try to load from storage first
    const storedRoles = loadFromStorage('roles');
    if (storedRoles) {
      setRoles(storedRoles);
      return {
        success: true,
        message: 'User roles loaded from cache',
        status: 'success',
        roles: storedRoles
      };
    }

    startLoading();

    try {
      const response = await useCustomFetch<RolesApiResponse>('/api/user/profile/roles', {
        method: 'GET'
      });

      // Don't update global status or message for role fetching
      // This prevents these values from being displayed to the user

      if (response?.data?.roles) {
        setRoles(response.data.roles);
        saveToStorage('roles', response.data.roles);
      }

      return {
        success: response.success,
        message: response.message || 'User roles retrieved',
        status: response.success ? 'success' : 'error',
        data: response.data
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user roles';
      // Don't update global error or status

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
   * Log in a user with email and password
   */
  async function login(credentials: { email: string, password: string, remember_me?: boolean }): Promise<{
    success: boolean,
    message: string,
    status: string,
    needsVerification?: boolean
  }> {
    startLoading();

    try {
      // Use useCustomFetch for consistent error handling
      const response = await useCustomFetch<ApiResponse>('/api/user/login', {
        method: 'POST',
        body: credentials
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Login API response:', response);
      }

      // Check for success in different ways
      if (response.success === true ||
          (response.message && (
            response.message.includes('success') ||
            response.message.includes('Success') ||
            response.message.includes('logged in')
          ))) {

        // Set status to success
        status.value = 'success';
        message.value = response.message || 'Login successful';

        // Handle user data if available
        if (response.data?.user) {
          setUser(response.data.user);
          setVerified(!!response.data.user.email_verified_at);
          saveToStorage('user', response.data.user);

          // Fetch user roles after successful login
          await fetchRoles();

          // Transfer guest cart to user cart after login (non-critical)
          useCustomFetch('/api/cart/transfer-after-login', { method: 'GET' })
            .catch(() => {}); // Ignore errors

          // Create response object with user data
          const responseObj = {
            success: true,
            message: message.value,
            status: 'success',
            needsVerification: !response.data.user.email_verified_at
          };

          // Debug log the final response object
          if (process.env.NODE_ENV !== 'production') {
            console.log('Login response object being returned:', responseObj);
          }

          return responseObj;
        } else {
          // If no user data but success message, try to fetch profile
          try {
            const profileResponse = await useCustomFetch<ApiResponse>('/api/user/profile', {
              method: 'GET'
            });

            if (profileResponse.success && profileResponse.data?.user) {
              setUser(profileResponse.data.user);
              setVerified(!!profileResponse.data.user.email_verified_at);
              saveToStorage('user', profileResponse.data.user);

              // Fetch roles
              await fetchRoles();

              // Create response object with user data from profile
              const responseObj = {
                success: true,
                message: message.value,
                status: 'success',
                needsVerification: !profileResponse.data.user.email_verified_at
              };

              // Debug log
              if (process.env.NODE_ENV !== 'production') {
                console.log('Login response object (from profile):', responseObj);
              }

              return responseObj;
            }
          } catch (profileError) {
            console.error('Failed to fetch profile after login:', profileError);
          }

          // If we still don't have user data, return success but indicate verification might be needed
          return {
            success: true,
            message: message.value,
            status: 'success',
            needsVerification: true // Assume verification might be needed
          };
        }
      } else {
        // Handle error case
        status.value = 'error';
        message.value = response.message || 'Login failed';

        return {
          success: false,
          message: message.value,
          status: 'error'
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
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
   * Sign up a new user
   */
  async function signup(userData: {
    email: string,
    password: string,
    username: string,
    phone_number?: string
  }): Promise<{
    success: boolean,
    message: string,
    status: string,
    emailVerificationRequired?: boolean,
    verificationEmailSent?: boolean
  }> {
    startLoading();

    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/signup', {
        method: 'POST',
        body: userData
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Signup API response:', response);
      }

      // Check if we have a successful response with a message but no user data
      // This handles the case where the backend returns success but with a different structure
      if (response.success === true || (response.message && response.message.includes('Successfully'))) {
        // Set the status to success
        status.value = 'success';
        message.value = response.message || 'Account created successfully';

        // Create a default user if not provided in the response
        const userInfo = response.data?.user || {
          email: userData.email,
          username: userData.username
        };

        // Update user data if available
        setUser(userInfo);
        saveToStorage('user', userInfo);

        // Check if email verification is required (default to true if not specified)
        const emailVerificationRequired = response.data?.email_verification_required === true || true;
        setVerified(!emailVerificationRequired);

        // Fetch roles if available - this won't change message.value anymore
        await fetchRoles();

        // Create the response object
        const responseObj = {
          success: true,
          message: message.value,
          status: 'success', // Explicitly set to 'success' instead of using status.value
          emailVerificationRequired: emailVerificationRequired,
          verificationEmailSent: response.data?.verification_email_sent === true || false
        };

        // Debug log the final response object
        if (process.env.NODE_ENV !== 'production') {
          console.log('Signup response object being returned:', responseObj);
        }

        return responseObj;
      } else {
        // Check if the message indicates success despite the response structure
        if (response.message && response.message.includes('Successfully')) {
          // Handle as success even if the response structure is unexpected
          status.value = 'success';
          message.value = response.message;

          // Create a default user
          const userInfo = {
            email: userData.email,
            username: userData.username
          };

          // Update user data
          setUser(userInfo);
          saveToStorage('user', userInfo);

          // Assume email verification is required
          const emailVerificationRequired = true;
          setVerified(!emailVerificationRequired);

          // Fetch roles if available - this won't change message.value anymore
          await fetchRoles();

          // Create the response object
          const responseObj = {
            success: true,
            message: message.value,
            status: 'success',
            emailVerificationRequired: emailVerificationRequired,
            verificationEmailSent: false
          };

          // Debug log
          if (process.env.NODE_ENV !== 'production') {
            console.log('Signup response object (from message check):', responseObj);
          }

          return responseObj;
        } else {
          // Handle as error
          status.value = 'error';
          message.value = response.message || 'Signup failed. Please try again.';

          return {
            success: false,
            message: message.value,
            status: 'error' // Explicitly set to 'error' instead of using status.value
          };
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      error.value = errorMessage;
      status.value = 'error';

      return {
        success: false,
        message: errorMessage,
        status: 'error' // Explicitly set to 'error' instead of using status.value
      };
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Log out the current user
   */
  async function logout(): Promise<SimpleResponse> {
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

      return {
        success: true,
        message: 'Successfully logged out',
        status: 'success'
      };
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

      return {
        success: true,
        message: 'Successfully logged out',
        status: 'success'
      };
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
  function clearAuthData(): SimpleResponse {
    user.value = null;
    roles.value = [];
    isVerified.value = false;

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
   * Verify email with a verification code
   */
  async function verifyEmail(verificationCode: string): Promise<{
    success: boolean,
    message: string,
    status: string
  }> {
    startLoading();

    try {
      // Call the API to verify the email with the code
      const response = await useCustomFetch<ApiResponse>('/api/verify-email/code', {
        method: 'POST',
        body: { code: verificationCode }
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Verify email API response:', response);
      }

      // Check for success in different ways
      const isSuccess = response.success === true ||
        (response.data && response.data.email_verified === true) ||
        (response.message && (
          response.message.includes('verified') ||
          response.message.includes('Verified') ||
          response.message.includes('success') ||
          response.message.includes('Success')
        ));

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

        // Fetch roles after verification - this won't change message.value anymore
        await fetchRoles();

        // Create response object
        const responseObj = {
          success: true,
          message: message.value,
          status: 'success'
        };

        // Debug log the final response object
        if (process.env.NODE_ENV !== 'production') {
          console.log('Verify email response object being returned:', responseObj);
        }

        return responseObj;
      } else {
        status.value = 'error';
        message.value = response.message || 'Verification failed';

        return {
          success: false,
          message: message.value,
          status: 'error'
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

      // Check for success in different ways
      const isSuccess = response.success === true ||
        (response.data && response.data.email_verified === true) ||
        (response.message && (
          response.message.includes('verified') ||
          response.message.includes('Verified') ||
          response.message.includes('success') ||
          response.message.includes('Success')
        ));

      if (isSuccess) {
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

        // Fetch roles after verification - this won't change message.value anymore
        await fetchRoles();

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
   * Request a new verification email
   */
  async function requestEmailVerification(): Promise<{
    success: boolean,
    message: string,
    status: string
  }> {
    startLoading();

    try {
      // Request a new verification code
      const response = await useCustomFetch<ApiResponse>('/api/user/resend-verification-email', {
        method: 'POST'
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Request verification email API response:', response);
      }

      // Check for success in different ways
      const isSuccess = response.success === true ||
        (response.message && (
          response.message.includes('sent') ||
          response.message.includes('Sent') ||
          response.message.includes('success') ||
          response.message.includes('Success')
        ));

      status.value = isSuccess ? 'success' : 'error';
      message.value = response.message || 'Verification email sent successfully';

      // Create response object with explicit boolean type for success
      const responseObj = {
        success: Boolean(isSuccess), // Convert to boolean to fix TypeScript error
        message: message.value,
        status: isSuccess ? 'success' : 'error'
      };

      // Debug log the final response object
      if (process.env.NODE_ENV !== 'production') {
        console.log('Request verification email response object being returned:', responseObj);
      }

      return responseObj;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification email';
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
   * Check the current email verification status
   */
  async function checkEmailVerificationStatus(): Promise<SimpleResponse> {
    startLoading();

    try {
      // Check email verification status
      const response = await useCustomFetch<ApiResponse>('/api/user/email-verification-status', {
        method: 'GET'
      });

      // Debug log to see the actual API response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Check email verification status API response:', response);
      }

      // Check for success in different ways
      const isSuccess = response.success === true ||
        (response.message && (
          response.message.includes('status') ||
          response.message.includes('Status') ||
          response.message.includes('retrieved') ||
          response.message.includes('Retrieved') ||
          response.message.includes('success') ||
          response.message.includes('Success')
        ));

      if (isSuccess) {
        status.value = 'success';
        message.value = response.message || 'Email verification status retrieved';

        // Update verification status
        const isEmailVerified = response.data?.email_verified === true;
        setVerified(isEmailVerified);

        // Create response object
        const responseObj = {
          success: true,
          message: message.value,
          status: 'success',
          data: response.data,
          isVerified: isEmailVerified
        };

        // Debug log the final response object
        if (process.env.NODE_ENV !== 'production') {
          console.log('Check email verification status response object being returned:', responseObj);
        }

        return responseObj;
      } else {
        status.value = 'error';
        message.value = response.message || 'Failed to retrieve verification status';

        return {
          success: false,
          message: message.value,
          status: 'error',
          data: response.data
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check verification status';
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

      // Check for success in different ways
      const isSuccess = response.success === true ||
        (response.data && response.data.email_verified === true) ||
        (response.message && (
          response.message.includes('verified') ||
          response.message.includes('Verified') ||
          response.message.includes('success') ||
          response.message.includes('Success')
        ));

      if (isSuccess) {
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

    // Core authentication actions
    initialize,
    login,
    signup,
    logout,
    fetchRoles,

    // Email verification actions
    verifyEmail,
    verifyEmailWithToken,
    verifyEmailWithDirectLink,
    requestEmailVerification,
    checkEmailVerificationStatus,

    // Clear messages
    clearMessages,
    clearAuthData,

    // Debugging (only in development)
    ...(process.env.NODE_ENV !== 'production' ? { debugAuthState } : {})
  }
})
