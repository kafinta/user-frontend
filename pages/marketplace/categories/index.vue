<template>
  <
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
          <UiTypographyP>Error loading catgories... Try again later.</UiTypographyP>
        </li>
        <li v-else v-for="category in categories" :key="category.id">
          <UiCards @clicked="filtersStore.fetchSubcategories(category.id, 1)" :title="category.name" :src="category.image_path" class="w-full"/>
        </li>


      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
import {ref, onMounted} from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'

import { useRuntimeConfig } from '#app'

const filtersStore = useFiltersStore()
const { categories, isLoading, error  } = storeToRefs(filtersStore)

onMounted(async () => {
  await filtersStore.fetchCategories()
})
</script>