<template>
  <LayoutsMarketplace>
    <Container>
      <div class="flex justify-between mb-6">
        <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
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

// Simplified selection message
const selectionMessage = computed(() => {
  const selectedCategory = productFilters.selectedCategory
  
  if (selectedCategory) {
    return `Choose where to place your ${selectedCategory.name}`
  }
  
  return 'Choose a room to get started'
})

function selectLocation(id) {
  productFilters.selectLocation(id)
  
  const categoryId = productFilters.selectedCategoryId?.value
  
  // Simplified navigation logic
  router.push({
    path: categoryId ? '/marketplace/subcategories' : '/marketplace/categories',
    query: { 
      location: id,
      ...(categoryId && { category: categoryId })
    }
  })
}

onMounted(async () => {
  await filtersStore.fetchLocations()
})
</script>
