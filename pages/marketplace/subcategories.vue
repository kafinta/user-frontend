<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="pb-18 py-8">
      <div class="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <UiTypographyH2>{{ selectionMessage }}</UiTypographyH2>
          <UiBreadcrumbs :model="breadcrumbItems" />
        </div>
        <div class="flex gap-2 lg:flex-col justify-stretch items-end">
          <UiButtonsPrimary @clicked="productFilters.changeCategory">Change Category</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="productFilters.changeLocation">Change Room</UiButtonsPrimary>
        </div>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">
        <li v-if="isLoading" v-for="n in 12" :key="n">
          <UiSkeleton height="15rem" />
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
              <UiButtonsPrimary :url="{ name: 'marketplace-categories' }">Change Category</UiButtonsPrimary>
              <UiButtonsPrimary :url="{ name: 'marketplace-locations' }">Change Room</UiButtonsPrimary>
            </div>
          </div>
        </li>
        <li v-else v-for="subcategory in subcategories" :key="subcategory.id">
          <UiCards @clicked="selectSubcategory(subcategory)" :title="subcategory.name" :src="subcategory.image_path" class="w-full"/>
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'Browse Subcategories | Kafinta',
  meta: [
    { name: 'description', content: 'Browse product subcategories to find specific items on Kafinta marketplace' }
  ]
});

import { computed, onMounted } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import { useProductFilters } from '@/composables/useProductFilters'
import { useRoute } from 'vue-router'

const filtersStore = useFiltersStore()
const { subcategories, isLoading, error } = storeToRefs(filtersStore)
const productFilters = useProductFilters()
const route = useRoute()

// Ensure required data is loaded on mount
onMounted(async () => {
  await productFilters.checkAndRedirect();
  await ensureSubcategoriesLoaded();
});

// Function to ensure subcategories are loaded for current category/location
const ensureSubcategoriesLoaded = async () => {
  const categorySlug = route.query.category;
  const locationSlug = route.query.location;

  if (!categorySlug || !locationSlug) {
    return;
  }

  try {
    // Ensure categories and locations are loaded
    if (filtersStore.categories.length === 0) {
      await filtersStore.fetchCategories();
    }
    if (filtersStore.locations.length === 0) {
      await filtersStore.fetchLocations();
    }

    // Find category and location objects
    const category = filtersStore.categories.find(c => c.slug === categorySlug);
    const location = filtersStore.locations.find(l => l.slug === locationSlug);

    if (category && location) {
      // Fetch subcategories if not already loaded or if empty
      if (subcategories.value.length === 0) {
        await filtersStore.fetchSubcategories(category.id, location.id);
      }

      // Update the composable state to match URL
      productFilters.selectCategory(category);
      productFilters.selectLocation(location);
    }
  } catch (error) {
    console.error('Error loading subcategories:', error);
  }
};

// Use the new marketplace breadcrumbs composable
const { subcategoriesBreadcrumbs } = useMarketplaceBreadcrumbs()
const breadcrumbItems = subcategoriesBreadcrumbs

// Add contextual message based on selected category and location
const selectionMessage = computed(() => {
  const selectedCategory = productFilters.selectedCategory;
  const selectedLocation = productFilters.selectedLocation;
  if (
    selectedCategory &&
    typeof selectedCategory.name === 'string' &&
    selectedCategory.name.trim() !== '' &&
    selectedLocation &&
    typeof selectedLocation.name === 'string' &&
    selectedLocation.name.trim() !== ''
  ) {
    return `Browse ${selectedLocation.name} ${selectedCategory.name}`;
  } else if (
    selectedCategory &&
    typeof selectedCategory.name === 'string' &&
    selectedCategory.name.trim() !== ''
  ) {
    return `Browse ${selectedCategory.name} subcategories`;
  } else if (
    selectedLocation &&
    typeof selectedLocation.name === 'string' &&
    selectedLocation.name.trim() !== ''
  ) {
    return `Browse ${selectedLocation.name} subcategories`;
  }
  return 'Browse subcategories';
});

async function selectSubcategory(subcategory) {
  await productFilters.selectSubcategoryAndNavigate(subcategory);
}

// No onMounted needed - useProductFilters composable handles initialization
</script>


