<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <div class="flex gap-2 lg:flex-col justify-stretch items-end">
          <UiButtonsPrimary @clicked="router.push({name: 'marketplace-categories'})">Change Category</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="router.push({name: 'marketplace-locations'})">Change Room</UiButtonsPrimary>
        </div>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <Skeleton
            height="15rem"
          ></Skeleton>
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
              <UiButtonsPrimary @click="router.push('/marketplace/categories')">Change Category</UiButtonsPrimary>
              <UiButtonsPrimary @click="router.push('/marketplace/locations')">Change Room</UiButtonsPrimary>
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
import {ref, onMounted, computed} from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter, useRoute } from 'vue-router'

const filtersStore = useFiltersStore()
const { subcategories, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()
const route = useRoute()

const home = ref({
  icon: 'pi pi-home',
  route: '/marketplace'
});

// Define breadcrumb items
const breadcrumbItems = computed(() => {
  const items = [];

  // Add category to breadcrumb if selected
  if (productFilters.selectedCategory) {
    items.push({
      label: productFilters.selectedCategory.name,
      route: '/marketplace/categories'
    });
  }

  // Add location to breadcrumb if selected
  if (productFilters.selectedLocation) {
    items.push({
      label: productFilters.selectedLocation.name,
      route: '/marketplace/locations'
    });
  }

  // Add current page (Subcategories)
  items.push({
    label: 'Subcategories',
    active: true
  });

  return items;
});

// Add contextual message based on selected category and location
const selectionMessage = computed(() => {
  const selectedCategory = productFilters.selectedCategory
  const selectedLocation = productFilters.selectedLocation

  if (selectedCategory && selectedLocation) {
    return `Browse ${selectedLocation.name} ${selectedCategory.name} `
  } else if (selectedCategory) {
    return `Browse ${selectedCategory.name} subcategories`
  } else if (selectedLocation) {
    return `Browse ${selectedLocation.name} subcategories`
  }
  return 'Browse subcategories'
})

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

onMounted(async () => {
  const categoryId = route.query.category ? Number(route.query.category) : null;
  const locationId = route.query.location ? Number(route.query.location) : null;

  // If we have parameters but not selected items, load them
  if (categoryId && !productFilters.selectedCategory) {
    productFilters.selectCategory(categoryId);
  }

  if (locationId && !productFilters.selectedLocation) {
    productFilters.selectLocation(locationId);
  }

  // Fetch subcategories if both category and location are available
  if (categoryId && locationId) {
    await productFilters.fetchSubcategories();
  }
})
</script>


