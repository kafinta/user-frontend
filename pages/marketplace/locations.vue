<template>
  <LayoutsMarketplace>
    <Container>
      <div class="flex justify-between mb-6">
        <UiTypographyH2>{{ getSelectionMessage() }}</UiTypographyH2>
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
import {ref, onMounted} from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { locations, isLoading, error, selectedCategory } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()

function selectLocation(id) {
  productFilters.selectLocation(id)
  
  // Use direct access to the selectedCategoryId value
  const categoryId = productFilters.selectedCategoryId?.value
  
  if (!categoryId) {
    // No category selected yet, go to categories page
    router.push({
      path: '/marketplace/categories',
      query: { location: id }
    })
  } else {
    // Both category and location selected, go to subcategories
    router.push({
      path: '/marketplace/subcategories',
      query: { 
        category: categoryId,
        location: id 
      }
    })
  }
}

onMounted(async () => {
  await filtersStore.fetchLocations()
})
</script>