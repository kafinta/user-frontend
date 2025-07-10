<template>
  <LayoutsDashboard mode="seller" pageTitle="Product Specifications">
    <UiStepper
      :steps="stepperSteps"
      :currentStep="1"
      :isEnabled="isStepEnabled"
      @step-click="handleStepClick"
    />
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <UiTypographyH3>Product Specifications</UiTypographyH3>
      <div v-if="isInitialLoad" class="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 w-full">
        <UiSkeleton height="3rem" v-for="i in 10" :key="i" class="rounded-md" />
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
      <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-6 w-full">
        <!-- Render attribute fields in 2 columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div v-for="attr in attributes" :key="attr.id" class="mb-4">
            <FormSelect
              v-if="Array.isArray(attr.values) && attr.values.length"
              :label="attr.name"
              :options="attr.values.map(v => ({ value: Number(v.id), label: v.name }))"
              :selectedOption="attributeValues[attr.id]"
              @update:selectedOption="val => attributeValues[attr.id] = val"
              :id="'attr-' + attr.id"
              :error="typeof errors[attr.id] === 'string' ? errors[attr.id] : !!errors[attr.id]"
            />
            <FormInput
              v-else
              :label="attr.name"
              :placeholder="'Enter ' + attr.name"
              v-model:inputValue="attributeValues[attr.id]"
              :id="'attr-' + attr.id"
              :error="typeof errors[attr.id] === 'string' ? errors[attr.id] : !!errors[attr.id]"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 pt-6 w-full">
          <UiButtonsTertiary @click="goBack" type="button" class="flex items-center gap-2 px-4 py-2 w-full justify-center">
            <UiIconsArrow class="w-4 h-4 -ml-1" />
            Go Back
          </UiButtonsTertiary>
          <FormButton :loading="isLoading" class="px-8 w-1/2 justify-center">Save & Continue</FormButton>
        </div>
      </form>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { useAppToast } from '~/utils/toastify'
import { useCustomFetch } from '@/composables/useCustomFetch'
import UiIconsArrow from '~/components/Ui/Icons/Arrow.vue'
import FormButton from '~/components/Form/Button.vue'
import UiStepper from '~/components/Ui/Stepper.vue'
import UiButtonsTertiary from '~/components/Ui/Buttons/Tertiary.vue'

const route = useRoute()
const router = useRouter()
const productApi = useProductApi()
const toast = useAppToast()

const productSlug = route.params.slug
const product = ref(null)
const attributes = ref([])
const attributeValues = ref({})
const originalAttributeValues = ref({})
const error = ref('')
const isLoading = ref(false)
const isInitialLoad = ref(true)
const errors = ref({})

const stepperSteps = [
  { label: 'Details', route: () => `/${route.params.username}/selling/products/${productSlug}/edit` },
  { label: 'Specifications', route: () => `/${route.params.username}/selling/products/${productSlug}/specifications` },
  { label: 'Images', route: () => `/${route.params.username}/selling/products/${productSlug}/images` },
  { label: 'Publish', route: () => `/${route.params.username}/selling/products/${productSlug}/publish` }
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

// Fetch product attributes to preload selected values
const fetchProductAttributes = async (productId) => {
  try {
    const response = await useCustomFetch(`/api/products/${productId}/attributes`)
    console.log('RAW product attributes API response:', response)
    return response?.data || []
  } catch (error) {
    console.error('Failed to fetch product attributes:', error)
    return []
  }
}

const fetchAttributes = async () => {
  try {
    isInitialLoad.value = true
    isLoading.value = true
    // Fetch the product by slug (new structure: product in response.data)
    const response = await productApi.getProductBySlug(productSlug)
    product.value = response?.data || null
    if (!product.value) {
      error.value = 'Product not found.'
      attributes.value = []
      isLoading.value = false
      isInitialLoad.value = false
      return
    }
    
    // Always fetch subcategory attributes using the dedicated endpoint
    let subcatAttributes = []
    if (product.value && product.value.subcategory?.id) {
      const subcatResponse = await useCustomFetch(`/api/subcategories/${product.value.subcategory.id}`)
      const subcat = subcatResponse?.data // <-- use .data directly
      subcatAttributes = subcat?.attributes || []
    }
    attributes.value = subcatAttributes
    
    // Pre-fill values from product attributes if they exist
    attributeValues.value = {}
    originalAttributeValues.value = {}
    if (product.value && product.value.id) {
      const productAttributes = await fetchProductAttributes(product.value.id)
      if (Array.isArray(productAttributes) && productAttributes.length > 0) {
        for (const attr of productAttributes) {
          attributeValues.value[attr.id] = attr.value?.id !== undefined ? Number(attr.value.id) : ''
          originalAttributeValues.value[attr.id] = attr.value?.id !== undefined ? Number(attr.value.id) : ''
        }
      }
    }
    
    isLoading.value = false
    isInitialLoad.value = false
  } catch (e) {
    error.value = 'Failed to load product attributes.'
    isLoading.value = false
    isInitialLoad.value = false
  }
}

const handleSubmit = async () => {
  error.value = ''
  errors.value = {}
  try {
    isLoading.value = true
    // Fetch product again to get its id (new structure)
    const response = await productApi.getProductBySlug(productSlug)
    product.value = response?.data || null
    if (!product.value) {
      error.value = 'Product not found.'
      attributes.value = []
      isLoading.value = false
      return
    }
    // Transform attributeValues to the required format
    const attributesPayload = Object.entries(attributeValues.value).map(([attribute_id, value_id]) => ({
      attribute_id: Number(attribute_id),
      value_id: value_id ? Number(value_id) : null
    }))
    // Validation: required attributes must have a value
    const validationErrors = {}
    for (const attr of attributes.value) {
      if (attr.required && (!attributeValues.value[attr.id] || attributeValues.value[attr.id] === '')) {
        validationErrors[attr.id] = `Please provide a value for ${attr.name}.`
      }
    }
    if (Object.keys(validationErrors).length > 0) {
      errors.value = validationErrors
      toast.error('Please fill all required specifications.')
      isLoading.value = false
      return
    }
    // Check if attributes have changed
    const unchanged = Object.keys(originalAttributeValues.value).length === Object.keys(attributeValues.value).length &&
      Object.entries(attributeValues.value).every(
        ([key, value]) => originalAttributeValues.value[key] === value
      )
    if (unchanged) {
      // No changes, just navigate to next page if product exists
      if (product.value) {
        router.push({
          path: `/${route.params.username}/selling/products/${productSlug}/images`
        })
      }
      isLoading.value = false
      return
    }
    await productApi.setAttributes(product.value.id, attributesPayload)
    toast.success('Specifications saved!')
    // Redirect to images step only if product exists
    if (product.value) {
      router.push({
        path: `/${route.params.username}/selling/products/${productSlug}/images`
      })
    }
    isLoading.value = false
  } catch (e) {
    error.value = 'Failed to save specifications.'
    toast.error('Failed to save specifications.')
    isLoading.value = false
  }
}

// Go Back handler
function goBack() {
  router.back()
}

onMounted(async () => {
  await fetchAttributes();
  isLoading.value = false;
  isInitialLoad.value = false;
})
</script> 