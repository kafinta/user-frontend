<template>
  <nav class="fixed z-50 w-full top-0 left-0 border-b border-accent-200 bg-white">
    <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 sm:px-6 flex items-center justify-between py-4">
      <!-- Logo -->
      <div class="w-28 md:w-36 flex-shrink-0">
        <NavigationLogo @logoClicked="handleLogoClick" />
      </div>

      <!-- Desktop Navigation - Center -->
      <div class="hidden md:flex items-center gap-8 flex-1 justify-center">
        <nav-link
          v-for="item in navigationItems"
          :key="item.route"
          :to="item.to"
          :is-active="isRouteActive(item.route)"
          :label="item.label"
          :icon="item.icon"
        />
      </div>

      <!-- Desktop Right Section -->
      <div class="hidden md:flex items-center gap-4">
        <!-- Cart Icon (Buyer only) -->
        <button
          v-if="isBuyerMode && showCart"
          @click="navigateToCart"
          class="relative p-2 hover:bg-accent-100 rounded-lg transition-colors duration-200"
          :aria-label="cartItemCount > 0 ? `Cart (${cartItemCount} items)` : 'Cart'"
        >
          <UiIconsCart class="w-5 h-5 text-secondary" />
          <span
            v-if="cartItemCount > 0"
            class="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"
          ></span>
        </button>

        <!-- Notifications -->
        <button
          class="relative p-2 hover:bg-accent-100 rounded-lg transition-colors duration-200"
          aria-label="Notifications"
        >
          <UiIconsNotifications class="w-5 h-5 text-secondary" />
          <span v-if="hasNotifications" class="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button
            @click="toggleProfileMenu"
            class="flex items-center gap-2 p-2 hover:bg-accent-100 rounded-lg transition-colors duration-200"
            :aria-label="username"
            :aria-expanded="profileMenuOpen"
          >
            <UserProfilePicture :username="username" :large_dimensions="false" />
            <UiIconsChevron
              class="w-4 h-4 text-secondary transition-transform duration-300"
              :class="{ 'rotate-180': profileMenuOpen }"
            />
          </button>

          <!-- Profile Dropdown Menu -->
          <transition name="fade">
            <div
              v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-accent-200 rounded-lg shadow-lg py-2 z-50"
            >
              <button
                @click="navigateToProfile"
                class="w-full text-left px-4 py-2 hover:bg-accent-50 transition-colors duration-200 text-sm text-secondary"
              >
                Profile
              </button>

              <!-- Role Switch (if seller) -->
              <button
                v-if="isSeller"
                @click="switchToSelling"
                class="w-full text-left px-4 py-2 hover:bg-accent-50 transition-colors duration-200 text-sm text-secondary border-t border-accent-200"
              >
                Switch to Selling
              </button>

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors duration-200 text-sm text-red-600 border-t border-accent-200"
              >
                Log out
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        class="flex md:hidden p-2 hover:bg-accent-100 rounded-md transition-colors duration-200"
        @click="toggleMobileMenu"
        :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobileMenuOpen"
      >
        <div class="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
          <div
            class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out origin-center"
            :class="mobileMenuOpen ? 'rotate-45 translate-y-2' : ''"
          ></div>
          <div
            class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out"
            :class="mobileMenuOpen ? 'opacity-0' : 'opacity-100'"
          ></div>
          <div
            class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out origin-center"
            :class="mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''"
          ></div>
        </div>
      </button>
    </div>

    <!-- Mobile Menu -->
    <DashboardNavBarMobile
      :menu-revealed="mobileMenuOpen"
      :mode="mode"
      :username="username"
      :is-seller="isSeller"
      :cart-item-count="cartItemCount"
      :show-cart="showCart"
      @close="mobileMenuOpen = false"
      @logout="handleLogout"
      @navigate="handleMobileNavigation"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useAuthApi } from '~/composables/useAuthApi'
import { useAppToast } from '~/utils/toastify'
import NavLink from './NavLink.vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'buyer',
    validator: (value: string) => ['seller', 'buyer'].includes(value)
  },
  showCart: {
    type: Boolean,
    default: true
  },
  hasNotifications: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useAppToast()

const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)

const username = computed(() => authStore.user?.username || 'user')
const isSeller = computed(() => authStore.isSeller)
const isBuyerMode = computed(() => props.mode === 'buyer')
const cartItemCount = computed(() => cartStore.totalItems || 0)

const navigationItems = computed(() => {
  if (props.mode === 'seller') {
    return [
      { label: 'Dashboard', route: 'dashboard', to: { name: 'username-selling-dashboard', params: { username: username.value } }, icon: 'UiIconsHome' },
      { label: 'Products', route: 'products', to: { name: 'username-selling-products', params: { username: username.value } }, icon: 'UiIconsCart' },
      { label: 'Earnings', route: 'earnings', to: { name: 'username-selling-earnings', params: { username: username.value } }, icon: 'UiIconsTransactions' }
    ]
  } else {
    return [
      { label: 'Dashboard', route: 'dashboard', to: { name: 'username-buying-dashboard', params: { username: username.value } }, icon: 'UiIconsHome' },
      { label: 'Orders', route: 'orders', to: { name: 'username-buying-orders', params: { username: username.value } }, icon: 'UiIconsTransactions' }
    ]
  }
})

function isRouteActive(routeSegment: string): boolean {
  return (route.name && route.name.includes(routeSegment)) || (route.path && route.path.includes(routeSegment))
}

function toggleMobileMenu(): void {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function toggleProfileMenu(): void {
  profileMenuOpen.value = !profileMenuOpen.value
}

function handleLogoClick(): void {
  if (props.mode === 'seller') {
    window.location.reload()
  } else {
    router.push({ name: 'index' })
  }
}

function navigateToCart(): void {
  router.push({ name: 'username-buying-cart', params: { username: username.value } })
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
}

function navigateToProfile(): void {
  router.push({ name: 'username-profile', params: { username: username.value } })
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
}

function switchToSelling(): void {
  router.push({ name: 'username-selling-dashboard', params: { username: username.value } })
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
}

async function handleLogout(): Promise<void> {
  try {
    toast.info('Logging out', 'Please wait...')
    const authApi = useAuthApi()
    const response = await authApi.logout()

    if (response.status === 'success') {
      toast.success('Success', response.message || 'Logged out successfully')
    } else {
      toast.error('Error', response.message || 'Failed to log out')
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred during logout')
  }
}

function handleMobileNavigation(): void {
  mobileMenuOpen.value = false
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[aria-label*="Profile"]') && !target.closest('[aria-expanded]')) {
        profileMenuOpen.value = false
      }
    })
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

