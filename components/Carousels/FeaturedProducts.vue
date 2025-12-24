<template>
  <section class="featured-products-carousel">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <UiIconsLoading class="w-8 h-8 text-primary animate-spin" />
    </div>

    <!-- Products carousel -->
    <Splide
      v-else-if="products.length > 0"
      :options="splideOptions"
      class="featured-products-splide"
    >
      <SplideSlide v-for="product in products" :key="product.id">
        <div class="carousel-item-wrapper">
          <ProductsCard
            :slug="product.slug"
            :name="product.name"
            :price="product.price"
            :image="product.image"
            :rating="product.rating"
            :reviewCount="product.reviewCount"
            :salesCount="product.salesCount"
          />
        </div>
      </SplideSlide>
    </Splide>

    <!-- Error state -->
    <div v-else class="text-center mt-8 py-12">
      <div class="max-w-md mx-auto space-y-6">
        <div class="w-20 h-20 mx-auto bg-red-200 rounded-full flex items-center justify-center">
          <UiIconsError class="w-16 h-16 text-red-600" />
        </div>
        <div>
          <UiTypographyH3 class="text-secondary font-medium mb-2">
            {{ error || 'No featured products available' }}
          </UiTypographyH3>
          <UiTypographyP v-if="!error" class="text-accent-500 text-sm">
            Check back later for new products.
          </UiTypographyP>
        </div>
        <button
          @click="fetchProducts"
          class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductsCarousel } from '~/composables/useProductsCarousel'
import UiIconsError from '~/components/Ui/Icons/Error.vue'

const { products, isLoading, error, fetchProducts } = useProductsCarousel({
  endpoint: '/api/products/featured'
})

const splideOptions = {
  type: 'slide',
  perPage: 4,
  gap: '1rem',
  pagination: false,
  arrows: true,
  breakpoints: {
    640: { perPage: 1 },
    768: { perPage: 2 },
    1024: { perPage: 3 },
    1280: { perPage: 4 }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.featured-products-carousel {
  width: 100%;
}

.carousel-item-wrapper {
  height: 100%;
  display: flex;
  align-items: stretch;
}
</style>

