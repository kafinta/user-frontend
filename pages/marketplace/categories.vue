<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex justify-between flex-wrap items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary v-if="productFilters.selectedLocation" :url="{name: 'marketplace-locations'}">Change Room</UiButtonsPrimary>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
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

import { computed } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { categories, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()



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
  // Get the current location slug directly from the store
  const locationSlug = productFilters.selectedLocation?.slug;

  // Create the query parameters using slugs
  const query = { category: category.slug };
  if (locationSlug) {
    query.location = locationSlug;
  }

  // Navigate first
  await router.push({
    path: locationSlug ? '/marketplace/subcategories' : '/marketplace/locations',
    query
  });

  // Update the state after navigation
  productFilters.selectCategory(category);
}

const breadcrumbItems = computed(() => {
  const items = [];
  // Add location to breadcrumb if selected and has a valid name
  if (
    productFilters.selectedLocation &&
    typeof productFilters.selectedLocation.name === 'string' &&
    productFilters.selectedLocation.name.trim() !== ''
  ) {
    items.push({
      label: productFilters.selectedLocation.name,
      route: '/marketplace/locations'
    });
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