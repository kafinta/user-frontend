<template>
  <LayoutsDashboard mode="seller" pageTitle="My Products">
    <div class="md:flex block w-full gap-5">
      <div class="w-full mt-4">
        <div v-if="productsStore.myProducts.length > 0" class="flex justify-end w-full">
          <UiButtonsPrimary :url="{path: 'products/new'}">List a New Product</UiButtonsPrimary>
        </div>

        <!-- Loading State -->
        <div v-if="productsStore.isLoading" class="flex justify-center items-center py-12">
          <UiIconsLoading class="w-8 h-8" />
          <span class="ml-2 text-secondary">Loading your products...</span>
        </div>

        <!-- Products List -->
        <ul v-else-if="productsStore.myProducts.length > 0" class="grid lg:grid-cols-2 gap-6 place-items-center mt-6">
          <li v-for="product in productsStore.myProducts" :key="product.id" class="flex gap-4 border items-center border-accent-200 rounded-lg w-full p-2 h-full">
            <!-- Product Image -->
            <div class="bg-accent-200 rounded-md product w-1/3 h-full overflow-hidden">
              <img
                v-if="product.images && product.images.length > 0"
                :src="getImageUrl(product.images[0].url)"
                :alt="product.name"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center text-accent-400">
                <UiIconsCamera class="w-8 h-8" />
              </div>
            </div>

            <!-- Product Details -->
            <div class="w-2/3 justify-between flex flex-col h-full gap-4">
              <div>
                <UiTypographyH3 class="text-lg">{{ product.name }}</UiTypographyH3>
                <p class="text-sm text-accent-500 mt-1">₦{{ formatPrice(product.price) }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span
                    :class="getStatusClass(product.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(product.status) }}
                  </span>
                  <span v-if="product.manage_stock" class="text-xs text-accent-500">
                    Stock: {{ product.stock_quantity }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <button
                  @click="editProduct(product)"
                  class="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors duration-200"
                >
                  <UiIconsEdit class="w-4 h-4" />
                  Edit
                </button>
                <button
                  @click="confirmDelete(product)"
                  class="flex items-center gap-2 text-red-600 text-sm hover:text-red-700 transition-colors duration-200"
                >
                  <UiIconsDelete class="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Empty State -->
        <div v-else class="grid place-items-center h-full mt-6">
          <div class="text-center">
            <UiTypographyH3>No products yet.</UiTypographyH3>
            <UiTypographyP class="text-accent-500 mt-2 mb-4">Start by creating your first product listing.</UiTypographyP>
            <UiButtonsPrimary class="mx-auto" :url="{path: 'products/new'}">List a New Product</UiButtonsPrimary>
          </div>
        </div>
      </div>
    </div>

    <ModalsOverlay @closeOverlay="deleteModalOpen = false" :openOverlay="deleteModalOpen">
      <template #title>Delete Product</template>
      <UiIconsDelete class="w-24 h-24" />
      <UiTypographyP v-if="productToDelete">
        Are you sure you want to delete "{{ productToDelete.name }}"? This action is irreversible!
      </UiTypographyP>
      <div class="flex gap-6">
        <UiButtonsPrimary @clicked="deleteModalOpen = false">Cancel</UiButtonsPrimary>
        <FormButton
          @click="deleteProduct"
          class="bg-red-600 hover:bg-red-700 text-white"
          :loading="isDeleting"
        >
          Delete Anyway
        </FormButton>
      </div>
    </ModalsOverlay>
  </LayoutsDashboard>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true,
  requiresSeller: true
});

useHead({
  title: 'Manage Products | Kafinta',
  meta: [
    { name: 'description', content: 'Manage your product listings on Kafinta' }
  ]
});

import { ref, onMounted, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { useProductsStore } from '~/stores/products'
import { useAppToast } from '~/utils/toastify'

const router = useRouter()
const route = useRoute()
const productApi = useProductApi()
const productsStore = useProductsStore()
const toast = useAppToast()

// State
const isDeleting = ref(false)
const deleteModalOpen = ref(false)
const productToDelete = ref(null)

// Helper functions
const getImageUrl = (url) => {
  if (url.startsWith('/')) {
    // Handle relative URLs - use runtime config or fallback
    if (process.client) {
      return `${window.location.origin}${url}`
    }
    // For SSR, return the relative URL as-is
    return url
  }
  return url
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG').format(price)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    case 'denied':
      return 'bg-red-100 text-red-800'
    case 'out_of_stock':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Active'
    case 'draft':
      return 'Draft'
    case 'paused':
      return 'Paused'
    case 'denied':
      return 'Denied'
    case 'out_of_stock':
      return 'Out of Stock'
    default:
      return status
  }
}

// Actions
const editProduct = (product) => {
  // Use the new separate edit routes with slug
  // Backend should provide slug, but fallback to generated slug if needed
  const productSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-')

  // Navigate to the edit route
  router.push({
    path: `/${route.params.username}/selling/products/${productSlug}/edit`
  })
}

const confirmDelete = (product) => {
  productToDelete.value = product
  deleteModalOpen.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  try {
    isDeleting.value = true
    const response = await productApi.deleteProduct(productToDelete.value.id)

    if (response.status === 'success') {
      // Remove product from store
      productsStore.removeProduct(productToDelete.value.id)
      deleteModalOpen.value = false
      productToDelete.value = null
    }
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    isDeleting.value = false
  }
}

// Load products function
const loadProducts = async () => {
  try {
    productsStore.setLoading(true)
    const response = await productApi.getMyProducts()

    console.log('Products API Response:', response) // Debug log

    if (response.status === 'success' && response.data?.data) {
      // Backend returns paginated data with products in data.data
      productsStore.setMyProducts(response.data.data)
      console.log('Loaded products:', productsStore.myProducts) // Debug log
    } else {
      console.log('No products found or unexpected response structure')
    }
  } catch (error) {
    console.error('Error loading products:', error)
    toast.error('Failed to load products')
  } finally {
    productsStore.setLoading(false)
  }
}

// Load products on mount
onMounted(loadProducts)

// Refresh products when returning to page
onActivated(loadProducts)
</script>
<style>
  .gig-img {
    width: 5rem !important;
    min-width: 5rem;
    background-color: #D3D3D3;
    aspect-ratio: 3/2;
  }
</style>