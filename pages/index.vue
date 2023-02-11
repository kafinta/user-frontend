<template>
  <div class="select-none">
    <Search @toggleSearchBox="toggleSearch()" :searchBoxState="searchBox" />
    <section>
      <NavigationHeader :keep_button_hovered="search_button_hovered" @toggleSearchBox="toggleSearch()" class="fixed z-100 top-0 w-full"></NavigationHeader>
      <div class="py-36 lg:h-screen hero-bg items-center px-6 md:px-8 lg:px-10 flex">
        <div class="w-full md:w-2/3 lg:w-1/2 max-w-7xl">
          <h1 class="text-secondary text-5xl md:text-6xl 2xl:text-8xl font-bold">Bring Your Dream Home To Life</h1>
          <p class="text-secondary text-base 2xl:text-xl mt-2">Find inspiration, products and the pros to make it happen — all in one place</p>

          <div class="flex gap-5 mt-5 items-center">
            <UiButtonsPrimary>Explore Our Store</UiButtonsPrimary>
            <UiButtonsSecondary class="hidden md:block">Hire Artisans</UiButtonsSecondary>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto">
      <div>
        <h3 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Popular professional services</h3>
        <CarouselsProfessionals />
      </div>
    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto bg-primary bg-opacity-5 lg:flex items-center justify-center gap-10">
      <div class="flex flex-col gap-6">
        <h3 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">A whole world of home decor talent at your fingertips</h3>

        <div>
          <h6 class="font-medium text-lg text-secondary flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            The best for every budget
          </h6>
          <p class="text-sm text-secondary xl:text-base">Find high-quality services at every price point. No hourly rates, just project-based pricing.</p>
        </div>

        <div>
          <h6 class="font-medium text-lg text-secondary flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            Quality work done quickly
          </h6>
          <p class="text-sm text-secondary xl:text-base">Find the right freelancer to begin working on your project within minutes.</p>
        </div>

        <div>
          <h6 class="font-medium text-lg text-secondary flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            Protected payments, every time
          </h6>
          <p class="text-sm text-secondary xl:text-base">Always know what you'll pay upfront. Your payment isn't released until you receive the product or approve the work.</p>
        </div>

        <div>
          <h6 class="font-medium text-lg text-secondary flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            24/7 support
          </h6>
          <p class="text-sm text-secondary xl:text-base">Questions? Our round-the-clock support team is available to help anytime, anywhere.</p>
        </div>
      </div>

      <figure class="w-full md:min-w-1/2 lg:ml-10 mt-10">
        <video controls preload="metadata">
          <source
            src="@/assets/videos/office.mp4"
            type="video/mp4" />
        </video>
      </figure>
    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto">
      <h3 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Explore the marketplace</h3>
      <CarouselsMarketplace />
    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto">
      <h3 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Get inspired with projects made by our professionals</h3>
      <CarouselsProjects />
    </section>

    <NavigationFooter />
  </div>
</template>

<script>
export default {
  data(){
    return {
      searchBox: false,
      search_button_hovered: false,
    }
  },

  methods: {
    toggleSearch(){
      this.searchBox = !this.searchBox
      this.search_button_hovered = !this.search_button_hovered
    }
  },
}
</script>

<style>
.hero-bg {
  background: url('../assets/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
</style>