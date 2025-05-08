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
  function initialize() {
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

      // Clear local state
      setToken(null)
      setUser(null)
      setVerified(false)
      setRoles([])

      // Set success status and message
      status.value = 'success'
      message.value = 'Successfully logged out'

      return {
        status: 'success',
        message: 'Successfully logged out'
      }
    } catch (error: any) {
      // Clear local state regardless of API result
      setToken(null)
      setUser(null)
      setVerified(false)
      setRoles([])

      status.value = 'success'
      message.value = 'Successfully logged out'

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

  async function verifyEmail(verificationCode: string) {
    isLoading.value = true
    message.value = null
    status.value = null

    try {
      // In a real implementation, you would call your API to verify the email
      // For now, we'll simulate a successful verification

      // Simulate API call
      // const response = await useCustomFetch<ApiResponse>('/api/user/verify-email', {
      //   method: 'POST',
      //   body: { code: verificationCode },
      //   requireAuth: true
      // })

      // For demo purposes, we'll just set the user as verified
      setVerified(true)

      status.value = 'success'
      message.value = 'Email verified successfully'

      return {
        status: 'success',
        message: 'Email verified successfully'
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
    clearMessages
  }
})