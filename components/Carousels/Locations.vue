<template>
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
  <div v-else-if="locations.length" class="mt-5">
    <Splide
      :options="splideOptions"
      :aria-label="'Locations carousel'"
    >
      <SplideSlide v-for="location in locations" :key="location.id">
        <UiCards
          @clicked="selectLocation(location.id)"
          :title="location.name"
          :src="location.image_path"
          :alt="location.name"
        />
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

  <!-- Error state - only shown when not loading and either there's an error or no locations -->
  <div v-else class="list-none text-center mt-5">
    <UiTypographyP v-if="error">Error fetching locations. Try again later.</UiTypographyP>
    <UiTypographyP v-else>No locations available. Try again later.</UiTypographyP>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter } from 'vue-router'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
// Import Splide CSS
import '@splidejs/vue-splide/css'
// Import shared carousel styles
import '~/assets/css/carousel.css'

const router = useRouter()
const productFilters = useProductFilters()
const filtersStore = useFiltersStore()
const { locations, isLoading, error } = storeToRefs(filtersStore)
const { width } = useWindowSize()

// Define Splide options with optimized settings specific to Locations
const splideOptions = {
  type: 'loop',
  perPage: 5, // Default for large screens
  perMove: 1,
  gap: '.5rem',
  lazyLoad: 'nearby', // Only load nearby slides for better performance
  arrows: true,
  pagination: false, // No pagination dots for better performance
  autoplay: false, // Disable autoplay for better performance
  focus: 0, // Focus on first slide
  fixedWidth: false, // Use percentage-based sizing for larger screens
  rewind: true, // Allow rewinding from last to first slide
  padding: { right: 0, left: 0 }, // No padding for larger screens (no peek)
  speed: 400, // Animation speed
  waitForTransition: false, // Don't wait for transition to end before allowing another
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Optimized easing function

  breakpoints: {
    // Breakpoints are defined from smallest to largest
    640: {
      perPage: 1,
      fixedWidth: '70%', // Narrower width for mobile to show more of adjacent slides
      focus: 'center',
      padding: { right: '15%', left: '15%' }, // Even padding on both sides for mobile (peek effect)
    },
    768: {
      perPage: 2,
      fixedWidth: false, // Disable fixed width for larger screens
      focus: 0, // Focus on first slide for larger screens
      padding: { right: 0, left: 0 }, // No padding for tablet (no peek)
    },
    1024: {
      perPage: 4,
      fixedWidth: false,
      focus: 0,
      padding: { right: 0, left: 0 }, // No padding for desktop (no peek)
    },
  },
}

// For skeleton loading placeholders
const numVisibleItems = computed(() => {
  const currentWidth = width.value

  if (currentWidth >= 1280) return 5
  if (currentWidth >= 1024) return 4
  if (currentWidth >= 768) return 2
  return 1
})

async function selectLocation(id) {
  // Get the current category ID directly from the store
  const categoryId = productFilters.selectedCategoryId?.value

  // Create the query parameters
  const query = { location: id }
  if (categoryId) {
    query.category = categoryId
  }

  // Navigate first
  await router.push({
    path: categoryId ? '/marketplace/subcategories' : '/marketplace/categories',
    query
  })

  // Update the state after navigation
  productFilters.selectLocation(id)
}

// No onMounted needed - data will be fetched when needed by pages
</script>

<style scoped>
/* Component-specific styles only - shared styles are in assets/css/carousel.css */
</style>
