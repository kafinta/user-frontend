<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <UiStepper
      :steps="stepperSteps"
      :currentStep="3"
      :isEnabled="isStepEnabled"
      @step-click="handleStepClick"
    />
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full relative">
      <UiTypographyP class="mb-4 text-center text-primary-700 bg-primary-50 border border-primary-200 rounded p-3 font-semibold">
        This is how your product will appear to buyers.
      </UiTypographyP>
      <div class="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <!-- Product Image Carousel -->
        <div v-if="product && product.images && product.images.length" class="w-full">
          <Splide :options="carouselOptions" aria-label="Product images carousel">
            <SplideSlide v-for="(img, idx) in product.images" :key="img.id || idx">
              <img :src="img.path" :alt="`Product image ${idx + 1}`" class="rounded-xl border border-accent-200 w-full object-cover aspect-[2/1]" />
            </SplideSlide>
            <template #arrows="{ splide }">
              <div class="splide__arrows">
                <button class="splide__arrow splide__arrow--prev" @click="splide.go('<')">
                  <UiIconsArrow class="w-4 h-4 rotate-180" />
                </button>
                <button class="splide__arrow splide__arrow--next" @click="splide.go('>')">
                  <UiIconsArrow class="w-4 h-4" />
                </button>
              </div>
            </template>
          </Splide>
        </div>
        <!-- Product Info -->
        <div class="flex-1 flex flex-col gap-2 w-full">
          <UiTypographyH2 class="mb-1">{{ product?.name }}</UiTypographyH2>
          <div class="flex items-center gap-3 mb-2">
            <UiTypographyH3 class="text-primary">₦{{ product?.price?.toLocaleString() }}</UiTypographyH3>
            <span v-if="product?.status" class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-700 border border-accent-200">{{ product.status }}</span>
          </div>
          <div class="flex flex-wrap gap-2 text-accent-700 text-sm mb-2">
            <span v-if="product?.category?.name">{{ product.category.name }}</span>
            <span v-if="product?.subcategory?.name">› {{ product.subcategory.name }}</span>
            <span v-if="product?.location?.name">› {{ product.location.name }}</span>
          </div>
          <div v-if="product?.description" class="mb-2">
            <UiTypographyP class="line-clamp-3">{{ product.description }}</UiTypographyP>
          </div>
        </div>
        <!-- Specifications -->
        <div v-if="product?.attributes && product.attributes.length" class="w-full">
          <UiTypographyH3 class="mb-2">Specifications</UiTypographyH3>
          <table class="border border-accent-200 border-collapse table-fixed w-full">
            <tr v-for="attr in product.attributes" :key="attr.id">
              <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">{{ attr.name }}</td>
              <td class="border border-accent-200 px-5 py-3">{{ attr.value?.name || attr.value }}</td>
            </tr>
          </table>
        </div>
      </div>
      <UiTypographyP class="mb-2 text-center text-accent-700 bg-accent-50 border border-accent-200 rounded p-3">
        Please review your product details before publishing. You can go back to edit any section.
      </UiTypographyP>
      <div class="grid grid-cols-2 gap-4 pt-2 w-full">
        <UiButtonsTertiary @click="goBack" type="button" class="flex items-center gap-2 px-4 py-2 justify-center w-full">
          <UiIconsArrow class="w-4 h-4 -ml-1" />
          Go Back
        </UiButtonsTertiary>
        <FormButton :loading="isLoading" :disabled="!product" class="w-full justify-center" @click="handlePublish">Publish Product</FormButton>
      </div>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { ref, onMounted } from 'vue'
import UiTypographyH3 from '~/components/Ui/Typography/H3.vue'
import UiTypographyP from '~/components/Ui/Typography/P.vue'
import UiIconsLoading from '~/components/Ui/Icons/Loading.vue'
import FormButton from '~/components/Form/Button.vue'
import UiIconsArrow from '~/components/Ui/Icons/Arrow.vue'
import UiStepper from '~/components/Ui/Stepper.vue'
import UiButtonsTertiary from '~/components/Ui/Buttons/Tertiary.vue'
import UiTypographyH2 from '~/components/Ui/Typography/H2.vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'

const route = useRoute()
const router = useRouter()
const productApi = useProductApi()

const productSlug = route.params.slug
const isLoading = ref(false)
const product = ref(null)
const isDesktop = ref(false)

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener('resize', handleResize);
});

onMounted(async () => {
  const response = await productApi.getProductBySlug(productSlug)
  product.value = response?.data?.product || response?.data || null
})

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

const carouselOptions = {
  type: 'loop',
  perPage: 1,
  perMove: 1,
  gap: '1rem',
  lazyLoad: 'nearby',
  arrows: true,
  pagination: true,
  autoplay: false,
  focus: 0,
  rewind: true,
  speed: 400,
  waitForTransition: false,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  padding: { right: 0, left: 0 },
  breakpoints: {
    640: {
      perPage: 1,
      fixedWidth: '100%',
      focus: 'center',
      padding: { right: 0, left: 0 },
    },
    1024: {
      perPage: 1,
      fixedWidth: false,
      focus: 0,
      padding: { right: 0, left: 0 },
    },
  },
}
</script> 