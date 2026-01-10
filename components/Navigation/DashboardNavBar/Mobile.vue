<template>
  <ClientOnly>
    <transition name="slide-down">
      <div
        v-if="menuRevealed"
        class="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-accent-200 shadow-lg z-40"
      >
        <div class="px-4 py-4 space-y-2">
          <!-- Navigation Links -->
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.route"
            :to="item.to"
            class="block px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium"
            :class="[
              isRouteActive(item.route)
                ? 'bg-primary text-white'
                : 'text-secondary hover:bg-accent-100'
            ]"
            @click="$emit('navigate')"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Become a Seller Button (Buyer mode only, for non-sellers) -->
          <UiButtonsPrimary
            v-if="isBuyerMode && !isSeller"
            @clicked="becomeASeller"
            class="w-full"
          >
            Become a Seller
          </UiButtonsPrimary>

          <!-- Cart Link (Buyer only) -->
          <NuxtLink
            v-if="isBuyerMode && showCart"
            :to="{ name: 'username-buying-cart', params: { username } }"
            class="block px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium text-secondary hover:bg-accent-100 relative"
            @click="$emit('navigate')"
          >
            <div class="flex items-center gap-2">
              <UiIconsCart class="w-4 h-4" />
              <span>Cart</span>
              <span v-if="cartItemCount > 0" class="ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5">
                {{ cartItemCount }}
              </span>
            </div>
          </NuxtLink>

          <!-- Divider -->
          <div class="border-t border-accent-200 my-2"></div>

          <!-- Profile Link -->
          <NuxtLink
            :to="{ name: 'username-profile', params: { username } }"
            class="block px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium text-secondary hover:bg-accent-100"
            @click="$emit('navigate')"
          >
            Profile
          </NuxtLink>

          <!-- Role Switch (if seller) -->
          <NuxtLink
            v-if="isSeller"
            :to="{ name: 'username-selling-dashboard', params: { username } }"
            class="block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium text-secondary hover:bg-accent-100"
            @click="$emit('navigate')"
          >
            Switch to Selling
          </NuxtLink>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </div>
    </transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthApi } from '~/composables/useAuthApi'
import { useAppToast } from '~/utils/toastify'

const props = defineProps({
  menuRevealed: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'buyer',
    validator: (value: string) => ['seller', 'buyer'].includes(value)
  },
  username: {
    type: String,
    required: true
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  cartItemCount: {
    type: Number,
    default: 0
  },
  showCart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'logout', 'navigate'])

const router = useRouter()
const route = useRoute()
const toast = useAppToast()

const isBuyerMode = computed(() => props.mode === 'buyer')

const navigationItems = computed(() => {
  if (props.mode === 'seller') {
    return [
      { label: 'Dashboard', route: 'dashboard', to: { name: 'username-selling-dashboard', params: { username: props.username } } },
      { label: 'Products', route: 'products', to: { name: 'username-selling-products', params: { username: props.username } } },
      { label: 'Orders', route: 'orders', to: { name: 'username-selling-orders', params: { username: props.username } } },
      { label: 'Earnings', route: 'earnings', to: { name: 'username-selling-earnings', params: { username: props.username } } }
    ]
  } else {
    return [
      { label: 'Dashboard', route: 'dashboard', to: { name: 'username-buying-dashboard', params: { username: props.username } } },
      { label: 'Orders', route: 'orders', to: { name: 'username-buying-orders', params: { username: props.username } } }
    ]
  }
})

function isRouteActive(routeSegment: string): boolean {
  return (route.name && route.name.includes(routeSegment)) || (route.path && route.path.includes(routeSegment))
}

function becomeASeller(): void {
  router.push({
    name: 'username-selling-onboarding',
    params: { username: props.username }
  })
  emit('navigate')
}

async function handleLogout(): Promise<void> {
  try {
    toast.info('Logging out', 'Please wait...')
    const authApi = useAuthApi()
    const response = await authApi.logout()

    if (response.status === 'success') {
      toast.success('Success', response.message || 'Logged out successfully')
      emit('logout')
    } else {
      toast.error('Error', response.message || 'Failed to log out')
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred during logout')
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

