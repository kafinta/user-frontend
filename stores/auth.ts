// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCustomFetch } from '~/composables/useCustomFetch'

interface User {
  id?: number | string
  email?: string
  name?: string
  username?: string
  created_at?: string
  updated_at?: string
}

interface ApiResponse {
  status: string
  status_code: number
  message: string
  data?: {
    account?: User
    auth_token?: string
    token_type?: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const message = ref<string | null>(null)
  const status = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  
  // Actions
  function initialize() {
    // Run on app initialization
    if (import.meta.client) {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('auth_user')
        
        if (storedToken) {
          token.value = storedToken
        }
        
        if (userData) {
          user.value = JSON.parse(userData)
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
      
      if (response?.data?.account) {
        setUser(response.data.account)
      }
      
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
      
      if (response?.data?.account) {
        setUser(response.data.account)
      }
      
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
  
  return {
    // State
    token,
    user,
    isLoading,
    message,
    status,
    // Getters
    isAuthenticated,
    
    // Actions
    initialize,
    setToken,
    setUser,
    login,
    signup,
    logout,
    clearMessages
  }
})