<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <UiStepper
      :steps="stepperSteps"
      :currentStep="3"
      :isEnabled="isStepEnabled"
      @step-click="handleStepClick"
    />
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full relative">
      <UiTypographyH3>Publish Product</UiTypographyH3>
      <div v-if="isLoading" class="w-full flex justify-center py-8">
        <UiIconsLoading class="w-8 h-8" />
        <span class="ml-2 text-secondary">Publishing...</span>
      </div>
      <div v-else class="w-full">
        <div class="bg-white border border-accent-200 rounded-xl p-8 flex flex-col gap-6 items-center">
          <UiTypographyP class="mb-2 text-center">Review your product details and click below to publish.</UiTypographyP>
          <div class="grid grid-cols-2 gap-4 pt-2 w-full">
            <UiButtonsTertiary @click="goBack" type="button" class="flex items-center gap-2 px-4 py-2 justify-center w-full">
              <UiIconsArrow class="w-4 h-4 -ml-1" />
              Go Back
            </UiButtonsTertiary>
            <FormButton :loading="isLoading" class="w-full justify-center" @click="handlePublish">Publish Product</FormButton>
          </div>
        </div>
      </div>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { ref } from 'vue'
import UiTypographyH3 from '~/components/Ui/Typography/H3.vue'
import UiTypographyP from '~/components/Ui/Typography/P.vue'
import UiIconsLoading from '~/components/Ui/Icons/Loading.vue'
import FormButton from '~/components/Form/Button.vue'
import UiIconsArrow from '~/components/Ui/Icons/Arrow.vue'
import UiStepper from '~/components/Ui/Stepper.vue'
import UiButtonsTertiary from '~/components/Ui/Buttons/Tertiary.vue'

const route = useRoute()
const router = useRouter()
const productApi = useProductApi()

const productSlug = route.params.slug
const isLoading = ref(false)
const product = ref(null)

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

const handlePublish = async () => {
  isLoading.value = true
  // Fetch product by slug to get its id
  const response = await productApi.getProductBySlug(productSlug)
  product.value = response?.data?.product || response?.data
  if (!product.value) {
    isLoading.value = false
    return
  }
  // Only publish when the user clicks the button
  const publishResponse = await productApi.publishProduct(product.value.id)
  isLoading.value = false
  if (publishResponse && publishResponse.status === 'success') {
    router.push({ path: `/${route.params.username}/selling/products` })
  }
}

// Go Back handler
function goBack() {
  router.back()
}
</script> 