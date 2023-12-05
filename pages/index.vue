<script setup>
import { onMounted, ref } from "vue";

const searchBox = ref(false);
const search_button_hovered = ref(false);
const toggleSearch = () => {
  searchBox.value = !searchBox.value;
  search_button_hovered.value = !search_button_hovered.value;
}
const isLoading = ref(false)
let categories = []
const getSomeCategories = async () => {

  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')

  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/categories/7', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        categories = useState('somecategories', () => res.response._data).value
        isLoading.value = true
      }
    },
  })
};
onMounted(() => {
  isLoading.value = false
  getSomeCategories();
})
</script>
<template>
  <div class="select-none">
    <Search @toggleSearchBox="toggleSearch()" :searchBoxState="searchBox" />
    <header>
      <NavigationNavBar :keep_button_hovered="search_button_hovered" @toggleSearchBox="toggleSearch()"/>
      <div class="py-36 lg:py-48 2xl:py-56 hero-bg grid place-items-center">
        <Container class="flex justify-between w-full">
          <div class="w-full md:w-2/3 lg:w-1/2">
            <UiTypographyH1 class="mb-2">Bring Your Dream <br> Home To Life</UiTypographyH1>
            <UiTypographyP>Find inspiration, products and the pros to make it happen <br> — all in one place</UiTypographyP>

            <div class="flex gap-5 mt-5 items-center">
              <UiButtonsPrimary @clicked="$router.push({name: 'marketplace'})">Explore Our Store</UiButtonsPrimary>
              <UiButtonsSecondary class="hidden md:block">Hire Artisans</UiButtonsSecondary>
            </div>
          </div>

          <div class="w-full hidden md:w-1/3 lg:w-1/2 h-full md:block py-20"></div>
        </Container>

      </div>
    </header>

    <section>
      <CarouselsTopProducts  />
    </section>

    <section class="bg-primary bg-opacity-10">
      <Container class="max-w-7xl mx-auto lg:flex items-center justify-center gap-10">
        <div class="flex flex-col gap-6">
          <UiTypographyH2>A whole world of home decor talent at your fingertips</UiTypographyH2>

          <div>
            <UiTypographyH3 class="flex items-center gap-3 mb-2">
              <span> <img src="/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
              The best for every budget
            </UiTypographyH3>
            <UiTypographyP>Find high-quality services at every price point. No hourly rates, just project-based pricing.</UiTypographyP>
          </div>

          <div>
            <UiTypographyH3 class="flex items-center gap-3 mb-2">
              <span> <img src="/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
              Quality work done quickly
            </UiTypographyH3>
            <UiTypographyP>Find the right freelancer to begin working on your project within minutes.</UiTypographyP>
          </div>

          <div>
            <UiTypographyH3 class="flex items-center gap-3 mb-2">
              <span> <img src="/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
              Protected payments, every time
            </UiTypographyH3>
            <UiTypographyP>Always know what you'll pay upfront. Your payment isn't released until you receive the product or approve the work.</UiTypographyP>
          </div>

          <div>
            <UiTypographyH3 class="font-medium text-lg text-secondary flex items-center gap-3 mb-2">
              <span> <img src="/images/icons/checked_circle.svg" class="w-7 h-7" alt=""> </span> 
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
      </Container>
    </section>

    <Container>
      <UiTypographyH2 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Browse by Rooms</UiTypographyH2>
      <CarouselsMarketplace />
    </Container>

    <Container  class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-primary bg-opacity-10 p-4 grid place-items-center text-left">
        <div>
          <UiTypographyH2>Explore our categories</UiTypographyH2>
          <UiTypographyP>Find the products you want easily</UiTypographyP>
        </div>
      </div>
      <ul v-if="isLoading" class="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <li v-for="item in categories" :key="item.id" class="">
          <LazyUiButtonsTertiary :flexdisplay="true" @clicked="$router.push({name: 'marketplace-products', query: {category : item.name}})" >{{ item.name }}</LazyUiButtonsTertiary>
        </li>
        <li class="col-span-2 lg:col-span-1">
          <NuxtLink to="marketplace/categories" class="flex w-full text-center py-2 px-5 text-secondary font-medium text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md border hover:text-primary hover:border-primary focus:border-primary focus:text-primary outline-none items-center gap-3 hover:gap-5">
            See All
            <span><UiIconsAccordion class="w-3 rotate-90" /></span>
          </NuxtLink>
        </li>
      </ul>
      <div v-else class="col-span-2 flex items-center justify-center">
        <UiIconsLoading class="text-primary h-10 w-10"  />
      </div>
    </Container>

    <Container>
      <UiTypographyH2 class="text-secondary text-2xl md:text-3xl 2xl:text-4xl font-medium">Get inspired by our projects</UiTypographyH2>
      <CarouselsProjects />
    </Container>

    <NavigationFooter />
  </div>
</template>
<style>
.hero-bg {
  background: url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
</style>