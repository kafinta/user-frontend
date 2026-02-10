<template>
  <div class="w-full select-none">
    <!-- Seller Mode: Dashboard Navbar -->
    <NavigationDashboardNavBar
      v-if="actualMode === 'seller'"
      :mode="actualMode"
      :show-cart="false"
      :has-notifications="true"
    />

    <!-- Buyer Mode: Marketplace Navbar -->
    <NavigationNavBar
      v-else
      :showMarketplaceLink="false"
    />

    <!-- Main content area -->
    <main class="w-full pt-20 md:pt-24 px-6 md:px-8 lg:px-10 py-6 mx-auto min-h-screen">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// Props with validation
const props = defineProps({
  // Mode can be 'seller' or 'buyer'
  mode: {
    type: String,
    default: 'buyer',
    validator: (value: string) => ['seller', 'buyer'].includes(value)
  }
})

// Route and auth store
const route = useRoute()
const authStore = useAuthStore()

// Determine the actual mode based on route and user role
// This ensures onboarding pages show the buyer navbar even though they're in /selling/
const actualMode = computed(() => {
  // If the route is in the selling path but user is not a seller, show buyer mode
  // This handles the onboarding flow where users are not yet sellers
  if (route.name && typeof route.name === 'string' && route.name.includes('selling') && !authStore.isSeller) {
    return 'buyer'
  }

  // Otherwise use the provided mode prop
  return props.mode
})
</script>
