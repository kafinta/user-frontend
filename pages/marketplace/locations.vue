<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary v-if="productFilters.selectedCategory" :url="{name: 'marketplace-categories'}">Change Category</UiButtonsPrimary>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <UiSkeleton height="15rem" />
        </li>
        <li v-else-if="error" class="col-span-2 md:col-span-3 lg:col-span-4 place-content-center">
          <UiTypographyP>Error loading locations... Try again later.</UiTypographyP>
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

import { computed } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { locations, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()

const breadcrumbItems = computed(() => {
  const items = [];

  // Add category to breadcrumb if selected and has a valid name
  if (
    productFilters.selectedCategory &&
    typeof productFilters.selectedCategory.name === 'string' &&
    productFilters.selectedCategory.name.trim() !== ''
  ) {
    items.push({
      label: productFilters.selectedCategory.name,
      route: '/marketplace/categories'
    });
  }
  // Always add Locations as the last (active) item
  items.push({
    label: 'Locations',
    active: true
  });
  return items;
});
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
  // Get the current category slug directly from the store
  const categorySlug = productFilters.selectedCategory?.slug;

  // Create the query parameters using slugs
  const query = { location: location.slug };
  if (categorySlug) {
    query.category = categorySlug;
  }

  // Navigate first
  await router.push({
    path: categorySlug ? '/marketplace/subcategories' : '/marketplace/categories',
    query
  });

  // Update the state after navigation
  productFilters.selectLocation(location);
}

// No onMounted needed - useProductFilters composable handles initialization
</script>


