<template>
  <div class="select-none">
    <Search @toggleSearchBox="toggleSearch()" :searchBoxState="searchBox" />
    <header>
      <NavigationNavBar :keep_button_hovered="search_button_hovered" @toggleSearchBox="toggleSearch()"/>
      <div class="py-36 lg:py-48 2xl:py-56 hero-bg grid place-items-center px-6 md:px-8 lg:px-10">
        <div class="mx-auto max-w-7xl w-full flex justify-between">
          <div class="w-full md:w-2/3 lg:w-1/2">
            <UiTypographyH1 class="mb-2">Bring Your Dream <br> Home To Life</UiTypographyH1>
            <UiTypographyP>Find inspiration, products and the pros to make it happen <br> — all in one place</UiTypographyP>

            <div class="flex gap-5 mt-5 items-center">
              <UiButtonsPrimary @clicked="$router.push({name: 'marketplace'})">Explore Our Store</UiButtonsPrimary>
              <UiButtonsSecondary class="hidden md:block">Hire Artisans</UiButtonsSecondary>
            </div>
          </div>

          <div class="w-full hidden md:w-1/3 lg:w-1/2 h-full md:block py-20"></div>
        </div>

      </div>
    </header>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto">
      <div>
        <UiTypographyH2>Browse by Categories</UiTypographyH2>
        <CarouselsProfessionals />
      </div>
    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 bg-primary bg-opacity-10 ">
      <div class="max-w-7xl mx-auto lg:flex items-center justify-center gap-10">
        <div class="flex flex-col gap-6">
        <UiTypographyH2>A whole world of home decor talent at your fingertips</UiTypographyH2>

        <div>
          <UiTypographyH3 class="flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            The best for every budget
          </UiTypographyH3>
          <UiTypographyP>Find high-quality services at every price point. No hourly rates, just project-based pricing.</UiTypographyP>
        </div>

        <div>
          <UiTypographyH3 class="flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            Quality work done quickly
          </UiTypographyH3>
          <UiTypographyP>Find the right freelancer to begin working on your project within minutes.</UiTypographyP>
        </div>

        <div>
          <UiTypographyH3 class="flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            Protected payments, every time
          </UiTypographyH3>
          <UiTypographyP>Always know what you'll pay upfront. Your payment isn't released until you receive the product or approve the work.</UiTypographyP>
        </div>

        <div>
          <UiTypographyH3 class="font-medium text-lg text-secondary flex items-center gap-3 mb-2">
            <span> <img src="@/assets/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
            24/7 support
          </UiTypographyH3>
          <UiTypographyP>Questions? Our round-the-clock support team is available to help anytime, anywhere.</UiTypographyP>
        </div>
      </div>

      <figure class="w-full md:min-w-1/2 lg:ml-10 mt-10">
        <video controls preload="metadata">
          <source
            src="https://res.cloudinary.com/dslsh7dej/video/upload/v1677841120/kafinta/office_nronxi.mp4"
            type="video/mp4" />
        </video>
      </figure>
      </div>

    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto">
      <UiTypographyH2 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Browse by Rooms</UiTypographyH2>
      <CarouselsMarketplace />
    </section>

    <section class="px-6 md:px-8 lg:px-10 py-10 lg:py-20 max-w-7xl mx-auto">
      <UiTypographyH2 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Get inspired by our projects</UiTypographyH2>
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