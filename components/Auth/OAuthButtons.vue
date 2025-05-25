<template>
  <div class="oauth-buttons">
    <!-- Divider -->
    <div class="flex items-center my-4">
      <div class="flex-1 border-t border-gray-300"></div>
      <span class="px-4 text-sm text-gray-500">{{ dividerText }}:</span>
      <div class="flex-1 border-t border-gray-300"></div>
    </div>

    <!-- OAuth Provider Buttons - Row Layout -->
    <div class="grid grid-cols-3 gap-4">
      <UiButtonsTertiary
        v-for="provider in Object.keys(oauthProviders)" :key="provider"
        @clicked="handleOAuthLogin(provider)"
        :disabled="isLoading"
        :flexdisplay="true"
        :class="[
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
      >
        <!-- Provider Icon -->
        <img
          :src="getProviderIcon(provider)"
          :alt="`${oauthProviders[provider as keyof typeof oauthProviders].name} logo`"
          :class="getProviderIconClass(provider)"
          :style="getProviderIconStyle(provider)"
        />

        <!-- Provider Name -->
        <span class="text-gray-700">
          {{ oauthProviders[provider as keyof typeof oauthProviders].name }}
        </span>
      </UiButtonsTertiary>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  dividerText?: string
}

withDefaults(defineProps<Props>(), {
  dividerText: 'Or continue with'
})

const {
  isLoading,
  oauthProviders,
  loginWithProvider
} = useOAuth()

// Get the SVG icon path for each provider
const getProviderIcon = (provider: string) => {
  const iconMap: Record<string, string> = {
    google: '/images/logos/google.svg',
    facebook: '/images/logos/facebook_f.svg',
    apple: '/images/logos/apple.svg'
  }
  return iconMap[provider] || ''
}

// Get CSS classes for each provider icon (for proper sizing)
const getProviderIconClass = (provider: string) => {
  const classMap: Record<string, string> = {
    google: 'w-5 h-5',
    facebook: 'w-5 h-5',
    apple: 'w-4 h-5' // Apple logo is taller, so reduce width to maintain aspect ratio
  }
  return classMap[provider] || 'w-5 h-5'
}

// Get styling for each provider icon (for coloring SVGs)
const getProviderIconStyle = (provider: string) => {
  const styleMap: Record<string, Record<string, string>> = {
    facebook: {
      filter: 'brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(1652%) hue-rotate(213deg) brightness(97%) contrast(97%)'
    },
    apple: {
      filter: 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)'
    },
    google: {
      // Google SVG should already have the gradient, no filter needed
    }
  }
  return styleMap[provider] || {}
}

// Handle OAuth login - errors will be shown when user clicks
const handleOAuthLogin = async (provider: string) => {
  await loginWithProvider(provider)
}
</script>

<style scoped>
/* Additional styles if needed */
.oauth-buttons {
  width: 100%;
}

/* Font Awesome icons - ensure they're loaded */
.fab {
  font-family: "Font Awesome 6 Brands";
}
</style>
