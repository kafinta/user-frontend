<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div class="grid lg:grid-cols-5 gap-10 relative">
        <div class="col-span-1 lg:col-span-3">
          <ProductsPageCarousel />
          <ProductsPageSidebar v-if="!isDesktop" class="my-5" />
          <hr class="lg:hidden">

          <ProductsPageDescription />
          <ProductsPageSpecifications />
          <hr>
          <ProductsPageReview  />
        </div>
        <ProductsPageSidebar v-if="isDesktop"/>
      </div>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'View Product | Kafinta',
  meta: [
    { name: 'description', content: 'View detailed product information, specifications, and reviews on Kafinta marketplace' }
  ]
});

import { ref, onMounted, onBeforeUnmount } from 'vue';

const isDesktop = ref(false);
const review = ref(3.5);
const review_count = ref(50);

const handleResize = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  isDesktop.value = window.innerWidth >= 1024;
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>