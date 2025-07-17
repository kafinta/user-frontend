<template>
  <LayoutsMarketplace class="px-4 sm:px-6 relative">
    <div class="flex justify-between items-center flex-wrap gap-6">
      <div>
        <UiTypographyH2 v-if="search">Search results for <b>{{ $route.query.query }}</b></UiTypographyH2>
        <UiTypographyH2 v-else>Browse {{ productFilters.selectedSubcategoryDetails?.name || 'Products' }}</UiTypographyH2>
        <UiBreadcrumbs :model="breadcrumbItems" />
      </div>

      <div class="flex gap-2 lg:flex-col justify-stretch items-end">
        <UiButtonsPrimary :url="{ name: 'marketplace-subcategories' }">Change subcategory</UiButtonsPrimary>
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
        <!-- Product grid -->
        <ul class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
          <template v-if="isLoading">
            <ProductsCard v-for="n in 8" :key="`skeleton-${n}`" :skeleton="true" />
          </template>
          <template v-else>
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
          </template>
        </ul>
        <!-- Error state -->
        <div v-if="!isLoading && !hasProducts" class="text-center py-12 flex flex-col items-center justify-center">
          <div class="rounded-full p-4 flex items-center justify-center mb-4 bg-red-200 w-20 h-20">
            <UiIconsError class="w-16 h-16 text-red-600" />
          </div>
          <UiTypographyP class="text-red-600 mb-2">{{ error }}</UiTypographyP>
        </div>
        <!-- Pagination placeholder -->
        <div class="divide-x divide-white mt-10 justify-center w-full flex">
          <button @click="prev" class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-l-md hover:bg-accent-400 duration-300 ease-in-out">
            <UiIconsArrow class="w-4"/>
          </button>
          <button v-for="item in 5" :key="item" ref="pagination" class="text-white bg-secondary h-10 w-10 grid place-items-center">
            {{ item }}
          </button>
          <button @click="next" class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-r-md hover:bg-accent-400 duration-300 ease-in-out">
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

const fetchProducts = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    const params = new URLSearchParams();
    params.append('per_page', 30);
    if (productFilters.selectedSubcategory?.id) {
      params.append('subcategory_id', productFilters.selectedSubcategory.id);
    }
    if (productFilters.selectedCategory?.id) {
      params.append('category_id', productFilters.selectedCategory.id);
    }
    if (productFilters.selectedLocation?.id) {
      params.append('location_id', productFilters.selectedLocation.id);
    }
    if (route.query.query) {
      params.append('search', route.query.query);
    }
    // Add attribute filters
    for (const [attrName, attrObj] of Object.entries(selectedAttributes.value)) {
      if (attrObj && attrObj.name) {
        params.append(`attributes[${attrName}]`, attrObj.name);
      }
    }
    const res = await useCustomFetch(`/api/products?${params.toString()}`, { method: 'GET' });
    if (res && res.status === 'success' && res.data && res.data.data) {
      products.value = res.data.data;
    } else {
      error.value = res?.message || 'Failed to load products.';
    }
  } catch (e) {
    error.value = e?.data?.message || 'Failed to load products.';
  } finally {
    isLoading.value = false;
  }
};

// Refetch products when subcategory, search input, or attribute filters change
watch([
  () => productFilters.selectedSubcategory?.id,
  () => productFilters.selectedCategory?.id,
  () => productFilters.selectedLocation?.id,
  () => route.query.query,
  selectedAttributes
], fetchProducts, { immediate: true });

onMounted(() => {
  const subcategoryId = route.query.subcategory_id;
  if (subcategoryId && (!productFilters.selectedSubcategory || productFilters.selectedSubcategory.id != subcategoryId)) {
    // Find the full subcategory object from the filters store
    const subcat = filtersStore.subcategories.find(s => s.id === Number(subcategoryId));
    if (subcat) productFilters.selectSubcategory(subcat);
  }
});

watch(
  () => route.query.subcategory_id,
  (newId) => {
    if (newId && (!productFilters.selectedSubcategory || productFilters.selectedSubcategory.id != newId)) {
      const subcat = filtersStore.subcategories.find(s => s.id === Number(newId));
      if (subcat) productFilters.selectSubcategory(subcat);
    }
  }
);

// Only redirect if there is truly no subcategory and no search (and not after user has selected one)
watchEffect(() => {
  if (!productFilters.selectedSubcategory && !route.query.query) {
    router.replace('/marketplace/categories');
  }
});

const breadcrumbItems = computed(() => {
  const items = [];
  // Add category to breadcrumb if selected
  if (productFilters.selectedCategory) {
    items.push({
      label: productFilters.selectedCategory.name,
      route: '/marketplace/categories'
    });
  }
  // Add location to breadcrumb if selected
  if (productFilters.selectedLocation) {
    items.push({
      label: productFilters.selectedLocation.name,
      route: '/marketplace/locations'
    });
  }
  // Add current page (Subcategories)
  items.push({
    label: productFilters.selectedSubcategoryDetails?.name,
    active: true
  });
  return items;
});
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