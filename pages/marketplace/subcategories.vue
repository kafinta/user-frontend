<template>
  <LayoutsMarketplace>
    <Container>
      <div class="flex justify-between items-center mb-6">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <div class="flex gap-2">
          <UiButtonsPrimary @clicked="router.push({name: 'marketplace-categories'})">Change Category</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="router.push({name: 'marketplace-locations'})">Change Room</UiButtonsPrimary>
        </div>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <li v-if="isLoading">
          <Skeleton
            v-for="n in 12"
            :key="n"
            height="15rem"
          ></Skeleton>
        </li>
        <li v-else-if="error">
          <UiTypographyP>Error loading subcategories... Try again later.</UiTypographyP>
        </li>
        <li v-else-if="subcategories.length === 0">
          <div class="text-center py-8">
            <UiTypographyH3>No items found</UiTypographyH3>
            <UiTypographyP class="mt-2">
              We couldn't find any items that match your selection.
            </UiTypographyP>
            <div class="mt-4">
              <UiButtonsPrimary @click="router.push('/marketplace/categories')">Change Category</UiButtonsPrimary>
              <UiButtonsPrimary @click="router.push('/marketplace/locations')" class="ml-2">Change Room</UiButtonsPrimary>
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
    return `Choose a subcategory for ${selectedCategory.name} in your ${selectedLocation.name}`
  } else if (selectedCategory) {
    return `Choose a subcategory for ${selectedCategory.name}`
  } else if (selectedLocation) {
    return `Choose a subcategory for your ${selectedLocation.name}`
  }

  return 'Choose a subcategory to get started'
})

async function selectSubcategory(id) {
  // Create the query parameters
  const query = {
    subcategory: id,
    category: productFilters.selectedCategoryId?.value,
    location: productFilters.selectedLocationId?.value
  }
  
  // Navigate first
  await router.push({
    path: '/marketplace/products',
    query
  })
  
  // Note: We don't need to update any state here as the subcategory ID
  // is only used for the query parameter and not stored in the productFilters
}

onMounted(async () => {
  const categoryId = route.query.category;
  const locationId = route.query.location;

  // If we have parameters but not selected items, load them
  if (categoryId && !productFilters.selectedCategory) {
    productFilters.selectCategory(categoryId);
  }

  if (locationId && !productFilters.selectedLocation) {
    productFilters.selectLocation(locationId);
  }

  // Only fetch subcategories if we have both a category and location
  if (productFilters.selectedCategoryId?.value && productFilters.selectedLocationId?.value) {
    await productFilters.fetchSubcategories();
  } else if (categoryId && locationId) {
    // If we have the IDs in the URL but they're not in the state yet,
    // we need to wait for the selectCategory and selectLocation to complete
    // before fetching subcategories
    await Promise.all([
      productFilters.selectCategory(categoryId),
      productFilters.selectLocation(locationId)
    ]);
    await productFilters.fetchSubcategories();
  }
})
</script>


