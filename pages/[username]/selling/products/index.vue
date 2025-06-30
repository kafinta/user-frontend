<template>
  <LayoutsDashboard mode="seller" pageTitle="My Products">
    <div class="md:flex block w-full gap-5">
      <div class="w-full mt-4">
        <div v-if="products.length > 0" class="flex justify-end w-full">
          <UiButtonsPrimary :url="{path: 'products/new'}">List a New Product</UiButtonsPrimary>
        </div>

        <!-- Loading State -->
        <ul v-if="isLoading || isInitialLoad" class="grid lg:grid-cols-2 gap-6 place-items-center mt-6">
          <li v-for="n in 6" :key="n" class="w-full">
            <UiSkeleton height="15rem" class="rounded-lg w-full" />
          </li>
        </ul>

        <!-- Products List -->
        <div v-if="!isLoading && !isInitialLoad">
          <ul v-if="products.length > 0" class="grid lg:grid-cols-2 gap-6 place-items-center mt-6">
            <li v-for="product in products" :key="product.id" class="flex gap-4 border items-center border-accent-200 rounded-lg w-full p-2 h-full">
              <!-- Product Image -->
              <div class="bg-accent-200 rounded-md product w-1/3 h-full overflow-hidden">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="getImageUrl(product.images[0].path)"
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
          <div v-else class="grid place-items-center h-full mt-6">
            <div class="text-center">
              <UiTypographyH3>No products yet.</UiTypographyH3>
              <UiTypographyP class="text-accent-500 mt-2 mb-4">Start by creating your first product listing.</UiTypographyP>
              <UiButtonsPrimary class="mx-auto" :url="{path: 'products/new'}">List a New Product</UiButtonsPrimary>
            </div>
          </div>
          <UiPagination
            v-if="products.length > 0 && pagination && pagination.last_page > 1"
            :current-page="pagination.current_page"
            :total-pages="pagination.last_page"
            @page-changed="handlePageChange"
          />
        </div>

      </div>
    </div>

    <ModalsOverlay @closeOverlay="deleteModalOpen = false" :open="deleteModalOpen">
      <template #title>Delete Product</template>
      <div class="flex flex-col items-center gap-4 py-2">
        <div class="rounded-full p-4 flex items-center justify-center mb-2 bg-red-600 ring-[.5rem] ring-red-200 w-24 h-24">
          <UiIconsDelete class="w-10 h-10 text-white" />
        </div>
        <UiTypographyP
          v-if="productToDelete"
          class="text-center"
          aria-live="assertive"
        >
          Are you sure you want to delete <span class="font-bold text-red-700">"{{ productToDelete.name }}"</span>? This action is irreversible!
        </UiTypographyP>
        <hr class="w-full border-accent-200" />
        <div class="grid grid-cols-2 gap-4 w-full justify-center">
          <UiButtonsTertiary
            @clicked="deleteModalOpen = false" class="w-full text-center"
          >
            Cancel
          </UiButtonsTertiary>
          <FormButton
            @click="deleteProduct"
            class="bg-red-600 hover:bg-red-700 text-white" :flexdisplay="true"
            :loading="isDeleting"
          >
            <UiIconsDelete class="w-5 h-5" />
            Delete
          </FormButton>
        </div>
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

import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSellerProducts } from '~/composables/useSellerProducts'
import { useAppToast } from '~/utils/toastify'

const router = useRouter()
const route = useRoute()
const toast = useAppToast()

// Use the composable for seller products
const {
  products,
  isLoading,
  error,
  fetchMyProducts,
  deleteProduct: composableDeleteProduct,
  pagination
} = useSellerProducts()

// State
const isDeleting = ref(false)
const deleteModalOpen = ref(false)
const productToDelete = ref(null)
const isInitialLoad = ref(true)

// Fetch products for the current page
const loadProducts = async (page = 1) => {
  isInitialLoad.value = true
  await fetchMyProducts({ page })
  isInitialLoad.value = false
}

// On mount, fetch products for the current page in the query
onMounted(async () => {
  const page = parseInt(route.query.page) || 1
  await loadProducts(page)
  watch(products, (val) => {
    console.log('Products:', val)
  }, { immediate: true })
})

// Watch for page changes in the URL
watch(
  () => route.query.page,
  async (newPage) => {
    await loadProducts(parseInt(newPage) || 1)
  }
)

// Handle pagination change
const handlePageChange = (newPage) => {
  router.push({
    query: { ...route.query, page: newPage }
  })
}

// Helper functions
const getImageUrl = (url) => {
  if (!url) return '' // or a placeholder image path
  if (url.startsWith('/')) {
    if (process.client) {
      return `${window.location.origin}${url}`
    }
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
  const productSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-')
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
  isDeleting.value = true
  const success = await composableDeleteProduct(productToDelete.value.id)
  isDeleting.value = false
  deleteModalOpen.value = false
  if (success) {
    toast.success('Product deleted')
    fetchMyProducts()
  } else {
    toast.error('Failed to delete product')
  }
  productToDelete.value = null
}
</script>
<style>
  .gig-img {
    width: 5rem !important;
    min-width: 5rem;
    background-color: #D3D3D3;
    aspect-ratio: 3/2;
  }
</style>