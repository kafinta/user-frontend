<template>
  <LayoutsMarketplace>
    <Container>
      <div class="flex justify-between mb-6">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary @clicked="$router.push({name: 'marketplace-categories'})">Change Category</UiButtonsPrimary>
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
          <UiTypographyP>Error loading locations... Try again later.</UiTypographyP>
        </li>
        <li v-else v-for="location in locations" :key="location.id">
          <UiCards @clicked="selectLocation(location.id)" :title="location.name" :src="location.image_path" class="w-full"/>
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
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { locations, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()

const breadcrumbItems = computed(() => {
  const items = [];
  
  // Add category to breadcrumb if selected
  if (productFilters.selectedCategory) {
    items.push({
      label: productFilters.selectedCategory.name,
      route: '/marketplace/categories'
    });
  }
  
  // Add current page (Locations)
  items.push({
    label: 'Locations',
    active: true
  });
  
  return items;
});
// Simplified selection message
const selectionMessage = computed(() => {
  const selectedCategory = productFilters.selectedCategory

  if (selectedCategory) {
    return `Choose where to place your ${selectedCategory.name}`
  }

  return 'Choose a room to get started'
})

async function selectLocation(id) {
  // Get the current category ID directly from the store
  const categoryId = productFilters.selectedCategoryId?.value
  
  // Create the query parameters
  const query = { location: id }
  if (categoryId) {
    query.category = categoryId
  }
  
  // Navigate first
  await router.push({
    path: categoryId ? '/marketplace/subcategories' : '/marketplace/categories',
    query
  })
  
  // Update the state after navigation
  productFilters.selectLocation(id)
}

onMounted(async () => {
  // Check if we have a category in the URL but not in the state
  const categoryId = router.currentRoute.value.query.category;
  if (categoryId && !productFilters.selectedCategory) {
    productFilters.selectCategory(categoryId);
  }

  await filtersStore.fetchLocations();
})
</script>


