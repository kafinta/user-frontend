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
              <template v-if="search">
                No products match your search for "<b>{{ $route.query.query }}</b>". Try different keywords or browse categories.
              </template>
              <template v-else>
                We couldn't find any products in this category. Try adjusting your filters or browse other categories.
              </template>
            </UiTypographyP>
            <div class="flex gap-3">
              <UiButtonsSecondary @clicked="clearFilters">
                {{ search ? 'Clear Search' : 'Clear Filters' }}
              </UiButtonsSecondary>
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
              :rating="product.average_rating || product.rating"
              :reviewCount="product.review_count || product.reviews_count || 0"
              :salesCount="product.sales_count || 0"
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
            v-for="page in pageNumbers"
            :key="page"
            @click="onPageChanged(page)"
            :disabled="isLoading || page === currentPage"
            class="text-white h-10 w-10 grid place-items-center hover:bg-accent-400 duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            :class="page === currentPage ? 'bg-accent-400' : 'bg-secondary'"
          >
            {{ page }}
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
<script setup lang="ts">
useHead({
  title: 'Browse Products | Kafinta',
  meta: [
    { name: 'description', content: 'Browse and shop products from various categories on Kafinta marketplace' }
  ]
});

import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { LocationQuery } from "vue-router";
import { useProductFilters } from "@/composables/useProductFilters";
import { useFiltersStore } from '~/stores/filters';
import { useMarketplaceBreadcrumbs } from '@/composables/useMarketplaceBreadcrumbs';
import { useProductsApi } from '~/composables/useProductsApi';

interface ProductFilterInput {
  query?: string;
  location_id?: string | number;
  min_price?: string | number;
  max_price?: string | number;
  attributes?: Record<string, string>;
}

interface ProductsApiResponse {
  status?: string;
  message?: string;
  data?: unknown;
}

const route = useRoute();
const router = useRouter();
const filtersStore = useFiltersStore();
const productFilters = useProductFilters();
const productsApi = useProductsApi();
const { products, pagination, filters: apiFilters, isLoading, error, fetchProducts: fetchProductsApi } = productsApi;
const openDialog = ref(false);
const selectedAttributes = ref({});
const isBootstrapping = ref(true);

const search = computed(() => route.query.query ? String(route.query.query) : '');
const currentPage = computed(() => Number(route.query.page || 1));
const hasProducts = computed(() => products.value && products.value.length > 0);

function parseAttributesFromQuery(query: LocationQuery) {
  const selected: Record<string, string> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (typeof key === 'string' && key.startsWith('attributes[') && typeof value === 'string') {
      const attributeName = key.replace(/^attributes\[(.*)\]$/, '$1');
      selected[attributeName] = value;
    }
  });
  return selected;
}

function buildQueryFromFilters(filters: ProductFilterInput) {
  const query: Record<string, any> = {
    ...route.query,
    page: 1
  };

  // Always preserve the current category/subcategory context
  if (route.query.category) query.category = route.query.category;
  if (route.query.subcategory) query.subcategory = route.query.subcategory;

  // Search
  if (filters.query) query.query = filters.query;
  else delete query.query;

  // Location filter
  if (filters.location_id) query.location_id = filters.location_id;
  else delete query.location_id;

  // Price filters
  if (filters.min_price) query.min_price = filters.min_price;
  else delete query.min_price;
  if (filters.max_price) query.max_price = filters.max_price;
  else delete query.max_price;

  // Remove old attribute filters
  Object.keys(query).forEach((key) => {
    if (key.startsWith('attributes[')) {
      delete query[key];
    }
  });

  if (filters.attributes) {
    Object.entries(filters.attributes).forEach(([attributeName, value]) => {
      if (value) {
        query[`attributes[${attributeName}]`] = value;
      }
    });
  }

  return query;
}

async function onFilterChanged(filters: ProductFilterInput) {
  const query = buildQueryFromFilters(filters);
  await router.push({ query });
}

async function onPageChanged(page: number) {
  const query = { ...route.query, page };
  await router.push({ query });
}

function getInitialFilters() {
  return {
    query: search.value,
    location_id: route.query.location_id || '',
    min_price: route.query.min_price || '',
    max_price: route.query.max_price || '',
    attributes: parseAttributesFromQuery(route.query)
  };
}

function clearFilters() {
  const query = {
    ...(route.query.category ? { category: route.query.category } : {}),
    ...(route.query.subcategory ? { subcategory: route.query.subcategory } : {})
  };
  return router.push({ query });
}

async function retryFetch() {
  await loadProducts(true);
}

const loadProducts = async (ensureData = true) => {
  isLoading.value = true;
  error.value = '';

  try {
    const params: Record<string, any> = {
      per_page: 30,
      page: currentPage.value
    };

    if (search.value) {
      params.search = search.value;
    }

    if (!search.value && !route.query.subcategory) {
      products.value = [];
      pagination.value = null;
      return;
    }

    if (ensureData && route.query.subcategory) {
      await ensureDataLoaded();

      const subcategorySlug = String(route.query.subcategory);
      const subcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);
      if (subcategory) {
        params.subcategory_id = subcategory.id;
      } else {
        // Could not resolve subcategory slug to an ID from the store.
        // Continue without subcategory_id so the API can still return available filters.
        console.warn('Subcategory slug not found in store:', subcategorySlug);
      }
    }

    if (route.query.location_id) {
      params.location_id = route.query.location_id;
    } else if (route.query.location) {
      const locationSlug = String(route.query.location);
      const location = filtersStore.locations.find(l => l.slug === locationSlug);
      if (location) {
        params.location_id = location.id;
      }
    }

    if (route.query.min_price) {
      params.min_price = route.query.min_price;
    }
    if (route.query.max_price) {
      params.max_price = route.query.max_price;
    }

    const attributes = parseAttributesFromQuery(route.query);
    Object.entries(attributes).forEach(([name, value]) => {
      params[`attributes[${name}]`] = value;
    });

    const response = await fetchProductsApi(params) as ProductsApiResponse | undefined;
    if (!response || response.status !== 'success') {
      error.value = response?.message || 'Unable to load products at this time.';
    }
  } catch (e: unknown) {
    console.error('Error loading products:', e);
    const err = e as { data?: { message?: string }; message?: string };
    if (err?.data?.message) {
      error.value = err.data.message;
    } else if (err?.message) {
      error.value = err.message;
    } else {
      error.value = 'Network error. Please check your connection and try again.';
    }
    products.value = [];
    pagination.value = null;
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

  await loadProducts(true);
  isBootstrapping.value = false;
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

      // Load subcategory details for the filter sidebar without re-syncing the route.
      const foundSubcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug);
      if (foundSubcategory && typeof productFilters.fetchSubcategoryDetails === 'function') {
        await productFilters.fetchSubcategoryDetails(foundSubcategory.id);
      }
    }
  } catch (error) {
    console.error('Error loading required data:', error);
  }
};

// Refetch products when URL parameters or attribute filters change
watch(
  () => route.query,
  async () => {
    if (isBootstrapping.value) return;
    await loadProducts(true);
  },
  { deep: true }
);

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
const pageNumbers = computed(() => {
  if (!pagination.value || typeof pagination.value.current_page !== 'number') {
    return [];
  }

  const current = pagination.value.current_page;
  const last = pagination.value.last_page || 1;
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  const pages = [];
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
});

const prev = async () => {
  if (!pagination.value || pagination.value.current_page <= 1) return;
  await onPageChanged(pagination.value.current_page - 1);
};

const next = async () => {
  if (!pagination.value || pagination.value.current_page >= pagination.value.last_page) return;
  await onPageChanged(pagination.value.current_page + 1);
};
</script>