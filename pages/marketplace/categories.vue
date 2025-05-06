<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex justify-between flex-wrap items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary v-if="productFilters.selectedLocation" @clicked="$router.push({name: 'marketplace-locations'})">Change Room</UiButtonsPrimary>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <Skeleton
            height="15rem"
          ></Skeleton>
        </li>
        <li v-else-if="error" class="col-span-2 md:col-span-3 lg:col-span-4 place-content-center">
          <UiTypographyP>Error loading categories... Try again later.</UiTypographyP>
        </li>
        <li v-else v-for="category in categories" :key="category.id">
          <UiCards @clicked="selectCategory(category.id)" :title="category.name" :src="category.image_path" class="w-full"/>
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
import {onMounted, computed} from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter, useRoute } from 'vue-router'

const filtersStore = useFiltersStore()
const { categories, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()
const route = useRoute()



// Simplified selection message
const selectionMessage = computed(() => {
  const selectedLocation = productFilters.selectedLocation

  if (selectedLocation) {
    return `Browse ${selectedLocation.name} categories`
  }

  return 'Browse categories'
})

async function selectCategory(id) {
  // Get the current location ID directly from the store
  const locationId = productFilters.selectedLocationId?.value

  // Create the query parameters
  const query = { category: id }
  if (locationId) {
    query.location = locationId
  }

  // Navigate first
  await router.push({
    path: locationId ? '/marketplace/subcategories' : '/marketplace/locations',
    query
  })

  // Update the state after navigation
  productFilters.selectCategory(id)
}

const breadcrumbItems = computed(() => {
  const items = [];

  // Add location to breadcrumb if selected
  if (productFilters.selectedLocation) {
    items.push({
      label: productFilters.selectedLocation.name,
      route: '/marketplace/locations'
    });
  }

  // Add current page (Categories)
  items.push({
    label: 'Categories',
    active: true
  });

  return items;
});

onMounted(async () => {
  // Check if we have a location in the URL but not in the state
  const locationId = route.query.location ? Number(route.query.location) : null;
  if (locationId && !productFilters.selectedLocation) {
    productFilters.selectLocation(locationId);
  }

  await filtersStore.fetchCategories();
})
</script>