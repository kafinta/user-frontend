<template>
  <section v-if="showSection" class="relative overflow-hidden rounded-3xl border border-accent-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(26,59,51,0.08),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(183,119,58,0.10),_transparent_30%)] pointer-events-none"></div>

    <div class="relative px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl space-y-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {{ tag }}
          </div>
          <div>
            <UiTypographyH2 class="text-xl md:text-2xl 2xl:text-3xl font-medium text-secondary">
              {{ title }}
            </UiTypographyH2>
            <UiTypographyP class="mt-1 max-w-2xl text-accent-500">
              {{ subtitle }}
            </UiTypographyP>
          </div>
        </div>

        <UiButtonsSecondary v-if="seeAllUrl" :url="seeAllUrl" class="w-fit flex items-center gap-2">
          See All
          <UiIconsChevron class="w-4 h-4 rotate-90" />
        </UiButtonsSecondary>
      </div>

      <div v-if="isLoading" class="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <UiSkeleton v-for="i in skeletonCount" :key="`product-skeleton-${endpoint}-${i}`" height="22rem" class="rounded-2xl" />
      </div>

      <div v-else-if="error" class="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <UiTypographyH3 class="font-medium text-red-700">{{ error }}</UiTypographyH3>
        <UiTypographyP class="mt-2 text-sm text-red-600">Try again later or refresh the page.</UiTypographyP>
        <button @click="fetchProducts" class="mt-5 inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
          Retry
        </button>
      </div>

      <div v-else class="mt-6">
        <Splide :options="splideOptions" :aria-label="title" class="product-showcase-splide">
          <SplideSlide v-for="product in products" :key="product.id">
            <div class="h-full pr-1 pb-1">
              <ProductsCard
                :slug="product.slug"
                :name="product.name"
                :price="product.price"
                :image="product.image"
                :rating="product.rating"
                :reviewCount="product.reviewCount"
                :salesCount="product.salesCount"
              />
            </div>
          </SplideSlide>
        </Splide>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'
import '~/assets/css/carousel.css'
import { useWindowSize } from '@vueuse/core'
import { useProductsCarousel } from '~/composables/useProductsCarousel'

interface Props {
  endpoint: '/api/products/top' | '/api/products/trending' | '/api/products/featured'
  title: string
  subtitle: string
  tag?: string
  seeAllUrl?: any
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'Products',
  seeAllUrl: undefined
})

const { width } = useWindowSize()
const { products, isLoading, error, fetchProducts } = useProductsCarousel({
  endpoint: props.endpoint,
  hideEmpty: true
})

const showSection = computed(() => isLoading.value || products.value.length > 0 || !!error.value)

const skeletonCount = computed(() => {
  if (width.value >= 1536) return 4
  if (width.value >= 1024) return 3
  if (width.value >= 640) return 2
  return 1
})

const splideOptions = computed(() => ({
  type: 'loop',
  perPage: 4,
  perMove: 1,
  gap: '1rem',
  arrows: true,
  pagination: false,
  autoplay: false,
  focus: 0,
  rewind: true,
  speed: 450,
  breakpoints: {
    1536: { perPage: 4 },
    1280: { perPage: 3 },
    1024: { perPage: 2 },
    640: { perPage: 1, fixedWidth: '85%', focus: 'center' }
  }
}))

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-showcase-splide :deep(.splide__track) {
  padding-bottom: 0.25rem;
}
</style>
