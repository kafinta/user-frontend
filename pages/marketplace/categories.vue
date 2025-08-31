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
          <div class="text-center">
            <UiTypographyP>Error loading categories...</UiTypographyP>
            <UiButtonsSecondary @clicked="retryFetchCategories" class="mt-4">
              Try Again
            </UiButtonsSecondary>
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

const breadcrumbItems = computed(() => {
  const items = [];

  // Add location to breadcrumb if present in URL
  const locationSlug = route.query.location;
  if (locationSlug) {
    const location = filtersStore.locations.find(l => l.slug === locationSlug);
    if (location) {
      items.push({
        label: location.name,
        route: { path: '/marketplace/locations', query: { ...route.query } }
      });
    }
  }

  // Always add Categories as the last (active) item
  items.push({
    label: 'Categories',
    active: true
  });

  return items;
});

// Retry function for failed requests
async function retryFetchCategories() {
  filtersStore.clearFailedRequest('categories')
  await filtersStore.fetchCategories()
}

// No onMounted needed - useProductFilters composable handles initialization
</script>