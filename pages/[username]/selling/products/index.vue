<template>
  <LayoutsDashboard mode="seller" pageTitle="My Products">
    <div class="w-full">
      <!-- Filter Button Row -->
      <div class="flex justify-end items-center gap-3 mb-4">
        <UiButtonsTertiary @click="showFilterSidebar = true" class="flex gap-2 items-center">
          <UiIconsFilter class="w-5 h-5" />
          Filters
        </UiButtonsTertiary>
        <UiButtonsPrimary :url="{ path: 'products/new' }">List a New Product</UiButtonsPrimary>
      </div>
      <!-- Filter Sidebar Drawer -->
      <FilterSellerSidebar
        :open="showFilterSidebar"
        :categoryOptions="categoryOptions"
        :locationOptions="locationOptions"
        :subcategoryOptions="subcategoryOptions"
        :statusOptions="statusOptions"
        :stockStatusOptions="stockStatusOptions"
        :sortDirectionOptions="sortDirectionOptions"
        :initialFilters="{
          keyword: keyword,
          category: selectedCategory,
          location: selectedLocation,
          subcategory: selectedSubcategory,
          status: selectedStatus,
          stockStatus: selectedStockStatus,
          sortDirection: selectedSortDirection
        }"
        @filter-changed="onSidebarFilterChange"
        @close="showFilterSidebar = false"
      />
      <!-- Products List and rest of the page -->
      <div class="w-full mt-4">
        <!-- Loading State -->
        <ul v-if="isLoading || isInitialLoad" class="grid lg:grid-cols-2 gap-6 place-items-center mt-6">
          <li v-for="n in 10" :key="n" class="w-full">
            <UiSkeleton height="10rem" class="rounded-lg w-full" />
          </li>
        </ul>

        <!-- Products List -->
        <div v-if="!isLoading && !isInitialLoad">
          <ul v-if="products.length > 0" class="grid lg:grid-cols-2 gap-6 mt-6">
            <li
              v-for="product in products"
              :key="product.id"
              class="flex flex-row lg:flex-row gap-4 border items-center border-accent-200 rounded-lg w-full p-2 h-full bg-white"
              style="max-width:100%;"
            >
              <!-- Product Image -->
              <div class="w-1/4 lg:w-1/3 h-full bg-accent-200 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="getImageUrl(product.images[0].path)"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                  style="display:block;"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-accent-400">
                  <UiIconsCamera class="w-8 h-8" />
                </div>
              </div>

              <!-- Product Details -->
              <div class="w-full flex flex-col justify-between h-full gap-4">
                <div>
                  <UiTypographyH3 class="text-lg">{{ product.name }}</UiTypographyH3>
                  <p class="text-sm text-accent-500 mt-1">₦{{ formatPrice(product.price) }}</p>
                  <div class="flex items-center gap-2 mt-2 flex-wrap">
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
                <div class="flex flex-wrap gap-4">
                  <UiDropdownMenu :items="getProductActions(product)">
                    <template #trigger="{ open, toggleMenu }">
                      <button
                        @click="toggleMenu"
                        :class="[
                          'flex items-center gap-2 px-3 py-2 rounded-md border border-accent-200 bg-white shadow-sm focus:outline-none',
                          open ? 'bg-accent-100' : 'hover:bg-accent-50'
                        ]"
                        aria-haspopup="true"
                        :aria-expanded="open"
                        type="button"
                      >
                        Actions
                        <UiIconsChevron class="text-secondary rotate-180 w-4 h-4 ml-1" />
                      </button>
                    </template>
                  </UiDropdownMenu>
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
          
          <!-- Pagination - only show if more than one page -->
          <UiPagination
            v-if="pagination && pagination.last_page > 1"
            :current-page="pagination.current_page "
            :total-pages="pagination.last_page"
            @page-changed="handlePageChange"
            class="mt-6"
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
    <!-- Add Pause Confirmation Modal -->
    <ModalsOverlay @closeOverlay="pauseModalOpen = false" :open="pauseModalOpen">
      <template #title>Pause Product</template>
      <div class="flex flex-col items-center gap-4 py-2">
        <div class="rounded-full p-4 flex items-center justify-center mb-2 bg-yellow-400 ring-[.5rem] ring-yellow-100 w-24 h-24">
          <UiIconsPause class="w-10 h-10 text-white" />
        </div>
        <UiTypographyP class="text-center" aria-live="assertive">
          Are you sure you want to pause <span class="font-bold text-yellow-700">"{{ productToPause?.name }}"</span>? It will no longer be visible to buyers until resumed.
        </UiTypographyP>
        <hr class="w-full border-accent-200" />
        <div class="grid grid-cols-2 gap-4 w-full justify-center">
          <UiButtonsTertiary @clicked="pauseModalOpen = false" class="w-full text-center">Cancel</UiButtonsTertiary>
          <FormButton @click="confirmPause" class="bg-yellow-500 hover:bg-yellow-600 text-white" :loading="pausingProductId === productToPause?.id">
            <UiIconsPause class="w-5 h-5" /> Pause
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

import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSellerProducts } from '~/composables/useSellerProducts'
import { useAppToast } from '~/utils/toastify'
import FormSelect from '~/components/Form/Select.vue'
import FormInput from '~/components/Form/Input.vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import FilterSellerSidebar from '~/components/Filter/SellerSidebar.vue'
import UiIconsFilter from '~/components/Ui/Icons/Filter.vue'
import UiButtonsSecondary from '~/components/Ui/Buttons/Secondary.vue'
import ModalsOverlay from '~/components/Modals/Overlay.vue'
import UiIconsPause from '~/components/Ui/Icons/Pause.vue'
import UiDropdownMenu from '~/components/Ui/DropdownMenu.vue'
import UiIconsEye from '~/components/Ui/Icons/Eye.vue'
import UiIconsEdit from '~/components/Ui/Icons/Edit.vue'
import UiIconsDelete from '~/components/Ui/Icons/Delete.vue'
import UiIconsChevronDown from '~/components/Ui/Icons/Chevron.vue'

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

const filtersStore = useFiltersStore()
const { categories, locations, subcategories, isLoading: isFiltersLoading } = storeToRefs(filtersStore)

// State
const isDeleting = ref(false)
const deleteModalOpen = ref(false)
const productToDelete = ref(null)
const isInitialLoad = ref(true)
const showFilterSidebar = ref(false)
const pausingProductId = ref(null)
const pauseModalOpen = ref(false)
const productToPause = ref(null)

// Status filter options
const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Paused', value: 'paused' },
  { label: 'Denied', value: 'denied' },
  { label: 'Out of Stock', value: 'out_of_stock' },
]
const selectedStatus = ref('')

const keyword = ref('')
const stockStatusOptions = [
  { label: 'All', value: '' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
]
const selectedStockStatus = ref('')
const sortDirectionOptions = [
  { label: 'Descending', value: 'desc' },
  { label: 'Ascending', value: 'asc' },
]
const selectedSortDirection = ref('desc')

const categoryOptions = computed(() => [
  { label: 'All', value: '' },
  ...categories.value.map(cat => ({ label: cat.name, value: cat.id }))
])
const locationOptions = computed(() => [
  { label: 'All', value: '' },
  ...locations.value.map(loc => ({ label: loc.name, value: loc.id }))
])
const subcategoryOptions = computed(() => [
  { label: 'All', value: '' },
  ...subcategories.value.map(sub => ({ label: sub.name, value: sub.id }))
])

const selectedCategory = ref('')
const selectedLocation = ref('')
const selectedSubcategory = ref('')

const onCategoryChange = async () => {
  selectedSubcategory.value = ''
  if (selectedCategory.value && selectedLocation.value) {
    await filtersStore.fetchSubcategories(selectedCategory.value, selectedLocation.value)
  }
  await onFilterChange()
}
const onLocationChange = async () => {
  selectedSubcategory.value = ''
  if (selectedCategory.value && selectedLocation.value) {
    await filtersStore.fetchSubcategories(selectedCategory.value, selectedLocation.value)
  }
  await onFilterChange()
}

const onFilterChange = async () => {
  await loadProducts(1)
  // Build query params, only including non-empty values
  const query = { ...route.query, page: 1, sort_direction: selectedSortDirection.value }
  if (selectedStatus.value) query.status = selectedStatus.value
  if (selectedStockStatus.value) query.stock_status = selectedStockStatus.value
  if (keyword.value) query.keyword = keyword.value
  if (selectedCategory.value) query.category_id = selectedCategory.value
  if (selectedLocation.value) query.location_id = selectedLocation.value
  if (selectedSubcategory.value) query.subcategory_id = selectedSubcategory.value
  router.push({ query })
}

const loadProducts = async (page = 1) => {
  isInitialLoad.value = true
  // Build params, only including non-empty values
  const params = { page, sort_direction: selectedSortDirection.value }
  if (selectedStatus.value) params.status = selectedStatus.value
  if (selectedStockStatus.value) params.stock_status = selectedStockStatus.value
  if (keyword.value) params.keyword = keyword.value
  if (selectedCategory.value) params.category_id = selectedCategory.value
  if (selectedLocation.value) params.location_id = selectedLocation.value
  if (selectedSubcategory.value) params.subcategory_id = selectedSubcategory.value
  await fetchMyProducts(params)
  isInitialLoad.value = false
}

// Watch for filter changes
watch([
  selectedStatus, selectedStockStatus, selectedSortDirection, keyword,
  selectedCategory, selectedLocation, selectedSubcategory
], async () => {
  await onFilterChange()
})

// On mount, initialize filters from query
onMounted(async () => {
  await filtersStore.fetchCategories()
  await filtersStore.fetchLocations()
  const page = parseInt(route.query.page) || 1
  if (route.query.status) selectedStatus.value = route.query.status
  if (route.query.stock_status) selectedStockStatus.value = route.query.stock_status
  if (route.query.sort_direction) selectedSortDirection.value = route.query.sort_direction
  if (route.query.keyword) keyword.value = route.query.keyword
  if (route.query.category_id) selectedCategory.value = route.query.category_id
  if (route.query.location_id) selectedLocation.value = route.query.location_id
  if (selectedCategory.value && selectedLocation.value) {
    await filtersStore.fetchSubcategories(selectedCategory.value, selectedLocation.value)
    if (route.query.subcategory_id) selectedSubcategory.value = route.query.subcategory_id
  }
  await loadProducts(page)
  watch(products, (val) => {
    console.log('Products:', val)
  }, { immediate: true })
})

// Watch for page or filter changes in the URL
watch(
  () => [route.query.page, route.query.status, route.query.stock_status, route.query.sort_direction, route.query.keyword, route.query.category_id, route.query.location_id, route.query.subcategory_id],
  async ([newPage, newStatus, newStock, newSortDir, newKeyword, newCat, newLoc, newSubcat]) => {
    if (newStatus !== undefined) selectedStatus.value = newStatus
    if (newStock !== undefined) selectedStockStatus.value = newStock
    if (newSortDir !== undefined) selectedSortDirection.value = newSortDir
    if (newKeyword !== undefined) keyword.value = newKeyword
    if (newCat !== undefined) selectedCategory.value = newCat
    if (newLoc !== undefined) selectedLocation.value = newLoc
    if (selectedCategory.value && selectedLocation.value) {
      await filtersStore.fetchSubcategories(selectedCategory.value, selectedLocation.value)
      if (newSubcat !== undefined) selectedSubcategory.value = newSubcat
    } else {
      selectedSubcategory.value = ''
    }
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

const onSidebarFilterChange = async (newFilters) => {
  selectedStatus.value = newFilters.status
  selectedStockStatus.value = newFilters.stockStatus
  selectedSortDirection.value = newFilters.sortDirection
  keyword.value = newFilters.keyword
  selectedCategory.value = newFilters.category
  selectedLocation.value = newFilters.location
  selectedSubcategory.value = newFilters.subcategory
  // If newFilters is empty, clear all filter params from the route
  if (Object.keys(newFilters).length === 0) {
    await loadProducts(1)
    router.push({ query: { page: 1, sort_direction: selectedSortDirection.value } })
  } else {
    await onFilterChange()
  }
}

function handlePauseResume(product) {
  if (product.status === 'active') {
    productToPause.value = product
    pauseModalOpen.value = true
  } else {
    // Resume directly
    updateProductStatus(product, 'active')
  }
}

async function confirmPause() {
  if (productToPause.value) {
    await updateProductStatus(productToPause.value, 'paused')
    pauseModalOpen.value = false
    productToPause.value = null
  }
}

async function updateProductStatus(product, newStatus) {
  if (!product) return
  pausingProductId.value = product.id
  try {
    const response = await useProductApi().updateProductStatus(product.id, newStatus)
    if (response && response.status === 'success') {
      product.status = newStatus
      // Optionally show a toast
      // toast.success(`Product ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully!`)
    }
  } catch (e) {
    // Optionally show a toast
    // toast.error('Failed to update product status.')
  } finally {
    pausingProductId.value = null
  }
}

function getProductActions(product) {
  return [
    {
      label: 'Preview',
      icon: UiIconsEye,
      action: () => window.open(`/marketplace/products/${product.slug}`, '_blank'),
    },
    {
      label: 'Edit',
      icon: UiIconsEdit,
      action: () => editProduct(product),
    },
    {
      label: product.status === 'active' ? 'Pause' : 'Resume',
      icon: UiIconsPause,
      action: () => handlePauseResume(product),
      disabled: pausingProductId.value === product.id,
    },
    {
      label: 'Delete',
      icon: UiIconsDelete,
      action: () => confirmDelete(product),
      danger: true,
    },
  ]
}
</script>
<style>
  .gig-img {
    width: 5rem !important;
    min-width: 5rem;
    background-color: #D3D3D3;
    aspect-ratio: 3/2;
  }
  @media (max-width: 768px) {
    .product-card-mobile {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    .product-card-mobile .w-1\/3,
    .product-card-mobile .w-2\/3 {
      width: 100% !important;
    }
    .product-card-mobile .aspect-\[5\/3\] {
      aspect-ratio: 5/3 !important;
    }
  }
</style>