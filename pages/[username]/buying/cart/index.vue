<template>
  <LayoutsDashboard mode="buyer" page_title="Shopping Cart">
    <div class="w-full">
      <!-- Empty Cart State -->
      <template v-if="cartStore.isEmpty && !isLoading">
        <div class="text-center py-16 flex flex-col items-center justify-center">
          <div class="rounded-full p-6 flex items-center justify-center mb-6 bg-accent-50 border border-accent-200 w-24 h-24">
            <UiIconsCart class="w-12 h-12 text-accent-400" />
          </div>
          <UiTypographyH3 class="text-secondary mb-3">Your cart is empty</UiTypographyH3>
          <UiTypographyP class="text-accent-500 mb-6 max-w-md">
            Start shopping to add items to your cart
          </UiTypographyP>
          <UiButtonsPrimary :url="{ path: '/marketplace' }">
            Continue Shopping
          </UiButtonsPrimary>
        </div>
      </template>

      <!-- Loading State -->
      <template v-else-if="isLoading">
        <div class="grid gap-6">
          <UiSkeleton height="120px" v-for="i in 3" :key="`skeleton-${i}`" class="rounded-lg" />
        </div>
      </template>

      <!-- Cart Items -->
      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Items List -->
          <div class="lg:col-span-2">
            <div class="space-y-4">
              <CartItem
                v-for="item in cartStore.items"
                :key="item.id"
                :item="item"
                @update-quantity="handleUpdateQuantity"
                @remove="handleRemoveItem"
              />
            </div>
          </div>

          <!-- Cart Summary -->
          <div class="lg:col-span-1">
            <div class="sticky top-20 bg-accent-50 border border-accent-200 rounded-lg p-6">
              <UiTypographyH3 class="mb-4">Order Summary</UiTypographyH3>

              <div class="space-y-3 mb-6 pb-6 border-b border-accent-200">
                <div class="flex justify-between text-accent-600">
                  <span>Subtotal</span>
                  <span>₦{{ formatPrice(cartStore.subtotal) }}</span>
                </div>
                <div class="flex justify-between text-accent-600">
                  <span>Shipping</span>
                  <span>₦0.00</span>
                </div>
                <div class="flex justify-between text-accent-600">
                  <span>Tax</span>
                  <span>₦0.00</span>
                </div>
              </div>

              <div class="flex justify-between mb-6">
                <UiTypographyH3>Total</UiTypographyH3>
                <UiTypographyH3 class="text-primary">₦{{ formatPrice(cartStore.total) }}</UiTypographyH3>
              </div>

              <FormButton
                :loading="isCheckingOut"
                :disabled="cartStore.isEmpty"
                class="w-full justify-center mb-3"
                @click="handleCheckout"
              >
                Proceed to Checkout
              </FormButton>

              <UiButtonsSecondary
                @click="handleContinueShopping"
                class="w-full justify-center"
              >
                Continue Shopping
              </UiButtonsSecondary>
            </div>
          </div>
        </div>
      </template>
    </div>
  </LayoutsDashboard>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useCartApi } from '~/composables/useCartApi'
import CartItem from '~/components/Cart/Item.vue'
import UiIconsCart from '~/components/Ui/Icons/Cart.vue'
import UiTypographyH3 from '~/components/Ui/Typography/H3.vue'
import UiTypographyP from '~/components/Ui/Typography/P.vue'
import UiButtonsPrimary from '~/components/Ui/Buttons/Primary.vue'
import UiButtonsSecondary from '~/components/Ui/Buttons/Secondary.vue'
import FormButton from '~/components/Form/Button.vue'
import UiSkeleton from '~/components/Ui/Skeleton.vue'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
})

useHead({
  title: 'Shopping Cart | Kafinta',
  meta: [
    { name: 'description', content: 'View and manage items in your shopping cart' }
  ]
})

const router = useRouter()
const cartStore = useCartStore()
const { fetchCart, removeFromCart, updateCartItem } = useCartApi()

const isLoading = ref(true)
const isCheckingOut = ref(false)

function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price)
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

function handleContinueShopping() {
  router.push('/marketplace')
}

async function handleCheckout() {
  isCheckingOut.value = true
  // TODO: Implement checkout flow
  // For now, just navigate to checkout page
  router.push('/checkout')
  isCheckingOut.value = false
}

onMounted(async () => {
  await fetchCart()
  isLoading.value = false
})
</script>