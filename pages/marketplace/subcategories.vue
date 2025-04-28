<template>
  <LayoutsMarketplace>
    <Container>
      <div class="flex justify-between mb-6">
        <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
        <div class="flex gap-2">
          <UiButtonsPrimary @clicked="$router.push({name: 'marketplace-categories'})">Change Category</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="$router.push({name: 'marketplace-locations'})">Change Room</UiButtonsPrimary>
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
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { subcategories, isLoading, error  } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()

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

function selectSubcategory(id) {
  router.push({
    path: '/marketplace/products',
    query: { 
      subcategory: productFilters.selectedSubcategoryId.value,
      category: productFilters.selectedCategoryId.value,
      location: productFilters.selectedLocationId.value
    }
  });
}
onMounted(async () => {
  if (productFilters.selectedCategoryId.value && productFilters.selectedLocationId.value) {
    await productFilters.fetchSubcategories()
  }
})
</script>