<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary @clicked="productFilters.changeCategory">Change Category</UiButtonsPrimary>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <UiSkeleton height="15rem" />
        </li>
        <li v-else-if="error" class="col-span-2 md:col-span-3 lg:col-span-4 place-content-center">
          <div class="max-w-md mx-auto text-center space-y-6">
            <div class="w-20 h-20 mx-auto bg-red-200 rounded-full flex items-center justify-center">
              <UiIconsError class="w-16 h-16 text-red-600" />
            </div>
            <div>
              <UiTypographyH3 class="text-secondary font-medium mb-2">
                {{ error || 'Error loading locations' }}
              </UiTypographyH3>
              <UiTypographyP v-if="!error" class="text-accent-500 text-sm">
                Check back later for new locations.
              </UiTypographyP>
            </div>
            <button
              @click="retryFetchLocations"
              class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </li>
        <li v-else v-for="location in locations" :key="location.id">
          <UiCards @clicked="selectLocation(location)" :title="location.name" :src="location.image_path" class="w-full"/>
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'Browse Locations | Kafinta',
  meta: [
    { name: 'description', content: 'Browse products by room location on Kafinta marketplace' }
  ]
});

import { computed, onMounted } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRoute } from 'vue-router'

const filtersStore = useFiltersStore()
const { locations, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const route = useRoute()

// Check selections and redirect appropriately on page load
onMounted(async () => {
  await ensureDataLoaded();
  await productFilters.checkAndRedirect();
});

// Ensure required data is loaded
const ensureDataLoaded = async () => {
  try {
    // Ensure categories are loaded
    if (filtersStore.categories.length === 0) {
      await filtersStore.fetchCategories();
    }

    // Ensure locations are loaded
    if (filtersStore.locations.length === 0) {
      await filtersStore.fetchLocations();
    }

    // Update state based on URL parameters
    const categorySlug = route.query.category;
    if (categorySlug) {
      const category = filtersStore.categories.find(c => c.slug === categorySlug);
      if (category) {
        productFilters.selectCategory(category);
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Use the new marketplace breadcrumbs composable
const { locationsBreadcrumbs } = useMarketplaceBreadcrumbs()
const breadcrumbItems = locationsBreadcrumbs
// Simplified selection message
const selectionMessage = computed(() => {
  const selectedCategory = productFilters.selectedCategory;
  if (
    selectedCategory &&
    typeof selectedCategory.name === 'string' &&
    selectedCategory.name.trim() !== ''
  ) {
    return `Browse locations for ${selectedCategory.name}`;
  }
  return 'Browse locations';
});

async function selectLocation(location) {
  await productFilters.selectLocationAndNavigate(location);
}

// Retry function for failed requests
async function retryFetchLocations() {
  filtersStore.clearFailedRequest('locations')
  await filtersStore.fetchLocations()
}

// No onMounted needed - useProductFilters composable handles initialization
</script>


