<template>
  <div class="bg-white">
    <NavigationNavBar
      :keep_button_hovered="search_button_hovered"
      @toggleSearchBox="toggleSearch()"
      @cartClicked="toggleCart"
      :showCart="true"
      :showMarketplaceLink="false"
      :cartItemCount="cartStore.totalItems"
    />
    <Search @toggleSearchBox="toggleSearch()" :searchBoxState="searchBox" />
    <div class="mt-16 mb-8 py-6 min-h-screen">
      <slot/>
    </div>
    <ModalsDrawer :openDialog="openCart" @closeDialog="toggleCart()" :footerButtons="true" :scrollable="true" okText="Checkout" width="md">
      <template #title>My Cart</template>

      <!-- Empty Cart State -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
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
    <NavigationFooter/>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useCartApi } from '~/composables/useCartApi'
import { useGuestCart } from '~/composables/useGuestCart'
import CartItem from '~/components/Cart/Item.vue'
import UiIconsCart from '~/components/Ui/Icons/Cart.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { fetchCart, removeFromCart, updateCartItem } = useCartApi()
const guestCart = useGuestCart()

const searchBox = ref(false)
const search_button_hovered = ref(false)
const openCart = ref(false)

function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price)
}

function toggleCart() {
  openCart.value = !openCart.value
}

function toggleSearch() {
  searchBox.value = !searchBox.value
  search_button_hovered.value = !search_button_hovered.value
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

onMounted(async () => {
  // Load guest cart from localStorage
  guestCart.loadCart()

  // If user is authenticated, fetch their cart from server
  if (authStore.isAuthenticated) {
    cartStore.setGuestMode(false)
    await fetchCart()
  } else {
    // User is not authenticated, use guest cart
    cartStore.setGuestMode(true)
    cartStore.setItems(guestCart.items.value)
  }
})
</script>
