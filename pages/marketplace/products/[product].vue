<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div v-if="isLoading || product" class="grid lg:grid-cols-5 gap-10 relative">
        <div class="col-span-1 lg:col-span-3">
          <ProductsPageCarousel :product="product" :isLoading="isLoading" />
          <ProductsPageSidebar class="my-5 lg:hidden" :product="product" :isLoading="isLoading" />
          <hr class="lg:hidden">

          <ProductsPageDescription :product="product" :isLoading="isLoading" />
          <ProductsPageSpecifications :product="product" :attributes="attributes" :isLoading="isLoading" />
          <hr>
          <ProductsPageReview :product="product" :isLoading="isLoading" />
        </div>
        <ProductsPageSidebar class="lg:block hidden" :product="product" :isLoading="isLoading" />
      </div>

      <div v-if="error || !product" class="text-center py-12 flex flex-col items-center justify-center">
        <div class="rounded-full p-4 flex items-center justify-center mb-4 bg-red-200 w-20 h-20">
          <UiIconsError class="w-16 h-16 text-red-600" />
        </div>
        <UiTypographyP class="text-red-600 mb-2">{{ error }}</UiTypographyP>
        <UiButtonsPrimary :url="{ name: 'marketplace-products' }" class="mt-2">
          Back to Products
        </UiButtonsPrimary>
      </div>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductApi } from '~/composables/useProductApi';
import UiIconsError from '~/components/Ui/Icons/Error.vue';
import UiTypographyP from '~/components/Ui/Typography/P.vue';
import UiButtonsPrimary from '~/components/Ui/Buttons/Primary.vue';

useHead({
  title: 'View Product | Kafinta',
  meta: [
    { name: 'description', content: 'View detailed product information, specifications, and reviews on Kafinta marketplace' }
  ]
});

const isDesktop = ref(false);
const product = ref(null);
const attributes = ref([]);
const isLoading = ref(true);
const error = ref('');

const route = useRoute();
const productApi = useProductApi();

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

async function fetchProductAndAttributes(slug) {
  isLoading.value = true;
  error.value = '';
  product.value = null;
  attributes.value = [];
  try {
    const res = await productApi.getProductBySlug(slug);
    if (res && res.status === 'success' && res.data) {
      product.value = res.data;
      // Fetch attributes
      try {
        const attrRes = await useCustomFetch(`/api/products/${product.value.id}/attributes`, { method: 'GET' });
        if (attrRes && attrRes.status === 'success') {
          attributes.value = attrRes.data;
        }
      } catch (e) {
        // Attributes are optional, don't block page
        attributes.value = [];
      }
    } else {
      error.value = res?.message || 'Product not found.';
    }
  } catch (e) {
    error.value = e?.data?.message || 'Product not found.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener('resize', handleResize);
  fetchProductAndAttributes(route.params.product);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

watch(() => route.params.product, (newSlug) => {
  if (newSlug) fetchProductAndAttributes(newSlug);
});
</script>