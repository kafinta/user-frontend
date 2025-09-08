<template>
  <LayoutsMarketplace class="px-4 sm:px-6 relative">
    <div class="flex justify-between items-center flex-wrap gap-6">
      <div>
        <UiTypographyH2 v-if="search">Search results for <b>{{ $route.query.query }}</b></UiTypographyH2>
        <UiTypographyH2 v-else>Browse {{ headingName }}</UiTypographyH2>
        <UiBreadcrumbs :model="breadcrumbItems" />
      </div>

      <div class="flex gap-2 lg:flex-col justify-stretch items-end">
        <UiButtonsPrimary @clicked="productFilters.changeSubcategory">Change subcategory</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="openDialog=true" class="lg:hidden">
          <div class="flex gap-5">
            <p>Filters</p>
            <UiIconsFilter class="w-5 flex m-0" />
          </div>
        </UiButtonsPrimary>
      </div>
    </div>

    <div class="mt-10 relative flex flex-col lg:flex-row gap-6">
      <!-- Fixed sidebar for filters -->
      <div class="hidden lg:block w-1/4 2xl:w-1/5">
        <div class="sticky top-20 h-screen overflow-y-auto max-h-[calc(100vh - 140px)]">
          <Filter @filter-changed="onFilterChanged" />
        </div>
      </div>

      <!-- Main content area -->
      <div class="w-full lg:w-3/4 2xl:w-4/5">
        <!-- Loading state -->
        <template v-if="isLoading">
          <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
            <ProductsCard v-for="n in 12" :key="`skeleton-${n}`" :skeleton="true" />
          </div>
        </template>

        <!-- Error state -->
        <template v-else-if="error">
          <div class="text-center py-16 flex flex-col items-center justify-center">
            <div class="rounded-full p-6 flex items-center justify-center mb-6 bg-red-50 border border-red-200 w-24 h-24">
              <UiIconsError class="w-12 h-12 text-red-500" />
            </div>
            <UiTypographyH3 class="text-red-600 mb-3">Oops! Something went wrong</UiTypographyH3>
            <UiTypographyP class="text-red-500 mb-6 max-w-md">{{ error }}</UiTypographyP>
            <UiButtonsPrimary @clicked="retryFetch" class="flex items-center gap-2">
              <UiIconsRefresh class="w-4 h-4" />
              Try Again
            </UiButtonsPrimary>
          </div>
        </template>

        <!-- No products state -->
        <template v-else-if="!hasProducts">
          <div class="text-center py-16 flex flex-col items-center justify-center">
            <div class="rounded-full p-6 flex items-center justify-center mb-6 bg-accent-50 border border-accent-200 w-24 h-24">
              <UiIconsSearch class="w-12 h-12 text-accent-400" />
            </div>
            <UiTypographyH3 class="text-secondary mb-3">No products found</UiTypographyH3>
            <UiTypographyP class="text-accent-500 mb-6 max-w-md">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </UiTypographyP>
            <div class="flex gap-3">
              <UiButtonsSecondary @clicked="clearFilters">Clear Filters</UiButtonsSecondary>
              <UiButtonsPrimary :url="{ path: '/marketplace/subcategories', query: { ...route.query } }">
                Browse Categories
              </UiButtonsPrimary>
            </div>
          </div>
        </template>

        <!-- Products grid -->
        <template v-else>
          <div class="mb-4 flex justify-between items-center">
            <UiTypographyP class="text-accent-600">
              Showing {{ products.length }} product{{ products.length !== 1 ? 's' : '' }}
            </UiTypographyP>
          </div>
          <ul class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
            <ProductsCard
              v-for="product in products"
              :key="product.id"
              :slug="product.slug"
              :name="product.name"
              :price="product.price"
              :discountPrice="product.previous_price"
              :image="product.images && product.images.length ? product.images[0].url : ''"
              :skeleton="false"
            />
          </ul>
        </template>
        <!-- Pagination (only show when products are loaded) -->
        <div v-if="hasProducts && !isLoading && !error" class="divide-x divide-white mt-10 justify-center w-full flex">
          <button
            @click="prev"
            :disabled="isLoading"
            class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-l-md hover:bg-accent-400 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UiIconsArrow class="w-4"/>
          </button>
          <button
            v-for="item in 5"
            :key="item"
            ref="pagination"
            :disabled="isLoading"
            class="text-white bg-secondary h-10 w-10 grid place-items-center hover:bg-accent-400 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ item }}
          </button>
          <button
            @click="next"
            :disabled="isLoading"
            class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-r-md hover:bg-accent-400 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UiIconsArrow class="w-4 rotate-180"/>
          </button>
        </div>
      </div>
    </div>

    <ModalsDrawer okText="Apply" :scrollable="true" :footerButtons="true" :openDialog="openDialog" @closeDialog="openDialog=false">
      <template #title>Filters</template>
      <div class="h-full">
        <Filter @filter-changed="onFilterChanged" />
      </div>
    </ModalsDrawer>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'Browse Products | Kafinta',
  meta: [
    { name: 'description', content: 'Browse and shop products from various categories on Kafinta marketplace' }
  ]
});

import { ref, computed, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductFilters } from "@/composables/useProductFilters";
import { useFiltersStore } from '~/stores/filters';
import { useCustomFetch } from '@/composables/useCustomFetch';

const route = useRoute();
const router = useRouter();
const filtersStore = useFiltersStore();
const productFilters = useProductFilters();
const openDialog = ref(false);
const search = computed(() => !!route.query.query);

const products = ref([]);
const isLoading = ref(true);
const error = ref('');
const selectedAttributes = ref({});

const hasProducts = computed(() => products.value && products.value.length > 0);

function onFilterChanged(attrs) {
  selectedAttributes.value = attrs;
}

// Retry function for failed requests
async function retryFetch() {
  await fetchProducts();
}

// Clear filters function
function clearFilters() {
  selectedAttributes.value = {};
  // Also clear search query if present
  if (route.query.query) {
    const newQuery = { ...route.query };
    delete newQuery.query;
    router.push({ query: newQuery });
  }
}

const fetchProducts = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const params = new URLSearchParams();
    params.append('per_page', 30);

    // API requires either search query OR subcategory_id
    if (route.query.query) {
      // Search mode - use search query
      params.append('search', route.query.query);
    } else if (route.query.subcategory) {
      // Subcategory mode - find subcategory ID from slug
      const subcategorySlug = route.query.subcategory;
      let subcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);

      if (!subcategory) {
        // If subcategory not found in store, ensure data is loaded first
        await ensureDataLoaded();
        subcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);
      }

      if (subcategory) {
        params.append('subcategory_id', subcategory.id);
      } else {
        // Still no subcategory found, this is an error
        error.value = 'Subcategory not found. Please select a valid subcategory.';
        products.value = [];
        isLoading.value = false;
        return;
      }
    } else {
      // No search query or subcategory - this shouldn't happen on products page
      error.value = 'No subcategory or search query specified.';
      products.value = [];
      isLoading.value = false;
      return;
    }

    // Add attribute filters
    for (const [attrName, attrObj] of Object.entries(selectedAttributes.value)) {
      if (attrObj && attrObj.name) {
        params.append(`attributes[${attrName}]`, attrObj.name);
      }
    }

    const res = await useCustomFetch(`/api/products?${params.toString()}`, { method: 'GET' });

    if (res && res.status === 'success') {
      if (res.data && res.data.data) {
        products.value = res.data.data;
      } else {
        products.value = [];
      }
    } else {
      // Handle API error responses
      const errorMessage = res?.message || 'Unable to load products at this time.';
      error.value = errorMessage;
      products.value = [];
    }
  } catch (e) {
    // Handle network or other errors
    console.error('Error fetching products:', e);

    if (e?.data?.message) {
      error.value = e.data.message;
    } else if (e?.message) {
      error.value = e.message;
    } else {
      error.value = 'Network error. Please check your connection and try again.';
    }

    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Initialize data and check page accessibility on mount
onMounted(async () => {
  const hasSubcategory = route.query.subcategory;
  const hasSearchQuery = route.query.query;

  if (!hasSubcategory && !hasSearchQuery) {
    // No valid parameters, redirect to subcategories page
    const categorySlug = route.query.category;
    const locationSlug = route.query.location;

    if (categorySlug && locationSlug) {
      router.push({
        path: '/marketplace/subcategories',
        query: { category: categorySlug, location: locationSlug }
      });
    } else {
      router.push({ path: '/marketplace' });
    }
    return;
  }

  // If we have a subcategory, ensure the required data is loaded
  if (hasSubcategory) {
    await ensureDataLoaded();
  }
});

// Function to ensure all required data is loaded for subcategory mode
const ensureDataLoaded = async () => {
  const categorySlug = route.query.category;
  const locationSlug = route.query.location;
  const subcategorySlug = route.query.subcategory;

  if (!categorySlug || !locationSlug || !subcategorySlug) {
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
      // Check if subcategories are loaded for this category/location combination
      const subcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);

      if (!subcategory) {
        // Subcategories not loaded or subcategory not found, fetch them
        await filtersStore.fetchSubcategories(category.id, location.id);
      }

      // Update the composable state to match URL
      productFilters.selectCategory(category);
      productFilters.selectLocation(location);

      // Set subcategory if found
      const foundSubcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);
      if (foundSubcategory) {
        productFilters.selectSubcategory(foundSubcategory);
      }
    }
  } catch (error) {
    console.error('Error loading required data:', error);
  }
};

// Refetch products when URL parameters or attribute filters change
watch([
  () => route.query.subcategory,
  () => route.query.query,
  selectedAttributes
], fetchProducts, { immediate: true });

// No need to handle subcategory_id, category_id, or location_id in query params anymore

const headingName = computed(() => {
  if (search.value) {
    return `Search results for ${route.query.query}`;
  }

  // Get subcategory name from URL and store
  const subcategorySlug = route.query.subcategory;
  if (subcategorySlug) {
    const subcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);
    if (subcategory) {
      return subcategory.name;
    }
  }

  return 'Products';
});

// Use the new marketplace breadcrumbs composable
const { productsBreadcrumbs, searchBreadcrumbs } = useMarketplaceBreadcrumbs()

const breadcrumbItems = computed(() => {
  // Use search breadcrumbs if this is a search page
  if (route.query.query) {
    return searchBreadcrumbs.value
  }
  // Otherwise use products breadcrumbs
  return productsBreadcrumbs.value
})
// Pagination functions
const prev = () => {
  // Implement previous page logic
  console.log('Previous page');
};

const next = () => {
  // Implement next page logic
  console.log('Next page');
};
</script>