// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCustomFetch } from '~/composables/useCustomFetch'

interface Role {
  id: number
  name: string
  slug: string
}

interface User {
  id?: number | string
  email?: string
  name?: string
  username?: string
}

interface ApiResponse {
  status: string
  status_code: number
  message: string
  data?: {
    user?: User
    auth_token?: string
    token_type?: string
    roles?: Role[]
    verification_token?: string
    verified?: boolean
  }
}

interface RolesApiResponse {
  status: string
  status_code: number
  message: string
  data: {
    roles: Role[]
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const roles = ref<Role[]>([])
  const isLoading = ref(false)
  const message = ref<string | null>(null)
  const status = ref<string | null>(null)
  const isVerified = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const needsVerification = computed(() => isAuthenticated.value && !isVerified.value)
  const hasRole = computed(() => (roleSlug: string) => roles.value.some(role => role.slug === roleSlug))
  const isSeller = computed(() => hasRole.value('seller'))
  const isCustomer = computed(() => hasRole.value('customer'))

  // Actions
  async function initialize() {
    // Run on app initialization
    if (import.meta.client) {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('auth_user')
        const verificationStatus = localStorage.getItem('auth_verified')
        const storedRoles = localStorage.getItem('auth_roles')

        if (storedToken) {
          token.value = storedToken
        }

        if (userData) {
          user.value = JSON.parse(userData)
        }

        if (verificationStatus === 'true') {
          isVerified.value = true
        }

        if (storedRoles) {
          roles.value = JSON.parse(storedRoles)
        } else if (isAuthenticated.value) {
          // If authenticated but no roles stored, fetch them
          fetchRoles().catch(error => {
            console.error('Failed to fetch roles during initialization:', error)
          })
        }

        // If authenticated, check email verification status from the server
        if (isAuthenticated.value) {
          checkEmailVerificationStatus().catch(error => {
            console.error('Failed to check email verification status during initialization:', error)
          })
        }
      } catch (error) {
        console.error('Failed to initialize auth from localStorage:', error)
        message.value = 'Failed to initialize authentication'
        status.value = 'error'
      }
    }
  }

  function setToken(newToken: string | null) {
    token.value = newToken

    if (import.meta.client) {
      if (newToken) {
        localStorage.setItem('auth_token', newToken)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  function setUser(newUser: User | null) {
    user.value = newUser

    if (import.meta.client && newUser) {
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    } else if (import.meta.client) {
      localStorage.removeItem('auth_user')
    }
  }

  function setVerified(verified: boolean) {
    isVerified.value = verified

    if (import.meta.client) {
      if (verified) {
        localStorage.setItem('auth_verified', 'true')
      } else {
        localStorage.removeItem('auth_verified')
      }
    }
  }

  function setRoles(newRoles: Role[]) {
    roles.value = newRoles

    if (import.meta.client) {
      if (newRoles && newRoles.length > 0) {
        localStorage.setItem('auth_roles', JSON.stringify(newRoles))
      } else {
        localStorage.removeItem('auth_roles')
      }
    }
  }

  async function fetchRoles() {
    if (!isAuthenticated.value) {
      return {
        status: 'error',
        message: 'User is not authenticated'
      }
    }

    isLoading.value = true
    message.value = null
    status.value = null

    try {
      const response = await useCustomFetch<RolesApiResponse>('/api/user/profile/roles', {
        method: 'GET',
        requireAuth: true
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'User roles retrieved successfully'

      // Handle roles data
      if (response?.data?.roles) {
        setRoles(response.data.roles)
      }

      return {
        status: response.status,
        message: response.message || 'User roles retrieved successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Failed to fetch user roles:', error)
      status.value = 'error'
      message.value = error.message || 'Failed to fetch user roles. Please try again.'

      return {
        status: 'error',
        message: error.message || 'Failed to fetch user roles. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function login(credentials: { email: string, password: string }) {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/login', {
        method: 'POST',
        body: credentials
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Login successful'

      // Handle auth token and user data
      if (response?.data?.auth_token) {
        setToken(response.data.auth_token)
      }

      if (response?.data?.user) {
        setUser(response.data.user)
      }

      // Assume users who can login are already verified
      setVerified(true)

      // Fetch user roles after successful login
      await fetchRoles().catch(error => {
        console.error('Failed to fetch roles after login:', error)
      })

      return {
        status: response.status,
        message: response.message || 'Login successful',
        data: response.data
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      status.value = 'error'
      message.value = error.message || 'Login failed. Please try again.'

      return {
        message: error.message || 'Login failed. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function signup(userData: { email: string, password: string, username: string }) {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/signup', {
        method: 'POST',
        body: userData
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Account created successfully'

      // Handle auth token and user data
      if (response?.data?.auth_token) {
        setToken(response.data.auth_token)
      }

      if (response?.data?.user) {
        setUser(response.data.user)
      }

      // Store verification token if provided
      const verificationToken = response?.data?.verification_token
      if (verificationToken && import.meta.client) {
        localStorage.setItem('verification_token', verificationToken)
      }

      // Explicitly set verification status to false for new signups
      setVerified(false)

      return {
        status: response.status,
        message: response.message || 'Account created successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Signup failed:', error)
      status.value = 'error'
      message.value = error.message || 'Signup failed. Please try again.'

      return {
        message: error.message || 'Signup failed. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      // Optional: API call to invalidate token on server
      await useCustomFetch('/api/user/logout', {
        method: 'POST',
        requireAuth: true
      }).catch((error) => {
        console.error('Logout API call failed:', error)
      })

      // Clear all authentication data
      clearAuthData()

      // Set success status and message
      status.value = 'success'
      message.value = 'Successfully logged out'

      // Reload the page instead of redirecting to login
      if (import.meta.client) {
        window.location.reload()
      }

      return {
        status: 'success',
        message: 'Successfully logged out'
      }
    } catch (error: any) {
      // Clear all authentication data regardless of API result
      clearAuthData()

      status.value = 'success'
      message.value = 'Successfully logged out'

      // Reload the page instead of redirecting to login, even on error
      if (import.meta.client) {
        window.location.reload()
      }

      return {
        status: 'success',
        message: 'Successfully logged out',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  function clearMessages() {
    message.value = null
    status.value = null
  }

  function clearAuthData() {
    // Clear state
    token.value = null
    user.value = null
    roles.value = []
    isVerified.value = false

    // Clear localStorage if on client
    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_verified')
      localStorage.removeItem('auth_roles')
      localStorage.removeItem('verification_token')
    }

    return {
      status: 'success',
      message: 'Authentication data cleared'
    }
  }

  function debugAuthState() {
    console.log('Auth Store State:', {
      token: token.value ? 'Present (not shown for security)' : 'Not present',
      user: user.value,
      roles: roles.value,
      isAuthenticated: isAuthenticated.value,
      isVerified: isVerified.value,
      needsVerification: needsVerification.value,
      status: status.value,
      message: message.value
    })

    // Check localStorage if on client
    if (import.meta.client) {
      console.log('Auth localStorage:', {
        auth_token: localStorage.getItem('auth_token') ? 'Present (not shown for security)' : 'Not present',
        auth_user: localStorage.getItem('auth_user'),
        auth_verified: localStorage.getItem('auth_verified'),
        auth_roles: localStorage.getItem('auth_roles'),
        verification_token: localStorage.getItem('verification_token') ? 'Present (not shown for security)' : 'Not present'
      })
    }

    return {
      status: 'success',
      message: 'Auth state logged to console'
    }
  }

  async function verifyEmail(verificationCode: string) {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      // Call the API to verify the email with the code
      const response = await useCustomFetch<ApiResponse>('/api/verify-email/code', {
        method: 'POST',
        body: { code: verificationCode },
        requireAuth: true
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Email verified successfully'

      if (response.status === 'success') {
        setVerified(true)
      }

      return {
        status: response.status,
        message: response.message || 'Email verified successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Email verification failed:', error)
      status.value = 'error'
      message.value = error.message || 'Verification failed. Please try again.'

      return {
        status: 'error',
        message: error.message || 'Verification failed. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function verifyEmailWithToken(token?: string) {
    isLoading.value = true
    message.value = null
    status.value = null

    // If token is not provided, try to get it from localStorage
    let verificationToken = token
    if (!verificationToken && import.meta.client) {
      const storedToken = localStorage.getItem('verification_token')
      if (storedToken) {
        verificationToken = storedToken
      }
    }

    // If still no token, return error
    if (!verificationToken) {
      status.value = 'error'
      message.value = 'Verification token not found'
      isLoading.value = false
      return {
        status: 'error',
        message: 'Verification token not found'
      }
    }

    try {
      // Call the API to verify the email with the token
      const response = await useCustomFetch<ApiResponse>('/api/verify-email/token', {
        method: 'POST',
        body: { token: verificationToken },
        requireAuth: true
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Email verified successfully'

      if (response.status === 'success') {
        setVerified(true)
      }

      return {
        status: response.status,
        message: response.message || 'Email verified successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Email verification with token failed:', error)
      status.value = 'error'
      message.value = error.message || 'Verification failed. Please try again.'

      return {
        status: 'error',
        message: error.message || 'Verification failed. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function requestEmailVerification() {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      // Call the API to request a new verification code
      const response = await useCustomFetch<ApiResponse>('/api/user/resend-verification-email', {
        method: 'POST',
        requireAuth: true
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Verification code sent successfully'

      return {
        status: response.status,
        message: response.message || 'Verification code sent successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Failed to request email verification:', error)
      status.value = 'error'
      message.value = error.message || 'Failed to send verification code. Please try again.'

      return {
        status: 'error',
        message: error.message || 'Failed to send verification code. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function checkEmailVerificationStatus() {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      // Call the API to check email verification status
      const response = await useCustomFetch<ApiResponse>('/api/user/email-verification-status', {
        method: 'GET',
        requireAuth: true
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Email verification status retrieved'

      // Update verification status based on API response
      if (response.status === 'success' && response.data) {
        const isEmailVerified = response.data.verified === true
        setVerified(isEmailVerified)
      }

      return {
        status: response.status,
        message: response.message || 'Email verification status retrieved',
        data: response.data
      }
    } catch (error: any) {
      console.error('Failed to check email verification status:', error)
      status.value = 'error'
      message.value = error.message || 'Failed to check verification status. Please try again.'

      return {
        status: 'error',
        message: error.message || 'Failed to check verification status. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  async function verifyEmailWithDirectLink(token: string) {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      // Call the API to verify the email with the token via direct link
      const response = await useCustomFetch<ApiResponse>(`/api/verify-email/${token}`, {
        method: 'GET'
      })

      // Set status and message from response
      status.value = response.status
      message.value = response.message || 'Email verified successfully'

      if (response.status === 'success') {
        setVerified(true)

        // If the user wasn't authenticated before, but the verification includes auth data
        if (!isAuthenticated.value && response.data?.auth_token) {
          setToken(response.data.auth_token)
        }

        if (!user.value && response.data?.user) {
          setUser(response.data.user)
        }
      }

      return {
        status: response.status,
        message: response.message || 'Email verified successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Email verification with direct link failed:', error)
      status.value = 'error'
      message.value = error.message || 'Verification failed. Please try again.'

      return {
        status: 'error',
        message: error.message || 'Verification failed. Please try again.',
        error
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    token,
    user,
    roles,
    isLoading,
    message,
    status,
    isVerified,
    // Getters
    isAuthenticated,
    needsVerification,
    hasRole,
    isSeller,
    isCustomer,

    // Actions
    initialize,
    setToken,
    setUser,
    setVerified,
    setRoles,
    fetchRoles,
    login,
    signup,
    logout,
    verifyEmail,
    verifyEmailWithToken,
    verifyEmailWithDirectLink,
    requestEmailVerification,
    checkEmailVerificationStatus,
    clearMessages,
    clearAuthData,
    debugAuthState
  }
})