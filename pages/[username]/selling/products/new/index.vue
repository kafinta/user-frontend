<template>
  <LayoutsDashboard mode="seller" pageTitle="New Product">
    <UiStepper
      :steps="stepperSteps"
      :currentStep="0"
      :isEnabled="isStepEnabled"
      @step-click="handleStepClick"
    />
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <UiTypographyH3>Product Details</UiTypographyH3>

      <!-- Product Creation Form -->
      <form @submit.prevent="createProduct()" class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <!-- Product Name -->
        <FormInput
          label="Product Name"
          placeholder="Enter the name of your product"
          class="col-span-2"
          :inputValue="formData.name"
          @update:inputValue="formData.name = $event"
          :error="typeof errors.name === 'string' ? errors.name : !!errors.name"
        />

        <!-- Category & Location Row (needed for subcategory) -->
        <FormSelect
          label="Category"
          placeholder="Select the category of your product"
          :selectedOption="formData.category_id"
          @update:selectedOption="handleCategoryChange"
          :options="categoryOptions"
          :error="typeof errors.category_id === 'string' ? errors.category_id : !!errors.category_id"
          class="col-span-2 lg:col-span-1"
        />

        <FormSelect
          label="Location"
          placeholder="Select the location of your product"
          :selectedOption="formData.location_id"
          @update:selectedOption="handleLocationChange"
          :options="locationOptions"
          :error="typeof errors.location_id === 'string' ? errors.location_id : !!errors.location_id"
          class="col-span-2 lg:col-span-1"
        />

        <!-- Helpful tip when subcategory is disabled (full width) -->
        <div
          v-if="!formData.category_id || !formData.location_id"
          class="col-span-2 flex items-start gap-2 text-sm text-accent-600 bg-accent-50 p-3 rounded-md border border-accent-200"
        >
          <svg class="w-4 h-4 mt-0.5 text-accent-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span>Please select both category and location above to enable subcategory options.</span>
        </div>

        <!-- Subcategory & Price Row -->
        <FormSelect
          label="Subcategory"
          placeholder="Select the subcategory of your product"
          :selectedOption="formData.subcategory_id"
          @update:selectedOption="formData.subcategory_id = $event"
          :options="subcategoryOptions"
          :disabled="!formData.category_id || !formData.location_id"
          :error="typeof errors.subcategory_id === 'string' ? errors.subcategory_id : !!errors.subcategory_id"
          class="col-span-2 lg:col-span-1"
        />

        <FormInput
          label="Price (₦)"
          placeholder="Enter product price"
          type="number"
          step="0.01"
          min="0"
          :inputValue="formData.price"
          @update:inputValue="formData.price = $event"
          :error="typeof errors.price === 'string' ? errors.price : !!errors.price"
          class="col-span-2 lg:col-span-1"
        />

        <!-- Stock Management (full width) -->
        <div class="col-span-2">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
            <FormCheckbox
              v-model="formData.manage_stock"
              label="Track inventory for this product"
              size="large"
              class="col-span-2 lg:col-span-1"
              :error="typeof errors.manage_stock === 'string' ? errors.manage_stock : !!errors.manage_stock"
            />

            <FormInput
              v-if="formData.manage_stock"
              label="Stock Quantity"
              placeholder="Enter stock quantity"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              :inputValue="formData.stock_quantity || ''"
              @update:inputValue="formData.stock_quantity = $event"
              :error="typeof errors.stock_quantity === 'string' ? errors.stock_quantity : !!errors.stock_quantity"
              class="col-span-2 lg:col-span-1"
            />
            <div v-else></div>
          </div>
        </div>

        <!-- Description -->
        <FormTextarea
          label="Description"
          placeholder="Write a detailed description for your product"
          class="col-span-2"
          :inputValue="formData.description"
          @update:inputValue="formData.description = $event"
          :error="typeof errors.description === 'string' ? errors.description : !!errors.description"
          :rows="10"
        />

        <!-- Submit Button -->
        <FormButton
          class="col-span-2"
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
import UiStepper from '~/components/Ui/Stepper.vue'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true,
  requiresSeller: true
});

useHead({
  title: 'Add Product | Kafinta',
  meta: [
    { name: 'description', content: 'Add a new product to your Kafinta store' }
  ]
});

const router = useRouter()
const route = useRoute()
const filtersStore = useFiltersStore()
const productApi = useProductApi()
const toast = useAppToast()

// Form data
const formData = reactive({
  name: '',
  description: '',
  price: '',
  category_id: null,
  location_id: null,
  subcategory_id: null,
  manage_stock: false,
  stock_quantity: ''
})

// Form state
const isLoading = ref(false)
const errors = ref({})

// Computed options for selects
const categoryOptions = computed(() => {
  return filtersStore.categories.map(category => ({
    value: category.id,
    label: category.name
  }))
})

const locationOptions = computed(() => {
  return filtersStore.locations.map(location => ({
    value: location.id,
    label: location.name
  }))
})

const subcategoryOptions = computed(() => {
  return filtersStore.subcategories.map(subcategory => ({
    value: subcategory.id,
    label: subcategory.name
  }))
})

// Event handlers
const handleCategoryChange = (categoryId) => {
  formData.category_id = categoryId
  formData.subcategory_id = null // Reset subcategory when category changes

  // Fetch subcategories if both category and location are selected
  if (categoryId && formData.location_id) {
    filtersStore.fetchSubcategories(categoryId, formData.location_id)
  }
}

const handleLocationChange = (locationId) => {
  formData.location_id = locationId
  formData.subcategory_id = null // Reset subcategory when location changes

  // Fetch subcategories if both category and location are selected
  if (formData.category_id && locationId) {
    filtersStore.fetchSubcategories(formData.category_id, locationId)
  }
}

// Form submission
const createProduct = async () => {
  try {
    isLoading.value = true
    errors.value = {}
    // Basic client-side validation
    const validationErrors = {}
    if (!formData.name?.trim()) validationErrors.name = 'Product name is required.'
    if (!formData.description?.trim()) validationErrors.description = 'Description is required.'
    if (!formData.price || parseFloat(formData.price) <= 0) validationErrors.price = 'Price must be greater than 0.'
    if (!formData.subcategory_id) validationErrors.subcategory_id = 'Please select a subcategory.'
    if (!formData.location_id) validationErrors.location_id = 'Please select a location.'
    if (formData.manage_stock && (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0)) validationErrors.stock_quantity = 'Stock quantity must be greater than 0.'
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors
      toast.error('Please fill all required fields correctly.')
      return
    }
    // Prepare data for API
    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      subcategory_id: formData.subcategory_id,
      location_id: formData.location_id,
      manage_stock: formData.manage_stock,
      stock_quantity: formData.manage_stock ? parseInt(formData.stock_quantity || '0') : 0
    }
    // Create new product
    const response = await productApi.createBasicInfo(productData)
    if (response.status === 'success') {
      errors.value = {}
      // Extract product ID and slug from response
      let productId = response.data?.product?.id || response.data?.id
      let productSlug = response.data?.product?.slug || response.data?.slug
      // If slug is missing, fetch product by ID
      if (!productSlug && productId) {
        const fetchResp = await productApi.getProductById(productId)
        productSlug = fetchResp?.data?.slug || productId
      }
      if (productSlug) {
        // Show success feedback
        toast.success('Product information saved! Moving to specifications...')

        // Small delay for better UX
        setTimeout(() => {
          router.push({
            path: `/${route.params.username}/selling/products/${productSlug}/specifications`
          })
        }, 500)
      } else {
        console.error('No product slug in response:', response)
        toast.error('Product saved but unable to proceed to next step. Please try again.')
      }
    } else {
      toast.error('Unexpected response from server. Please try again.')
    }
  } catch (error) {
    toast.error('Failed to create product. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Initialize data on mount
onMounted(async () => {
  // Load categories and locations if not already loaded
  if (filtersStore.categories.length === 0) {
    await filtersStore.fetchCategories()
  }

  if (filtersStore.locations.length === 0) {
    await filtersStore.fetchLocations()
  }
})

const stepperSteps = [
  { label: 'Details', route: null },
  { label: 'Specifications', route: null },
  { label: 'Images', route: null },
  { label: 'Publish', route: null }
]

function isStepEnabled(idx) {
  // Only allow step 0 (Details) on this page
  return idx === 0
}

function handleStepClick(idx) {
  // No navigation from stepper on the new page
}
</script>