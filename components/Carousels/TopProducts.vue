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
          height="15rem"
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
                :title="product.title"
                :image="product.image_path"
                :review="product.rating || 4.5"
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
      <div v-else class="list-none text-center mt-5">
        <UiTypographyP v-if="error">{{ error }}</UiTypographyP>
        <UiTypographyP v-else>No trending products available. Check back later.</UiTypographyP>
      </div>
    </div>
  </Container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
// Import Splide CSS - only import once if not already imported by another component
import '@splidejs/vue-splide/css'
// Import shared carousel styles
import '~/assets/css/carousel.css'
import { useRouter } from 'vue-router'

const router = useRouter()
const { width } = useWindowSize()

// State management
const isLoading = ref(true)
const error = ref(null)
const products = ref([])

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

// Fetch products data
async function fetchTopProducts() {
  isLoading.value = true
  error.value = null

  try {
    // In a real app, this would be an API call
    // const response = await useCustomFetch<{ data: Product[] }>('api/products/trending')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data - in production this would come from the API
    products.value = [
      {
        id: 1,
        title: 'Modern Sofa Set',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243546/kafinta/professionals/architecture_pfqxd1.jpg',
        rating: 4.8
      },
      {
        id: 2,
        title: 'Dining Table Set',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243547/kafinta/professionals/contractors_lh7l0e.jpg',
        rating: 4.5
      },
      {
        id: 3,
        title: 'Bedroom Furniture',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674493506/kafinta/professionals/interior_design_pqrjoi.jpg',
        rating: 4.7
      },
      {
        id: 4,
        title: 'Outdoor Furniture',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243718/kafinta/professionals/landscape_hu1kew.jpg',
        rating: 4.3
      },
      {
        id: 5,
        title: 'Kitchen Cabinets',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674494156/kafinta/professionals/concrete_2_m4mxvu.jpg',
        rating: 4.6
      },
      {
        id: 6,
        title: 'Bathroom Fixtures',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243925/kafinta/professionals/swimming_pool_kzttut.jpg',
        rating: 4.4
      },
      {
        id: 7,
        title: 'Home Decor',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674244002/kafinta/professionals/remodeling_fizg3u.jpg',
        rating: 4.9
      },
      {
        id: 8,
        title: 'Lighting Fixtures',
        image_path: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674244070/kafinta/professionals/dwelling_units_b7fsmx.jpg',
        rating: 4.2
      }
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load trending products'
    console.error('Error fetching top products:', err)
  } finally {
    isLoading.value = false
  }
}

// Fetch products when component is mounted
onMounted(() => {
  fetchTopProducts()
})
</script>

<style scoped>
/* Component-specific styles only - shared styles are in assets/css/carousel.css */
</style>