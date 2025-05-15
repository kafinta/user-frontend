<template>
  <!-- Loading state -->
  <div v-if="isLoading" class="flex space-x-4 w-full mt-5">
    <Skeleton
      v-for="n in numVisibleItems"
      :key="n"
      height="15rem"
    ></Skeleton>
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
    <UiTypographyP v-if="error">{{ error }}</UiTypographyP>
    <UiTypographyP v-else>No locations available. Try again later.</UiTypographyP>
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

const router = useRouter()
const productFilters = useProductFilters()
const filtersStore = useFiltersStore()
const { locations, isLoading, error } = storeToRefs(filtersStore)
const { width } = useWindowSize()

// Define Splide options
const splideOptions = {
  type: 'loop',
  perPage: 5, // Default for large screens
  perMove: 1,
  gap: '.5rem',
  lazyLoad: 'nearby',
  arrows: true,
  pagination: false, // No pagination dots
  autoplay: false,
  focus: 0, // Focus on first slide
  fixedWidth: false, // Use percentage-based sizing for larger screens
  rewind: true, // Allow rewinding from last to first slide
  padding: { right: 0, left: 0 }, // No padding for larger screens (no peek)
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

// For skeleton loading placeholders
const numVisibleItems = computed(() => {
  const currentWidth = width.value

  if (currentWidth >= 1280) return 5
  if (currentWidth >= 1024) return 3
  if (currentWidth >= 768) return 2
  return 1
})

// Fetch locations when component is mounted
onMounted(async () => {
  await filtersStore.fetchLocations()
})
</script>

<style scoped>
:deep(.splide__arrow) {
  background: black;
  width: 3rem;
  height: 3rem;
  opacity: .8;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  z-index: 10;
}

:deep(.splide__arrow:hover) {
  background: var(--primary-500, #C9B14F);
}

:deep(.splide__arrow svg) {
  fill: white;
  width: 1.2em;
  height: 1.2em;
}

/* Make sure the carousel takes full width */
:deep(.splide) {
  width: 100%;
  position: relative;
}

/* Position arrows inside the padding area */
:deep(.splide__arrows) {
  position: absolute;
  width: calc(100% - 2rem);
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

:deep(.splide__arrow) {
  position: relative;
  transform: none;
  top: auto;
  left: auto;
  right: auto;
  pointer-events: auto;
}

/* Remove negative margins that cause overflow */
/* :deep(.splide__list) {
  margin: 0 !important;
} */
</style>
