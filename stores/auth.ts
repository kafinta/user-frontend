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
  const loading = ref(false)
  const message = ref<string | null>(null)
  
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
        
        // Listen for auth events
        window.addEventListener('auth:token-updated', syncToken)
        window.addEventListener('auth:unauthorized', handleUnauthorized)
      } catch (error) {
        console.error('Failed to initialize auth from localStorage:', error)
      }
    }
  }
  
  function syncToken() {
    // Sync token from localStorage to store
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token')
      token.value = storedToken
      
      // If we have a token but no user, try to fetch user profile
      if (storedToken && !user.value) {
        // fetchUserProfile().catch(err => {
        //   console.error('Failed to fetch user profile:', err)
        // })
      }
    }
  }
  
  function handleUnauthorized() {
    // Handle unauthorized event
    setToken(null)
    setUser(null)
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
    loading.value = true
    
    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/login', {
        method: 'POST',
        body: credentials
      })
      
      // Handle user data
      if (response && response.data && response.data.account) {
        setUser(response.data.account)
      }
      
      return {
        success: true,
        message: response.message || 'Login successful',
        data: response.data
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      return {
        success: false,
        message: error.message || 'Login failed. Please try again.',
        error
      }
    } finally {
      loading.value = false
    }
  }
  
  async function signup(userData: { email: string, password: string, username: string }) {
    loading.value = true
    
    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/signup', {
        method: 'POST',
        body: userData
      })
      if (response && response.data && response.data.account) {
        setUser(response.data.account)
      }
      
      return {
        success: true,
        message: response.message || 'Account created successfully',
        data: response.data
      }
    } catch (error: any) {
      console.error('Signup failed:', error)
      return {
        success: false,
        message: error.message || 'Signup failed. Please try again.',
        error
      }
    } finally {
      loading.value = false
    }
  }
  
  async function logout() {  
    loading.value = true
    
    try {
      // Optional: API call to invalidate token on server
      await useCustomFetch('/api/user/logout', {
        method: 'POST',
        requireAuth: true
      }).catch((error) => {
        // Log but don't throw logout API call errors
        console.error('Logout API call failed:', error)
      })
      
      // Clear local state
      setToken(null)
      setUser(null)
      
      return {
        success: true,
        message: 'Successfully logged out'
      }
    } catch (error: any) {
      // Clear local state regardless of API result
      setToken(null)
      setUser(null)
      
      return {
        success: true, // Still consider logout successful even if API call fails
        message: 'Successfully logged out',
        error
      }
    } finally {
      loading.value = false
    }
  }
  
  function cleanup() {
    if (import.meta.client) {
      window.removeEventListener('auth:token-updated', syncToken)
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }
  
  return {
    // State
    token,
    user,
    loading,
    message,
    
    // Getters
    isAuthenticated,
    
    // Actions
    initialize,
    syncToken,
    handleUnauthorized,
    setToken,
    setUser,
    login,
    signup,
    logout,
    cleanup
  }
})