<template>
  <nav class="fixed z-100 w-full top-0 left-0 border-b border-accent-200 bg-white">
    <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 sm:px-6 flex items-center justify-between py-4">
      <!-- Logo -->
      <div class="w-28 md:w-36 flex-shrink-0">
        <NavigationLogo @logoClicked="handleLogoClick" />
      </div>

      <!-- Search bar -->
      <form @submit.prevent="pushSearch" class="md:flex-1 lg:max-w-md xl:max-w-xl md:flex relative hidden mx-2 md:mx-4">
        <input
          @focus="focus()"
          @input="$emit('input', $event.target.value)"
          v-model="search_input"
          class="w-full flex justify-center py-2 md:py-3 px-4 border text-sm outline-none border-secondary ring-0 focus:outline-none focus:border-primary active:border-primary rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out bg-white"
          autocomplete="off"
          ref="input"
          type="text"
          placeholder="What are you looking for?"
        />
        <button type="submit" class="bg-primary rounded-md p-2 md:p-3 absolute px-3 md:px-4 right-0 top-0">
          <UiIconsSearch class="text-white w-4 md:w-5 h-4 md:h-[22px]" />
        </button>
      </form>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex flex-shrink-0">
        <!-- Authenticated User Menu -->
        <ul v-if="isAuthenticated" class="flex gap-2 md:gap-3 lg:gap-5 items-center">
          <!-- Cart icon (left side) -->
          <li v-if="showCart">
            <button title="Cart" @click="handleCartClick" class="p-2 transition-colors duration-200 relative">
              <UiIconsCart class="w-5 h-5 text-secondary hover:text-primary transition-colors duration-200" />
              <span v-if="cartItemCountComputed > 0" class="h-2.5 w-2.5 bg-primary border border-white rounded-full top-1 right-1 absolute"></span>
            </button>
          </li>

          <li v-if="showMarketplaceLink">
            <UiButtonsSecondary :url="{path: '/marketplace/'}" class="text-sm whitespace-nowrap">Marketplace</UiButtonsSecondary>
          </li>

          <!-- Role-based navigation -->
          <li v-if="isSeller">
            <UiButtonsSecondary @clicked="switchToSelling" class="text-sm whitespace-nowrap">Switch to Selling</UiButtonsSecondary>
          </li>

          <!-- Notification icon -->
          <li>
            <button title="Notifications" class="p-2 transition-colors duration-200 relative">
              <UiIconsNotifications class="w-5 h-5 text-secondary hover:text-primary transition-colors duration-200" />
              <UiBadge value="1" size="small" v-if="hasNotifications" class="h-2 w-2 -top-0.5 -right-0.5 absolute scale-75"></UiBadge>
            </button>
          </li>

          <!-- User profile dropdown (common for authenticated users) -->
          <li class="relative">
            <UiDropdownMenu :items="userMenuItems">
              <template #trigger="{ open, toggleMenu }">
                <button @click="toggleMenu" class="profile-trigger" title="Click to open user menu">
                  <UserProfilePicture :large_dimensions="true" :username="username" class="cursor-pointer" />
                </button>
              </template>
            </UiDropdownMenu>
          </li>
        </ul>

        <!-- Unauthenticated User Menu -->
        <ul v-else class="flex gap-2 md:gap-3 lg:gap-5 items-center">
          <!-- Cart icon (left side) -->
          <li v-if="showCart">
            <button title="Cart" @click="toggleCart" class="p-2 transition-colors duration-200 relative">
              <UiIconsCart class="w-5 h-5 text-secondary hover:text-primary transition-colors duration-200" />
              <span v-if="cartItemCountComputed > 0" class="h-2.5 w-2.5 bg-primary border border-white rounded-full top-1 right-1 absolute"></span>
            </button>
          </li>

          <li v-if="showMarketplaceLink">
            <UiButtonsSecondary :url="{path: '/marketplace/'}" class="text-sm whitespace-nowrap">Marketplace</UiButtonsSecondary>
          </li>

          <li>
            <UiButtonsSecondary :url="{path: '/auth/login'}" class="text-sm whitespace-nowrap">Sign In</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsPrimary :url="{path: '/auth/signup'}" class="text-sm whitespace-nowrap">Sign Up</UiButtonsPrimary>
          </li>
        </ul>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="flex items-center gap-6 md:hidden">
        <UiButtonsSecondary @clicked="toggleSearchBox()" class="flex gap-2 group items-center md:hidden">
          <UiIconsSearch :class="keep_button_hovered ? 'text-primary' : 'text-secondary'" class="group-hover:text-primary w-5 h-5 duration-500 ease-in-out"></UiIconsSearch>
          <span :class="keep_button_hovered ? 'text-primary border-primary' : ''">Search</span>
        </UiButtonsSecondary>

        <button class="flex md:hidden" @click="toggleMenu">
          <div class="w-8">
            <div :class="menuRevealed ? 'transition transform rotate-45 items-center w-8' : 'transition w-8'" class="block cursor-pointer bg-primary" style="height: 3px;"></div>
            <div :class="menuRevealed ? 'transition transform -rotate-45 item-center w-8 -mt-0.5' : 'transition w-8 mt-1.5'" class="block cursor-pointer bg-primary" style="height: 3px;"></div>
          </div>
        </button>
      </div>

      <!-- Mobile Menu (rendered conditionally) -->
      <NavigationNavBarMobile
        :menu_revealed="menuRevealed"
        :showMarketplaceLink="showMarketplaceLink"
        :hasNotifications="hasNotifications"
        :cartItemCount="cartItemCount"
        @cartClicked="toggleCart"
        @logout="logout"
      />
    </div>
  </nav>

  <!-- Cart Drawer for Guests -->
  <ModalsDrawer v-if="!isAuthenticated && showCart" :openDialog="openCart" @closeDialog="toggleCart()" :footerButtons="true" :scrollable="true" okText="Checkout" width="md" :okDisabled="cartStore.isEmpty" @continueAction="handleGuestCheckout">
    <template #title>My Cart</template>

    <!-- Loading State -->
    <div v-if="isLoadingCart" class="space-y-4">
      <UiSkeleton height="100px" class="rounded-lg" v-for="i in 3" :key="`skeleton-${i}`" />
    </div>

    <!-- Empty Cart State -->
    <div v-else-if="cartStore.isEmpty" class="text-center py-12">
      <UiIconsCart class="w-12 h-12 text-accent-400 mx-auto mb-4" />
      <p class="text-accent-500">Your cart is empty</p>
    </div>

    <!-- Cart Items and Summary -->
    <div v-else class="flex flex-col h-full">
      <!-- Items List -->
      <div class="flex-1 overflow-y-auto">
        <ul class="space-y-0">
          <CartItem
            v-for="item in cartStore.items"
            :key="item.id"
            :item="item"
            @update-quantity="handleUpdateQuantity"
            @remove="handleRemoveItem"
          />
        </ul>
      </div>

      <!-- Summary Section -->
      <div class="border-t border-accent-200 pt-4 mt-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-accent-600">Subtotal</span>
          <span class="text-secondary font-medium">₦{{ formatPrice(cartStore.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-accent-600">Shipping</span>
          <span class="text-secondary font-medium">Calculated at checkout</span>
        </div>
        <div class="border-t border-accent-100 pt-3 flex justify-between">
          <span class="text-secondary font-semibold">Total</span>
          <span class="text-primary font-bold text-lg">₦{{ formatPrice(cartStore.total) }}</span>
        </div>
      </div>
    </div>
  </ModalsDrawer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useAuthApi } from '~/composables/useAuthApi';
import { useCartApi } from '~/composables/useCartApi';
import { useGuestCart } from '~/composables/useGuestCart';
import { useAppToast } from '~/utils/toastify';
import UiDropdownMenu from '~/components/Ui/DropdownMenu.vue'
import CartItem from '~/components/Cart/Item.vue'
import UiIconsCart from '~/components/Ui/Icons/Cart.vue'

// Props with validation - only UI-related props remain
const props = defineProps({
  showMarketplaceLink: {
    type: Boolean,
    default: true
  },

  showCart: {
    type: Boolean,
    default: true
  },

  // UI state
  keep_button_hovered: Boolean,

  // Cart item count
  cartItemCount: {
    type: Number,
    default: 0
  }
});

// Emits
const emit = defineEmits([
  'cartClicked',
  'toggleSearchBox',
  'input',
  'navigate',
  'switchMode',
  'logout'
]);

// Router
const router = useRouter()

// Auth store
const authStore = useAuthStore()
const cartStore = useCartStore()
const { removeFromCart, updateCartItem } = useCartApi()
const guestCart = useGuestCart()

// Refs
const input = ref(null)
const userOptions = ref(null)

// Reactive state
const menuRevealed = ref(false)
const user_options = ref(false)
const search_input = ref('')
const hasNotifications = ref(true) // Set to true to show the notification indicator by default
const openCart = ref(false)
const isLoadingCart = ref(false)

// Computed properties - directly from auth store
const isAuthenticated = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.user?.username || 'user')
// isSeller is used in the template for conditional rendering
const isSeller = computed(() => authStore.isSeller)
// Cart item count - use store value if available, otherwise use prop
const cartItemCountComputed = computed(() => {
  return cartStore.totalItems || props.cartItemCount
})
// Methods
function toggleMenu() {
  menuRevealed.value = !menuRevealed.value
}

function focus() {
  input.value?.focus()
}

function toggleOptions() {
  user_options.value = !user_options.value
}

function toggleSearchBox() {
  emit('toggleSearchBox')
}

function pushSearch() {
  router.push({ name: 'marketplace-products', query: { query: search_input.value } })
}

function handleLogoClick() {
  emit('navigate', { path: '/', type: 'logo' })
  try {
    router.push('/')
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

function switchToSelling() {
  const route = {
    name: 'username-selling-dashboard',
    params: { username: username.value }
  }
  emit('switchMode', { mode: 'seller', route })
  try {
    router.push(route)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

function formatPrice(price) {
  // Handle invalid values
  const numPrice = Number(price) || 0
  return new Intl.NumberFormat('en-NG').format(numPrice)
}

function toggleCart() {
  openCart.value = !openCart.value
}

function handleCartClick() {
  if (authStore.isAuthenticated) {
    // Redirect to cart page for authenticated users
    router.push({ name: 'username-buying-cart', params: { username: authStore.user?.username } })
  } else {
    // Open cart sidebar for guests
    toggleCart()
  }
}

async function handleUpdateQuantity(itemId, quantity) {
  if (quantity <= 0) {
    await handleRemoveItem(itemId)
  } else {
    await updateCartItem(itemId, quantity)
  }
}

async function handleRemoveItem(itemId) {
  await removeFromCart(itemId)
}

function handleGuestCheckout() {
  // Close the cart drawer
  toggleCart()
  // Redirect to checkout - middleware will handle auth
  router.push('/checkout')
}

// This function is kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function navigateTo(path) {
  emit('navigate', { path, type: 'button' })
  try {
    router.push(path)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

async function logout() {
  emit('logout')

  // Initialize toast and auth API
  const toast = useAppToast()
  const authApi = useAuthApi()

  try {
    // Show loading toast
    toast.info('Logging out', 'Please wait...')

    // Call logout using the auth API composable
    const response = await authApi.logout()

    // Close the user options menu before page reload
    user_options.value = false

    if (response.status === 'success') {
      // Success toast - though this may not be seen due to page reload
      toast.success('Success', response.message || 'Logged out successfully')

      // Navigate to home page after successful logout
      router.push('/')
    } else {
      // Error toast
      toast.error('Error', response.message || 'Failed to log out')
      console.error('Logout failed:', response)
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Show error toast
    toast.error('Error', 'An unexpected error occurred during logout')
    // For testing, we'll still close the menu
    user_options.value = false
  }
}

// Handle click outside to close user options
function handleClickOutside(event) {
  // Check if the click was outside the dropdown and not on the profile picture
  if (userOptions.value &&
      !userOptions.value.contains(event.target) &&
      !event.target.closest('.profile-trigger')) {
    user_options.value = false
  }
}

// Check authentication status
async function checkAuthStatus() {
  // No session validation needed - rely on backend to handle expired sessions
  // Auth store is initialized on app startup and loads data from localStorage
}

const userMenuItems = [
  {
    label: 'Dashboard',
    action: () => router.push({ name: 'username-buying-dashboard', params: { username: username.value } }),
  },
  {
    label: 'Profile',
    action: () => router.push({ name: 'username-profile', params: { username: username.value } }),
  },
  {
    label: 'Orders',
    action: () => router.push({ name: 'username-buying-orders', params: { username: username.value } }),
  },
  { separator: true },
  {
    label: 'Log out',
    action: logout,
    danger: true,
  },
]

// Lifecycle hooks
onMounted(async () => {
  if (import.meta.client) {
    document.addEventListener('click', handleClickOutside)

    // Load guest cart from localStorage
    guestCart.loadCart()

    // Set up cart based on auth status
    if (authStore.isAuthenticated) {
      cartStore.setGuestMode(false)
    } else {
      cartStore.setGuestMode(true)
      cartStore.setItems(guestCart.items.value)
    }

    // Check auth status on mount
    await checkAuthStatus()

    // Auth store auto-initializes when first accessed
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>
