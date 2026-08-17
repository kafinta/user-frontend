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
          @clicked="handleLocationClick(location)"
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
  <div v-else class="text-center mt-5">
    <div class="max-w-md mx-auto space-y-6">
      <div class="w-20 h-20 mx-auto bg-red-200 rounded-full flex items-center justify-center">
        <UiIconsError class="w-16 h-16 text-red-600" />
      </div>
      <div>
        <UiTypographyH3 class="text-secondary font-medium mb-2 mt-4">
          {{ error || 'No locations available' }}
        </UiTypographyH3>
        <UiTypographyP v-if="!error" class="text-accent-500 text-sm">
          Check back later for new locations.
        </UiTypographyP>
      </div>
      <button
        @click="retryFetch"
        class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
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
import UiIconsError from '~/components/Ui/Icons/Error.vue'

// Props
const props = defineProps({
  onLocationSelect: {
    type: Function,
    default: null
  }
})

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

async function handleLocationClick(location) {
  // If a custom handler is provided (from parent), use it
  if (props.onLocationSelect) {
    return props.onLocationSelect(location.id);
  }

  // Otherwise, use the default behavior (for marketplace pages)
  return selectLocation(location);
}

async function selectLocation(location) {
  await productFilters.selectLocationAndNavigate(location);
}

async function retryFetch() {
  await filtersStore.fetchLocations();
}

onMounted(async () => {
  if (filtersStore.locations.length === 0) {
    await filtersStore.fetchLocations();
  }
})
</script>

<style scoped>
/* Component-specific styles only - shared styles are in assets/css/carousel.css */
</style>
