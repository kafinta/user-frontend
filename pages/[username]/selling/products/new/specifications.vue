<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <!-- Progress Steps -->
      <div class="flex items-center">
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Product Specifications</UiTypographyH3>

      <!-- Loading State -->
      <div v-if="isLoadingProduct" class="flex justify-center items-center py-12">
        <UiIconsLoading class="w-8 h-8" />
        <span class="ml-2 text-secondary">Loading product details...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="!product" class="text-center py-12">
        <UiTypographyP class="text-red-600">Product not found. Please start from step 1.</UiTypographyP>
        <UiButtonsPrimary :url="{ name: 'username-selling-products-new' }" class="mt-4">
          Go to Step 1
        </UiButtonsPrimary>
      </div>

      <!-- Attributes Form -->
      <div v-else-if="availableAttributes.length === 0" class="text-center py-12">
        <UiTypographyP class="text-secondary">No attributes available for this subcategory.</UiTypographyP>
        <UiButtonsPrimary @clicked="skipToNextStep" class="mt-4">
          Skip to Images
        </UiButtonsPrimary>
      </div>

      <!-- Main Form -->
      <form v-else @submit.prevent="updateProduct()" class="flex flex-col gap-6 w-full">
        <!-- Dynamic Attributes -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div
            v-for="attribute in availableAttributes"
            :key="attribute.id"
            :class="attribute.values.length > 6 ? 'col-span-2' : 'col-span-1'"
          >
            <!-- Regular Select for attributes with few values -->
            <FormSelect
              v-if="attribute.values.length <= 6"
              :label="attribute.name"
              :placeholder="`Select ${attribute.name.toLowerCase()}`"
              :selectedOption="selectedAttributes[attribute.id]"
              @update:selectedOption="selectedAttributes[attribute.id] = $event"
              :options="getAttributeOptions(attribute)"
              :error="!!errors[`attribute_${attribute.id}`]"
            />

            <!-- Color picker style for color attributes or many options -->
            <div v-else class="space-y-3">
              <label class="block text-sm font-medium text-secondary">
                {{ attribute.name }}
                <span v-if="errors[`attribute_${attribute.id}`]" class="text-red-500 ml-1">*</span>
              </label>
              <div class="flex gap-3 flex-wrap p-4 border border-accent-200 rounded-md">
                <button
                  v-for="value in attribute.values"
                  :key="value.id"
                  type="button"
                  @click="selectedAttributes[attribute.id] = value.id"
                  :class="[
                    'flex gap-2 p-2 rounded-md border transition-all duration-200 items-center',
                    selectedAttributes[attribute.id] === value.id
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-accent-200 hover:border-accent-300'
                  ]"
                >
                  <!-- Color representation if available -->
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
        </div>

        <!-- Submit Button -->
        <FormButton
          class="w-64 mx-auto mt-6"
          :loading="isLoading"
          :disabled="isLoading || !hasRequiredAttributes"
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
  title: 'Product Specifications | Kafinta',
  meta: [
    { name: 'description', content: 'Add specifications for your product' }
  ]
});

const router = useRouter()
const route = useRoute()
const filtersStore = useFiltersStore()
const productApi = useProductApi()
const toast = useAppToast()

// Get product ID from query params
const productId = computed(() => {
  const id = route.query.productId
  return id ? parseInt(id) : null
})

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

const hasRequiredAttributes = computed(() => {
  // For now, we'll make all attributes optional
  // You can modify this logic based on your requirements
  return availableAttributes.value.length === 0 ||
         Object.keys(selectedAttributes).length > 0
})

// Helper functions
const getAttributeOptions = (attribute) => {
  return attribute.values.map(value => ({
    value: value.id,
    label: value.name
  }))
}

const skipToNextStep = () => {
  router.push({
    name: 'username-selling-products-new-images',
    query: { productId: productId.value }
  })
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

    const response = await productApi.setAttributes(productId.value, attributes)

    if (response.status === 'success') {
      // Show success feedback
      toast.success('Product specifications saved! Moving to images...')

      // Navigate to next step with small delay
      setTimeout(() => {
        router.push({
          name: 'username-selling-products-new-images',
          query: { productId: productId.value }
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

// Load product data on mount
onMounted(async () => {
  if (!productId.value) {
    // Redirect to step 1 if no product ID
    router.push({ name: 'username-selling-products-new' })
    return
  }

  try {
    const response = await productApi.getProduct(productId.value)

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
    } else {
      // Product not found, redirect to step 1
      router.push({ name: 'username-selling-products-new' })
    }
  } catch (error) {
    console.error('Error loading product:', error)
    // Redirect to step 1 on error
    router.push({ name: 'username-selling-products-new' })
  } finally {
    isLoadingProduct.value = false
  }
})
</script>