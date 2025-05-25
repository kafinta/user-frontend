<template>
  <div class="flex justify-center items-center h-screen">
    <div class="w-full max-w-md mx-auto rounded-xl p-8 border-accent-200 border text-center space-y-6">
      <NavigationLogo class="w-48 mx-auto" />

      <!-- Loading State -->
      <div v-if="isProcessing" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <UiTypographyH3 class="text-secondary">Processing authentication...</UiTypographyH3>
        <UiTypographyP class="text-sm text-gray-500">
          Please wait while we complete your {{ providerName }} login
        </UiTypographyP>
      </div>

      <!-- Success State -->
      <div v-else-if="authStatus === 'success'" class="space-y-4">
        <div class="text-green-500 text-5xl">✓</div>
        <UiTypographyH3 class="text-secondary">Authentication Successful!</UiTypographyH3>
        <UiTypographyP class="text-sm text-gray-500">
          {{ isNewUser ? 'Welcome! Your account has been created.' : 'Welcome back!' }}
        </UiTypographyP>
        <UiTypographyP class="text-xs text-gray-400">
          Redirecting to dashboard...
        </UiTypographyP>
      </div>

      <!-- Error State -->
      <div v-else-if="authStatus === 'error'" class="space-y-4">
        <div class="text-red-500 text-5xl">✗</div>
        <UiTypographyH3 class="text-secondary">Authentication Failed</UiTypographyH3>
        <UiTypographyP class="text-sm text-red-600">
          {{ errorMessage }}
        </UiTypographyP>
        <div class="space-y-2">
          <FormButton @click="retryAuth" class="w-full">
            Try Again
          </FormButton>
          <button
            @click="goToLogin"
            class="w-full text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppToast } from '~/utils/toastify'

definePageMeta({
  middleware: ['auth'],
  guestOnly: true
})

const route = useRoute()
const router = useRouter()
const toast = useAppToast()

const isProcessing = ref(true)
const authStatus = ref<'processing' | 'success' | 'error'>('processing')
const errorMessage = ref('')
const providerName = ref('')
const isNewUser = ref(false)

onMounted(async () => {
  await processOAuthCallback()
})

const processOAuthCallback = async () => {
  try {
    // Extract provider from URL path or query
    const provider = route.query.provider as string || extractProviderFromPath()

    if (!provider) {
      throw new Error('OAuth provider not specified')
    }

    providerName.value = provider.charAt(0).toUpperCase() + provider.slice(1)

    // Check for OAuth error in query params
    if (route.query.error) {
      throw new Error(route.query.error_description as string || 'OAuth authentication was cancelled or failed')
    }

    // The OAuth callback should have been handled by the backend
    // and the user should be authenticated via cookies
    // Let's verify the authentication status
    const authApi = useAuthApi()
    const profileResponse = await authApi.fetchProfile()

    if (profileResponse.status === 'success' && profileResponse.data?.user) {
      // Authentication successful
      authStatus.value = 'success'

      // Check if this is a new user (you might need to add this to the backend response)
      isNewUser.value = route.query.is_new_user === 'true'

      // Show success message
      if (isNewUser.value) {
        toast.success(`Welcome! Your account has been created with ${providerName.value}`)
      } else {
        toast.success(`Welcome back! Logged in with ${providerName.value}`)
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        authApi.navigateToDashboard()
      }, 2000)

    } else {
      throw new Error('Authentication verification failed')
    }

  } catch (error) {
    console.error('OAuth callback error:', error)
    authStatus.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred'
    toast.error(errorMessage.value)
  } finally {
    isProcessing.value = false
  }
}

const extractProviderFromPath = (): string => {
  // Extract provider from URL path like /auth/oauth/callback?provider=google
  // or from referrer if available
  const path = route.path
  const segments = path.split('/')

  // Look for provider in various places
  if (route.query.provider) {
    return route.query.provider as string
  }

  // Check if provider is in the path
  const providerIndex = segments.indexOf('callback') - 1
  if (providerIndex >= 0 && segments[providerIndex]) {
    return segments[providerIndex]
  }

  return ''
}

const retryAuth = () => {
  router.push('/auth/login')
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>
