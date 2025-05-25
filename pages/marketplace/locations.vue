<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex flex-wrap justify-between items-center gap-4">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <UiButtonsPrimary v-if="productFilters.selectedCategory" :url="{name: 'marketplace-categories'}">Change Category</UiButtonsPrimary>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <UiSkeleton height="15rem" />
        </li>
        <li v-else-if="error" class="col-span-2 md:col-span-3 lg:col-span-4 place-content-center">
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
import { computed } from 'vue'
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
    return `Browse rooms for ${selectedCategory.name}`
  }

  return 'Browse rooms'
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

// No onMounted needed - useProductFilters composable handles initialization
</script>


