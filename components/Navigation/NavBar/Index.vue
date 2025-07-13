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
          <li v-if="showMarketplaceLink">
            <UiButtonsSecondary :url="{path: '/marketplace/'}" class="text-sm whitespace-nowrap">Marketplace</UiButtonsSecondary>
          </li>

          <!-- Role-based navigation -->
          <li v-if="isSeller">
            <UiButtonsSecondary @clicked="switchToSelling" class="text-sm whitespace-nowrap">Switch to Selling</UiButtonsSecondary>
          </li>

          <!-- Cart icon -->
          <li>
            <button title="Cart" @click="$emit('cartClicked')" class="p-2 transition-colors duration-200 relative">
              <UiIconsCart class="w-5 h-5 text-secondary hover:text-primary transition-colors duration-200" />
              <UiBadge value="1" size="small" v-if="hasNotifications" class="h-2 w-2 -top-0.5 -right-0.5 absolute scale-75"></UiBadge>
            </button>
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
        @cartClicked="$emit('cartClicked')"
        @logout="logout"
      />
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useAuthApi } from '~/composables/useAuthApi';
import { useAppToast } from '~/utils/toastify';
import UiDropdownMenu from '~/components/Ui/DropdownMenu.vue'

// Props with validation - only UI-related props remain
const props = defineProps({
  showMarketplaceLink: {
    type: Boolean,
    default: true
  },

  // UI state
  keep_button_hovered: Boolean
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

// Refs
const input = ref(null)
const userOptions = ref(null)

// Reactive state
const menuRevealed = ref(false)
const user_options = ref(false)
const search_input = ref('')
const hasNotifications = ref(true) // Set to true to show the notification indicator by default

// Computed properties - directly from auth store
const isAuthenticated = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.user?.username || 'user')
// isSeller is used in the template for conditional rendering
const isSeller = computed(() => authStore.isSeller)
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
    action: () => router.push({ name: 'username-buying-dashboard', params: { username: username.value } }),
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
