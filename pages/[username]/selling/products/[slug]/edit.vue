<template>
  <LayoutsDashboard mode="seller" pageTitle="Edit Product">
    <UiStepper
      :steps="stepperSteps"
      :currentStep="0"
      :isEnabled="isStepEnabled"
      @step-click="handleStepClick"
    />
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <!-- Loading State -->
      <div v-if="isInitialLoad" class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <UiSkeleton height="3rem" class="rounded-md col-span-2" />
        <UiSkeleton height="3rem" class="rounded-md col-span-2 lg:col-span-1" />
        <UiSkeleton height="3rem" class="rounded-md col-span-2 lg:col-span-1" />
        <UiSkeleton height="3rem" class="rounded-md col-span-2 lg:col-span-1" />
        <UiSkeleton height="3rem" class="rounded-md col-span-2 lg:col-span-1" />
        <UiSkeleton height="3rem" class="rounded-md col-span-2" />
        <UiSkeleton height="15rem" class="rounded-md col-span-2" />
      </div>
      <div v-else-if="!product" class="text-center py-12 flex flex-col items-center justify-center">
        <div class="rounded-full p-4 flex items-center justify-center mb-4 bg-red-200 w-20 h-20">
          <UiIconsError class="w-16 h-16 text-red-600" />
        </div>
        <UiTypographyP class="text-red-600 mb-2">Product not found.</UiTypographyP>
        <UiButtonsPrimary :url="{ name: 'username-selling-products', params: { username: route.params.username } }" class="mt-2">
          Go to My Products
        </UiButtonsPrimary>
      </div>
      <form v-else @submit.prevent="updateProduct()" class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <!-- Product Name -->
        <FormInput
          label="Product Name"
          placeholder="Enter the name of your product"
          class="col-span-2"
          :inputValue="formData.name"
          @update:inputValue="formData.name = $event"
          :error="!!errors.name"
        />

        <!-- Category & Location Row (needed for subcategory) -->
        <FormSelect
          label="Category"
          placeholder="Select the category of your product"
          :selectedOption="formData.category_id"
          @update:selectedOption="handleCategoryChange"
          :options="categoryOptions"
          :error="!!errors.category_id"
          class="col-span-2 lg:col-span-1"
        />

        <FormSelect
          label="Location"
          placeholder="Select the location of your product"
          :selectedOption="formData.location_id"
          @update:selectedOption="handleLocationChange"
          :options="locationOptions"
          :error="!!errors.location_id"
          class="col-span-2 lg:col-span-1"
        />

        <!-- Subcategory & Price Row -->
        <FormSelect
          label="Subcategory"
          placeholder="Select the subcategory of your product"
          :selectedOption="formData.subcategory_id"
          @update:selectedOption="formData.subcategory_id = $event"
          :options="subcategoryOptions"
          :disabled="!formData.category_id || !formData.location_id"
          :error="!!errors.subcategory_id"
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
          :error="!!errors.price"
          class="col-span-2 lg:col-span-1"
        />

        <!-- Stock Management -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 col-span-2">
          <FormCheckbox
            label="Manage Stock"
            v-model="formData.manage_stock"
            class="col-span-2 lg:col-span-1"
            size="large"
          />
          
          <FormInput
            v-if="formData.manage_stock"
            label="Stock Quantity"
            placeholder="Enter stock quantity"
            type="number"
            min="0"
            :inputValue="formData.stock_quantity"
            @update:inputValue="formData.stock_quantity = $event"
            :error="!!errors.stock_quantity"
            class="col-span-2 lg:col-span-1"
          />
        </div>

        <!-- Description -->
        <FormTextarea
          label="Description"
          placeholder="Write a detailed description for your product"
          class="col-span-2"
          :inputValue="formData.description"
          @update:inputValue="formData.description = $event"
          :error="!!errors.description"
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
  title: 'Edit Product | Kafinta',
  meta: [
    { name: 'description', content: 'Edit your product details' }
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
const isInitialLoad = ref(true)
const isLoading = ref(false)
const errors = ref({})

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

// Load existing product data
const loadProduct = async () => {
  try {
    isInitialLoad.value = true
    // Fetch product by slug directly
    const response = await productApi.getProductBySlug(productSlug.value)
    if (response.status === 'success' && response.data) {
      product.value = response.data

      // Populate form with existing data
      formData.name = product.value.name || ''
      formData.description = product.value.description || ''
      formData.price = product.value.price || ''
      formData.manage_stock = product.value.manage_stock || false
      formData.stock_quantity = product.value.stock_quantity || ''

      // Use the new structure for IDs
      formData.category_id = product.value.category?.id || null
      formData.location_id = product.value.location?.id || null
      formData.subcategory_id = product.value.subcategory?.id || null

      // After setting formData.category_id, formData.location_id, formData.subcategory_id
      const subcatInOptions = filtersStore.subcategories.some(
        subcat => subcat.id === formData.subcategory_id
      );

      if (
        formData.category_id &&
        formData.location_id &&
        !subcatInOptions
      ) {
        await filtersStore.fetchSubcategories(formData.category_id, formData.location_id);
      }
    } else {
      product.value = null
      isLoadingProduct.value = false
      isInitialLoad.value = false
      return
    }
  } catch (error) {
    console.error('Error loading product:', error)
    product.value = null
    isLoadingProduct.value = false
    isInitialLoad.value = false
  }
  isLoadingProduct.value = false
  isInitialLoad.value = false
}

// Form submission
const updateProduct = async () => {
  try {
    isLoading.value = true
    errors.value = {}

    // Basic client-side validation
    const validationErrors = {}

    if (!formData.name?.trim()) {
      validationErrors.name = ['Product name is required']
    }

    if (!formData.description?.trim()) {
      validationErrors.description = ['Product description is required']
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      validationErrors.price = ['Valid price is required']
    }

    if (!formData.subcategory_id) {
      validationErrors.subcategory_id = ['Subcategory is required']
    }

    if (!formData.location_id) {
      validationErrors.location_id = ['Location is required']
    }

    // Validate stock quantity if stock management is enabled
    if (formData.manage_stock && (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0)) {
      validationErrors.stock_quantity = ['Valid stock quantity is required when managing stock']
    }

    // If there are validation errors, show them and return
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors
      const firstError = Object.values(validationErrors)[0][0]
      toast.error(firstError)
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

    // Check if data has changed
    const original = product.value
    const unchanged =
      productData.name === (original.name || '') &&
      productData.description === (original.description || '') &&
      productData.price === Number(original.price || 0) &&
      productData.subcategory_id === (original.subcategory?.id || null) &&
      productData.location_id === (original.location?.id || null) &&
      productData.manage_stock === (original.manage_stock || false) &&
      productData.stock_quantity === (original.stock_quantity || 0)

    if (unchanged) {
      // No changes, just navigate to next page
      router.push({
        path: `/${route.params.username}/selling/products/${productSlug.value}/specifications`
      })
      return
    }

    // Update product
    const response = await productApi.updateBasicInfo(product.value.id, productData)

    if (response.status === 'success') {
      // Show success feedback
      toast.success('Product information updated! Moving to specifications...')

      // Small delay for better UX
      setTimeout(() => {
        router.push({
          path: `/${route.params.username}/selling/products/${productSlug.value}/specifications`
        })
      }, 500)
    } else {
      console.error('Unexpected response status:', response)
      toast.error('Unexpected response from server. Please try again.')
    }
  } catch (error) {
    console.error('Error updating product:', error)

    // Handle validation errors (field-specific) - updated for new API format
    if (error.data?.message && typeof error.data.message === 'object') {
      // Set field errors for display under form fields
      errors.value = error.data.message

      // Show first validation error in toast
      const firstError = Object.values(error.data.message)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        toast.error(firstError[0])
      } else {
        toast.error('Please check the form for errors.')
      }
    } else {
      // Handle general error messages (non-validation)
      let errorMessage = 'Failed to update product. Please try again.'

      if (error.data?.message && typeof error.data.message === 'string') {
        // Backend provided a specific error message
        errorMessage = error.data.message
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message
      }

      // Show error toast
      toast.error(errorMessage)
    }
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

  // Load existing product data
  await loadProduct()
  isLoadingProduct.value = false
  isInitialLoad.value = false
})

const stepperSteps = [
  { label: 'Details', route: () => `/${route.params.username}/selling/products/${productSlug.value}/edit` },
  { label: 'Specifications', route: () => `/${route.params.username}/selling/products/${productSlug.value}/specifications` },
  { label: 'Images', route: () => `/${route.params.username}/selling/products/${productSlug.value}/images` },
  { label: 'Publish', route: () => `/${route.params.username}/selling/products/${productSlug.value}/publish` }
]

function isStepComplete(idx) {
  if (!product.value) return false;
  switch (idx) {
    case 0:
      // Details: name, description, price, category, location, subcategory
      return !!(product.value.name && product.value.description && product.value.price && product.value.category?.id && product.value.location?.id && product.value.subcategory?.id);
    case 1:
      // Specifications: attributes (assume attributes or specifications field or similar)
      return Array.isArray(product.value.attributes) ? product.value.attributes.length > 0 : false;
    case 2:
      // Images: images array
      return Array.isArray(product.value.images) ? product.value.images.length > 0 : false;
    case 3:
      // Publish: allow if all previous steps are complete
      return isStepComplete(0) && isStepComplete(1) && isStepComplete(2);
    default:
      return false;
  }
}

function isStepEnabled(idx) {
  // If product is active, allow all steps
  if (product.value?.status === 'active') return true;
  // Allow navigation to a step only if all previous steps are complete
  for (let i = 0; i < idx; i++) {
    if (!isStepComplete(i)) return false;
  }
  return true;
}

function handleStepClick(idx) {
  if (isStepEnabled(idx)) {
    const routeFn = stepperSteps[idx].route
    if (routeFn) router.push(routeFn())
  }
}
</script>
