import { ref, computed } from 'vue'
import { useAppToast } from '~/utils/toastify'

// OAuth provider configurations with latest brand icons
export const oauthProviders = {
  google: {
    name: 'Google',
    icon: 'fab fa-google',
    color: '#4285f4', // Updated Google brand color
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600'
  },
  facebook: {
    name: 'Facebook',
    icon: 'fab fa-facebook',
    color: '#1877f2', // Updated Facebook brand color
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700'
  },
  apple: {
    name: 'Apple',
    icon: 'fab fa-apple',
    color: '#000000',
    bgColor: 'bg-gray-900',
    hoverColor: 'hover:bg-black'
  }
}

export function useOAuth() {
  const toast = useAppToast()
  const authApi = useAuthApi()

  const isLoading = ref(false)

  // Initiate OAuth login flow - handle errors when user clicks
  const loginWithProvider = async (provider: string) => {
    if (!Object.keys(oauthProviders).includes(provider)) {
      toast.error(`${oauthProviders[provider as keyof typeof oauthProviders]?.name || provider} authentication is not available`)
      return
    }

    try {
      isLoading.value = true

      // Get OAuth redirect URL from backend
      const response = await authApi.getOAuthRedirectUrl(provider)

      console.log('OAuth redirect response:', response) // Debug log

      if (response.status === 'success' && response.data?.redirect_url) {
        // Redirect to OAuth provider
        console.log('Redirecting to:', response.data.redirect_url) // Debug log
        window.location.href = response.data.redirect_url
      } else {
        console.error('OAuth redirect failed:', response) // Debug log
        toast.error(response?.message || `Failed to initiate ${provider} authentication`)
      }
    } catch (error) {
      console.error(`OAuth login failed for ${provider}:`, error)
      toast.error(`Failed to connect with ${oauthProviders[provider as keyof typeof oauthProviders]?.name || provider}`)
    } finally {
      isLoading.value = false
    }
  }

  // Handle OAuth callback (for SPA/mobile flows)
  const handleOAuthToken = async (provider: string, accessToken: string) => {
    try {
      isLoading.value = true

      const response = await authApi.authenticateWithOAuthToken(provider, accessToken)

      if (response.status === 'success') {
        const { user, is_new_user, oauth_provider } = response.data || {}

        // Handle successful authentication (no longer async)
        authApi.handleAuthSuccess(response)

        if (is_new_user) {
          toast.success(`Welcome! Your account has been created with ${oauth_provider}`)
        } else {
          toast.success(`Welcome back! Logged in with ${oauth_provider}`)
        }

        // Navigate to appropriate page
        const authApi = useAuthApi()
        await authApi.navigateToDashboard()

        return response
      } else {
        toast.error(response?.message || 'OAuth authentication failed')
      }
    } catch (error) {
      console.error(`OAuth token authentication failed for ${provider}:`, error)
      toast.error('Authentication failed. Please try again.')
    } finally {
      isLoading.value = false
    }
  }

  // Unlink OAuth provider
  const unlinkProvider = async () => {
    try {
      isLoading.value = true

      const response = await authApi.unlinkOAuthProvider()

      if (response.status === 'success') {
        toast.success('OAuth provider unlinked successfully')
        return response
      } else {
        toast.error(response?.message || 'Failed to unlink OAuth provider')
      }
    } catch (error) {
      console.error('Failed to unlink OAuth provider:', error)
      toast.error('Failed to unlink OAuth provider')
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    isLoading,

    // Provider configs
    oauthProviders,

    // Methods
    loginWithProvider,
    handleOAuthToken,
    unlinkProvider
  }
}
