<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex justify-between flex-wrap items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary @clicked="productFilters.changeLocation">Change Room</UiButtonsPrimary>
      </div>
      <ul class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
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
                {{ error || 'Error loading categories' }}
              </UiTypographyH3>
              <UiTypographyP v-if="!error" class="text-accent-500 text-sm">
                Check back later for new categories.
              </UiTypographyP>
            </div>
            <button
              @click="retryFetchCategories"
              class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </li>
        <li v-else v-for="category in categories" :key="category.id">
          <UiCards @clicked="selectCategory(category)" :title="category.name" :src="category.image_path" class="w-full"/>
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'Browse Categories | Kafinta',
  meta: [
    { name: 'description', content: 'Browse product categories to find what you need on Kafinta marketplace' }
  ] 
});

import { computed, onMounted } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRoute } from 'vue-router'

const filtersStore = useFiltersStore()
const { categories, isLoading, error } = storeToRefs(filtersStore)
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
    const locationSlug = route.query.location;
    if (locationSlug) {
      const location = filtersStore.locations.find(l => l.slug === locationSlug);
      if (location) {
        productFilters.selectLocation(location);
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
};


// Simplified selection message
const selectionMessage = computed(() => {
  const selectedLocation = productFilters.selectedLocation;
  if (
    selectedLocation &&
    typeof selectedLocation.name === 'string' &&
    selectedLocation.name.trim() !== ''
  ) {
    return `Browse ${selectedLocation.name} categories`;
  }
  return 'Browse categories';
});

async function selectCategory(category) {
  await productFilters.selectCategoryAndNavigate(category);
}

// Use the new marketplace breadcrumbs composable
const { categoriesBreadcrumbs } = useMarketplaceBreadcrumbs()
const breadcrumbItems = categoriesBreadcrumbs

// Retry function for failed requests
async function retryFetchCategories() {
  filtersStore.clearFailedRequest('categories')
  await filtersStore.fetchCategories()
}

// No onMounted needed - useProductFilters composable handles initialization
</script>