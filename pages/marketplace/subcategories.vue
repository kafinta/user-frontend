<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <div class="flex gap-2 lg:flex-col justify-stretch items-end">
          <UiButtonsPrimary :url="{name: 'marketplace-categories'}">Change Category</UiButtonsPrimary>
          <UiButtonsPrimary :url="{name: 'marketplace-locations'}">Change Room</UiButtonsPrimary>
        </div>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <UiSkeleton height="15rem" />
        </li>
        <li v-else-if="error" class="col-span-2 md:col-span-3 lg:col-span-4 place-content-center">
          <UiTypographyP>Error loading subcategories... Try again later.</UiTypographyP>
        </li>
        <li v-else-if="subcategories.length === 0" class="col-span-2 md:col-span-3 lg:col-span-4 place-content-center">
          <div class="text-center py-8">
            <UiTypographyH3>No items found</UiTypographyH3>
            <UiTypographyP class="mt-2">
              We couldn't find any items that match your selection.
            </UiTypographyP>
            <div class="mt-4 flex gap-4 items-center justify-center">
              <UiButtonsPrimary :url="{name: 'marketplace-categories'}">Change Category</UiButtonsPrimary>
              <UiButtonsPrimary :url="{name: 'marketplace-locations'}">Change Room</UiButtonsPrimary>
            </div>
          </div>
        </li>
        <li v-else v-for="subcategory in subcategories" :key="subcategory.id">
          <UiCards @clicked="selectSubcategory(subcategory.id)" :title="subcategory.name" :src="subcategory.image_path" class="w-full"/>
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'Browse Subcategories | Kafinta',
  meta: [
    { name: 'description', content: 'Browse product subcategories to find specific items on Kafinta marketplace' }
  ]
});

import { computed } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { subcategories, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()

// Define breadcrumb items
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

  // Always add Subcategories as the last (active) item
  items.push({
    label: 'Subcategories',
    active: true
  });

  return items;
});

// Add contextual message based on selected category and location
const selectionMessage = computed(() => {
  const selectedCategory = productFilters.selectedCategory;
  const selectedLocation = productFilters.selectedLocation;
  if (
    selectedCategory &&
    typeof selectedCategory.name === 'string' &&
    selectedCategory.name.trim() !== '' &&
    selectedLocation &&
    typeof selectedLocation.name === 'string' &&
    selectedLocation.name.trim() !== ''
  ) {
    return `Browse ${selectedLocation.name} ${selectedCategory.name}`;
  } else if (
    selectedCategory &&
    typeof selectedCategory.name === 'string' &&
    selectedCategory.name.trim() !== ''
  ) {
    return `Browse ${selectedCategory.name} subcategories`;
  } else if (
    selectedLocation &&
    typeof selectedLocation.name === 'string' &&
    selectedLocation.name.trim() !== ''
  ) {
    return `Browse ${selectedLocation.name} subcategories`;
  }
  return 'Browse subcategories';
});

async function selectSubcategory(id) {
  // Get the current category and location IDs directly from the store
  const categoryId = productFilters.selectedCategoryId.value
  const locationId = productFilters.selectedLocationId.value

  // Create the query parameters
  const query = {
    subcategory: id
  }

  if (categoryId) query.category = categoryId
  if (locationId) query.location = locationId

  // Navigate first
  await router.push({
    path: '/marketplace/products',
    query
  })

  // Update the state after navigation
  productFilters.selectSubcategory(id)
}

// No onMounted needed - useProductFilters composable handles initialization
</script>


