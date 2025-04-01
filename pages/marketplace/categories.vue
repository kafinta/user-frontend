<template>
  <LayoutsMarketplace>
    <Container>
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
import {ref, onMounted} from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRouter } from 'vue-router'

const filtersStore = useFiltersStore()
const { categories, isLoading, error  } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const router = useRouter()

function selectCategory(id) {
  productFilters.selectCategory(id)
  
  // Use direct access to the selectedLocationId value
  const locationId = productFilters.selectedLocationId?.value
  
  if (!locationId) {
    // No location selected yet, go to locations page
    router.push({
      path: '/marketplace/locations',
      query: { category: id }
    })
  } else {
    // Both category and location selected, go to subcategories
    router.push({
      path: '/marketplace/subcategories',
      query: { 
        category: id,
        location: locationId 
      }
    })
  }
}

onMounted(async () => {
  await filtersStore.fetchCategories()
})
</script>