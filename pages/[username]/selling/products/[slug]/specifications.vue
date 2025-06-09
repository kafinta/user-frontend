<template>
  <LayoutsDashboard mode="seller" pageTitle="Edit Product Specifications">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <!-- Progress Steps -->
      <div class="flex items-center">
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-primary w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class=" h-10 w-10 rounded-full grid place-items-center text-secondary border border-accent-200">3</div>
      </div>
      <UiTypographyH3>Edit Product Specifications</UiTypographyH3>

      <!-- Loading State -->
      <div v-if="isLoadingProduct" class="flex justify-center py-8">
        <UiLoadingSpinner />
      </div>

      <!-- No Attributes Message -->
      <div v-else-if="availableAttributes.length === 0" class="text-center py-8">
        <UiTypographyP class="text-secondary mb-4">
          No specifications available for this product category.
        </UiTypographyP>
        <FormButton @click="skipToNextStep" class="w-64">
          Continue to Images
        </FormButton>
      </div>

      <!-- Specifications Form -->
      <form v-else @submit.prevent="updateProduct()" class="flex flex-col gap-6 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            v-for="attribute in availableAttributes" 
            :key="attribute.id"
            class="flex flex-col gap-2"
          >
            <UiTypographyP class="font-medium">{{ attribute.name }}</UiTypographyP>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="value in attribute.values"
                :key="value.id"
                type="button"
                @click="selectedAttributes[attribute.id] = value.id"
                :class="[
                  'flex gap-2 p-2 rounded-md border items-center transition-colors',
                  selectedAttributes[attribute.id] === value.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-accent-200 hover:border-accent-300'
                ]"
              >
                <div
                  v-if="value.representation && value.representation.startsWith('#')"
                  class="h-5 w-5 rounded-full border border-accent-200"
                  :style="{ backgroundColor: value.representation }"
                ></div>
                <span class="text-sm">{{ value.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <FormButton
          class="w-64 mx-auto mt-6"
          :loading="isLoading"
          :disabled="isLoading"
        >
          Save & Continue
        </FormButton>
      </form>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFiltersStore } from '~/stores/filters'
import { useProductApi } from '~/composables/useProductApi'
import { useAppToast } from '~/utils/toastify'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true,
  requiresSeller: true
});

useHead({
  title: 'Edit Product Specifications | Kafinta',
  meta: [
    { name: 'description', content: 'Edit specifications for your product' }
  ]
});

const router = useRouter()
const route = useRoute()
const filtersStore = useFiltersStore()
const productApi = useProductApi()
const toast = useAppToast()

// Get product slug from route params
const productSlug = computed(() => route.params.slug)

// State
const product = ref(null)
const isLoadingProduct = ref(true)
const isLoading = ref(false)
const errors = ref({})
const selectedAttributes = reactive({})

// Computed properties
const availableAttributes = computed(() => {
  if (!product.value?.subcategory?.attributes) return []
  return product.value.subcategory.attributes
})

// Helper functions
const skipToNextStep = () => {
  router.push({
    path: `/${route.params.username}/selling/products/${productSlug.value}/images`
  })
}

// Load existing product data
const loadProduct = async () => {
  try {
    // First try to find product by slug in the seller's products
    const myProductsResponse = await productApi.getMyProducts()
    
    if (myProductsResponse.status === 'success' && myProductsResponse.data?.data) {
      const foundProduct = myProductsResponse.data.data.find(p => 
        p.slug === productSlug.value
      )

      if (!foundProduct) {
        toast.error('Product not found')
        router.push({ name: 'username-selling-products' })
        return
      }

      // Get full product details
      const response = await productApi.getProduct(foundProduct.id)

      if (response.status === 'success' && response.data?.product) {
        product.value = response.data.product

        // Load subcategory details with attributes if not already loaded
        if (product.value.subcategory_id && !product.value.subcategory?.attributes) {
          await filtersStore.fetchSubcategoryDetails(product.value.subcategory_id)
          // Update product with subcategory details
          product.value.subcategory = filtersStore.selectedSubcategory
        }

        // Pre-populate existing attributes
        if (product.value.attributes) {
          product.value.attributes.forEach(attr => {
            selectedAttributes[attr.id] = attr.value.id
          })
        }
      }
    }
  } catch (error) {
    console.error('Error loading product:', error)
    toast.error('Failed to load product data')
    router.push({ name: 'username-selling-products' })
  }
}

// Form submission
const updateProduct = async () => {
  try {
    isLoading.value = true
    errors.value = {}

    // Prepare attributes data for API
    const attributes = Object.entries(selectedAttributes).map(([attributeId, valueId]) => ({
      attribute_id: parseInt(attributeId),
      value_id: valueId
    }))

    if (attributes.length === 0) {
      // Skip to next step if no attributes selected
      skipToNextStep()
      return
    }

    const response = await productApi.setAttributes(product.value.id, attributes)

    if (response.status === 'success') {
      // Show success feedback
      toast.success('Product specifications updated! Moving to images...')

      // Navigate to next step with small delay
      setTimeout(() => {
        router.push({
          path: `/${route.params.username}/selling/products/${productSlug.value}/images`
        })
      }, 500)
    }
  } catch (error) {
    console.error('Error updating product attributes:', error)

    // Handle validation errors - updated for new API format
    if (error.data?.message && typeof error.data.message === 'object') {
      errors.value = error.data.message
    } else if (error.data?.message && typeof error.data.message === 'string') {
      toast.error(error.data.message)
    } else {
      toast.error('Failed to update product specifications. Please try again.')
    }
  } finally {
    isLoading.value = false
  }
}

// Initialize data on mount
onMounted(async () => {
  await loadProduct()
  isLoadingProduct.value = false
})
</script>
