<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div class="mt-2">
        <div class="flex items-center justify-between">
          <div>
            <UiTypographyH3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Top Locations</UiTypographyH3>
            <UiTypographyP>Locations our users shop for the most</UiTypographyP>
          </div>
          <UiButtonsSecondary @clicked="$router.push({name: 'marketplace-locations'})" class="flex gap-1 items-center">
            See All
            <UiIconsAccordion class="transform rotate-90 w-4 h-4" />
          </UiButtonsSecondary>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3 mt-6">
          <NuxtLink :to="{name: 'marketplace-products', query: {location: category.title}}" class="p-5 flex gap-5 border border-secondary border-opacity-20 items-center rounded-lg hover:border-primary duration-300 ease-in-out" v-for="category in categories" :key="category.id">
            <div class="bg-primary h-20 w-20 rounded-full flex items-center justify-center">
              <img class="w-14 h-14" alt="" :src="category.imagePath" />
            </div>

            <div class="text-left">
              <h3 class="text-secondary text-lg font-medium">{{ category.title }}</h3>
              <p class="text-secondary text-sm mt-0">{{ category.products }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </Container>

    <div class="mt-10">
      <CarouselsTopProducts />
    </div>

    <Container :addTopBottomPadding="false">
      <div class="mt-10">
        <UiTypographyH2>Trending Categories</UiTypographyH2>
        <CarouselsProjects />
      </div>
    </Container>

  </LayoutsMarketplace>
</template>
<script>
export default {
  data() {
    return {
      username: 'Kafinta User',
      categories: [
        {
          id: 1,
          title: 'Bedroom',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1698760299/kafinta/rooms/bedroom_pw1dhq.svg',
          products: 'Beds, pillows, bedsheets, lamps...'
        },
        {
          id: 2,
          title: 'Living Room',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1698760299/kafinta/rooms/living_room_w6gxcb.svg',
          products: 'Sofas, couches, tables ...'
        },
        {
          id: 3,
          title: 'Kitchen',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1698760299/kafinta/rooms/kitchen_b7petm.svg',
          products: 'Fixtures, tables, kitchen tops...'
        },
        {
          id: 4,
          title: 'Dining',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1698760299/kafinta/rooms/dining_oaajex.svg',
          products: 'Chairs, tables, utensils...'
        },
      ]
    };
  },
}
</script>