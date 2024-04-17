<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div class="grid lg:grid-cols-5 gap-10">
        <div class="col-span-1 lg:col-span-3">
          <ProductsPageCarousel />
          <ProductsPageSidebar v-if="!isDesktop" /> 
        </div>
        <ProductsPageSidebar v-if="isDesktop" />
      </div>
    </Container>

  </LayoutsMarketplace>
</template>
<script>
import Glide from '@glidejs/glide'
export default {
  data(){
    return {
      isDesktop: false
    }
  },

  methods: {
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024;
    }
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