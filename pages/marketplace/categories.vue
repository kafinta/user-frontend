<template>
  <LayoutsMarketplace>
    <Container>
      <div class="flex justify-between mb-6">
        <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
        <UiButtonsPrimary v-if="productFilters.selectedLocation" @clicked="$router.push({name: 'marketplace-locations'})">Change Room</UiButtonsPrimary>
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
import {ref, onMounted, computed} from 'vue'
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
  const selectedLocation = productFilters.selectedLocation
  
  if (selectedLocation) {
    return `Choose a category for your ${selectedLocation.name}`
  }
  
  return 'Choose a category to get started'
})

function selectCategory(id) {
  productFilters.selectCategory(id)
  
  const locationId = productFilters.selectedLocationId?.value
  
  // Simplified navigation logic
  router.push({
    path: locationId ? '/marketplace/subcategories' : '/marketplace/locations',
    query: { 
      category: id,
      ...(locationId && { location: locationId })
    }
  })
}

onMounted(async () => {
  await filtersStore.fetchCategories()
})
</script>
