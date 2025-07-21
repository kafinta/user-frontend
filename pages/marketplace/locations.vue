<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary :url="{ path: '/marketplace/categories', query: { ...route.query } }">Change Category</UiButtonsPrimary>
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

import { computed, watch } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter, useRoute } from 'vue-router'

const filtersStore = useFiltersStore()
const { locations, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()
const route = useRoute()

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
  productFilters.selectLocation(location);

  const categorySlug = productFilters.selectedCategory?.slug || route.query.category;
  const locationSlug = location.slug;

  if (categorySlug && locationSlug) {
    // Both are set, go to subcategories
    await router.push({
      path: '/marketplace/subcategories',
      query: { ...route.query, category: categorySlug, location: locationSlug }
    });
  } else {
    // Only location is set, stay here and update query
    await router.push({
      path: '/marketplace/locations',
      query: { ...route.query, location: locationSlug }
    });
  }
}

// No onMounted needed - useProductFilters composable handles initialization
</script>


