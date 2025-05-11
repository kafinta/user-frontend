<template>
  <div :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="z-100 w-full overflow-y-scroll fixed h-screen left-0 top-[67px] duration-150 ease-in-out bg-white md:hidden px-6 py-5">
    <div class="py-3">
      <!-- Unauthenticated User Menu -->
      <ul v-if="!signedIn" class="flex flex-col gap-3">
        <li v-if="showMarketplaceLink">
          <UiButtonsSecondary :url="{path: '/marketplace/'}">Marketplace</UiButtonsSecondary>
        </li>
        <li>
          <UiButtonsSecondary :url="{name: 'auth-login'}">Sign In</UiButtonsSecondary>
        </li>
        <li>
          <UiButtonsPrimary :url="{name: 'auth-signup'}">Sign Up</UiButtonsPrimary>
        </li>
      </ul>

      <!-- Authenticated User Menu -->
      <ul v-if="signedIn" class="flex flex-col gap-3">
        <!-- Role switching -->
        <li v-if="isSeller && showRoleSwitch">
          <UiButtonsTertiary @clicked="$router.push({name: 'username-selling-dashboard', params: {username}})" class="w-full text-left">Switch to Selling</UiButtonsTertiary>
        </li>

        <!-- Optional features -->
        <li v-if="showCart">
          <UiButtonsTertiary class="flex gap-3 items-center justify-start w-full" :flexdisplay="true" @clicked="$emit('cartClicked')">
            <UiIconsCart class="w-5 h-5" />
            <span>Cart</span>
          </UiButtonsTertiary>
        </li>

        <!-- Notifications -->
        <li>
          <UiButtonsTertiary class="flex gap-3 items-center justify-start w-full" :flexdisplay="true">
            <div class="relative">
              <UiIconsNotifications class="w-5 h-5" />
              <Badge value="1" size="small" v-if="hasNotifications" class="h-2 w-2 -top-0.5 -right-0.5 absolute scale-75"></Badge>
            </div>
            <span>Notifications</span>
          </UiButtonsTertiary>
        </li>

        <!-- Common dashboard items -->
        <li>
          <UiButtonsTertiary :to="{name: 'username-buying-dashboard', params: {username}}" class="w-full text-left">Dashboard</UiButtonsTertiary>
        </li>
        <li>
          <UiButtonsTertiary :to="{name: 'username-profile', params: {username}}" class="w-full text-left">Profile</UiButtonsTertiary>
        </li>
        <li>
          <UiButtonsTertiary :to="{name: 'username-buying-dashboard', params: {username}}" class="w-full text-left">Orders</UiButtonsTertiary>
        </li>

        <!-- Logout button -->
        <li>
          <UiButtonsTertiary @clicked="$emit('logout')" class="w-full text-left">Log out</UiButtonsTertiary>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Auth store
const authStore = useAuthStore()

// Props with validation - only UI-related props remain
const props = defineProps({
  menu_revealed: {
    type: Boolean,
    default: false
  },
  showMarketplaceLink: {
    type: Boolean,
    default: true
  },
  showCart: {
    type: Boolean,
    default: true
  },
  showRoleSwitch: {
    type: Boolean,
    default: true
  },
  hasNotifications: {
    type: Boolean,
    default: true
  }
})

// Computed properties - directly from auth store
const signedIn = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.user?.username || 'user')
const isSeller = computed(() => authStore.isSeller)
const isCustomer = computed(() => authStore.isCustomer)

// Emit events
const emit = defineEmits(['cartClicked', 'logout'])
</script>