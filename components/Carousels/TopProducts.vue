<template>
  <Container>
    <div>
      <div class="flex items-center justify-between">
        <div>
          <UiTypographyH2>Trending Products</UiTypographyH2>
          <UiTypographyP>Our top selling products in the last month.</UiTypographyP>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex space-x-4 w-full mt-5">
        <UiSkeleton
          v-for="n in numVisibleItems"
          :key="n"
          height="20rem"
          class="flex-1"
        />
      </div>

      <!-- Content loaded successfully -->
      <div v-else-if="products.length" class="mt-5">
        <Splide
          :options="splideOptions"
          :aria-label="'Trending Products carousel'"
        >
          <SplideSlide v-for="product in products" :key="product.id">
            <div class="carousel-item-wrapper">
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

          <!-- Custom arrows using slots -->
          <template #arrows="{ splide }">
            <div class="splide__arrows">
              <button
                class="splide__arrow splide__arrow--prev"
                @click="splide.go('<')"
              >
                <UiIconsArrow class="w-4 h-4 rotate-180" />
              </button>
              <button
                class="splide__arrow splide__arrow--next"
                @click="splide.go('>')"
              >
                <UiIconsArrow class="w-4 h-4" />
              </button>
            </div>
          </template>
        </Splide>
      </div>

      <!-- Error state - only shown when not loading and either there's an error or no products -->
      <div v-else class="text-center mt-5">
        <div class="max-w-md mx-auto space-y-6">
          <div class="w-20 h-20 mx-auto bg-red-200 rounded-full flex items-center justify-center">
            <UiIconsError class="w-16 h-16 text-red-600" />
          </div>
          <div>
            <UiTypographyH3 class="text-secondary font-medium mb-2">
              {{ error || 'No trending products available' }}
            </UiTypographyH3>
            <UiTypographyP v-if="!error" class="text-accent-500 text-sm">
              Check back later for new products.
            </UiTypographyP>
          </div>
          <button
            @click="fetchProducts"
            class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
// Import Splide CSS - only import once if not already imported by another component
import '@splidejs/vue-splide/css'
// Import shared carousel styles
import '~/assets/css/carousel.css'
import { useProductsCarousel } from '~/composables/useProductsCarousel'
import UiIconsError from '~/components/Ui/Icons/Error.vue'

const { width } = useWindowSize()

// Use the carousel composable for top products
const { products, isLoading, error, fetchProducts } = useProductsCarousel({
  endpoint: '/api/products/top'
})

// Define Splide options with optimized settings specific to TopProducts
const splideOptions = {
  type: 'loop',
  perPage: 4, // 4 slides on extra large screens
  perMove: 1,
  gap: '1rem',
  lazyLoad: 'nearby', // Only load nearby slides
  arrows: true,
  pagination: false, // No pagination dots for better performance
  autoplay: false, // Disable autoplay for better performance
  focus: 0,
  fixedWidth: false,
  rewind: true,
  padding: { right: 0, left: 0 },
  speed: 400,
  waitForTransition: false, // Don't wait for transition to end before allowing another
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Optimized easing function

  breakpoints: {
    1280: { // For screens <= 1280px
      perPage: 3,
      fixedWidth: false,
    },
    1024: { // For screens <= 1024px
      perPage: 2,
      fixedWidth: false,
    },
    768: { // For screens <= 768px
      perPage: 1,
      fixedWidth: '70%',
      focus: 'center',
      padding: { right: '15%', left: '15%' },
    },
    640: { // For screens <= 640px
      perPage: 1,
      fixedWidth: '90%',
      focus: 'center',
      padding: { right: '5%', left: '5%' },
    },
  },
}

// For skeleton loading placeholders
const numVisibleItems = computed(() => {
  const currentWidth = width.value

  if (currentWidth >= 1280) return 4
  if (currentWidth >= 1024) return 3
  if (currentWidth >= 768) return 2
  return 1
})

// Fetch products when component is mounted
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* Component-specific styles only - shared styles are in assets/css/carousel.css */
</style>