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
    <ModalsDrawer :openDialog="openCart" @closeDialog="toggleCart()" :footerButtons="true" :scrollable="true" okText="Checkout">
      <template #title>My Cart ({{ cartStore.totalItems }} items)</template>

      <!-- Empty Cart State -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
        <UiIconsCart class="w-12 h-12 text-accent-400 mx-auto mb-4" />
        <p class="text-accent-500">Your cart is empty</p>
      </div>

      <!-- Cart Items -->
      <ul v-else class="grid gap-4">
        <CartItem
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
          @update-quantity="handleUpdateQuantity"
          @remove="handleRemoveItem"
        />
      </ul>
    </ModalsDrawer>
    <NavigationFooter/>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useCartApi } from '~/composables/useCartApi'
import CartItem from '~/components/Cart/Item.vue'
import UiIconsCart from '~/components/Ui/Icons/Cart.vue'

const router = useRouter()
const cartStore = useCartStore()
const { fetchCart, removeFromCart, updateCartItem } = useCartApi()

const searchBox = ref(false)
const search_button_hovered = ref(false)
const openCart = ref(false)

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
  await fetchCart()
})
</script>
