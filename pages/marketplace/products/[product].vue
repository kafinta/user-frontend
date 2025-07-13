<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div v-if="isLoading || product" class="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
        <!-- Left: Product Image Carousel -->
        <div>
          <ProductsPageCarousel :product="product" :isLoading="isLoading" class="relative lg:sticky lg:top-24" />
        </div>
        <!-- Right: Product Details and Tabs (sticky on desktop) -->
        <div ref="stickyRef" class="lg:sticky lg:top-24">
          <div class="mb-6">
            <ProductsPageSidebar :product="product" :isLoading="isLoading" />
          </div>
          <div class="border-b border-accent-200 flex gap-2 mb-4 bg-white z-10">
            <button v-for="tab in tabs" :key="tab.key"
              @click="handleTabClick(tab.key)"
              :class="['px-4 py-2 font-medium', activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-secondary']">
              {{ tab.label }}
            </button>
            <button @click="scrollToSection('reviews')" class="px-4 py-2 font-medium text-secondary">Reviews</button>
          </div>
          <div>
            <div v-show="activeTab === 'description'">
              <ProductsPageDescription :product="product" :isLoading="isLoading" />
            </div>
            <div v-show="activeTab === 'specs'">
              <ProductsPageSpecifications :product="product" :attributes="attributes" :isLoading="isLoading" />
            </div>
          </div>
        </div>
      </div>
      <!-- Full-width Reviews below -->
      <section ref="reviewsRef" id="reviews" class="py-8">
        <ProductsPageReview :product="product" :isLoading="isLoading" />
      </section>
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
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useProductApi } from '~/composables/useProductApi';
import UiIconsError from '~/components/Ui/Icons/Error.vue';
import UiTypographyP from '~/components/Ui/Typography/P.vue';
import UiButtonsPrimary from '~/components/Ui/Buttons/Primary.vue';
import ProductsPageCarousel from '~/components/Products/Page/Carousel.vue';
import ProductsPageSidebar from '~/components/Products/Page/Sidebar.vue';
import ProductsPageDescription from '~/components/Products/Page/Description.vue';
import ProductsPageSpecifications from '~/components/Products/Page/Specifications.vue';
import ProductsPageReview from '~/components/Products/Page/Review/Index.vue';

const tabs = [
  { key: 'description', label: 'Description' },
  { key: 'specs', label: 'Specifications' },
];
const activeTab = ref('description');
const stickyRef = ref(null);
const reviewsRef = ref(null);

const product = ref(null);
const attributes = ref([]);
const isLoading = ref(true);
const error = ref('');

const route = useRoute();
const productApi = useProductApi();

function handleTabClick(key) {
  activeTab.value = key;
}
function scrollToSection(section) {
  nextTick(() => {
    let el = null;
    if (section === 'reviews') el = reviewsRef.value;
    if (el) {
      // Height of sticky nav/header (adjust as needed)
      const yOffset = -96; // e.g., 96px for header + some margin
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}

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
  fetchProductAndAttributes(route.params.product);
});

onBeforeUnmount(() => {
  // No resize listener needed
});

watch(() => route.params.product, (newSlug) => {
  if (newSlug) fetchProductAndAttributes(newSlug);
});
</script>