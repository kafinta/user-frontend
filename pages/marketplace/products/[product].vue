<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div class="grid lg:grid-cols-5 gap-10">
        <div class="col-span-1 lg:col-span-3">
          <ProductsPageCarousel />
          <ProductsPageSidebar v-if="!isDesktop" class="my-5" /> 
          <hr class="lg:hidden">

          <ProductsPageDescription />
          <ProductsPageSpecifications />
          <hr>
          <ProductsPageReview  />
        </div>
        <ProductsPageSidebar v-if="isDesktop" />
      </div>
    </Container>

  </LayoutsMarketplace>
</template>
<script>
export default {
  data(){
    return {
      isDesktop: false,
      review: 3.5,
      review_count: 50
    }
  },

  methods: {
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024;
    },
  },

  mounted() {
    this.isDesktop = window.innerWidth >= 1024;
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>