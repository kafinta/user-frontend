<template>
  <LayoutsMarketplace>
    <div class="mt-10">
      <div class="flex items-center justify-between">
        <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Top Categories</h3>
        <UiButtonsSecondary @clicked="$router.push({name: 'marketplace-rooms', params: {rooms: 'living'}})" class="flex gap-1 items-center">
          See All
          <UiIconsAccordion class="transform rotate-90 w-4 h-4" />
        </UiButtonsSecondary>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3 mt-6">
        <button @click="$router.push({name: 'marketplace-rooms', params: {rooms: category.title}})" class="p-5 flex gap-5 border border-secondary border-opacity-20 items-center rounded-lg" v-for="category in categories" :key="category.id">
          <div class="bg-primary h-20 w-20 rounded-full flex items-center justify-center">
            <img class="w-14 h-14" alt="" :src="category.imagePath" />
          </div>

          <div class="text-left">
            <h3 class="text-secondary text-lg font-medium">{{ category.title }}</h3>
            <p class="text-secondary text-sm mt-0">{{ category.products }}</p>
          </div>
        </button>
      </div>
    </div>

    <div class="mt-10">
      <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Recommended services for your first project</h3>
      <CarouselsProjects />
    </div>

    <div class="mt-10">
      <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Products you may like</h3>
      <CarouselsProjects />
    </div>
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
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1675426589/kafinta/categories/bedroom_oexa9p.svg',
          products: 'Beds, pillows, bedsheets, lamps...'
        },

        {
          id: 2,
          title: 'Living Room',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1675426589/kafinta/categories/living_room_ecan8y.svg',
          products: 'Sofas, couches, tables ...'
        },

        {
          id: 3,
          title: 'Kitchen',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1675426589/kafinta/categories/kitchen_wjsr9r.svg',
          products: 'Racks, tables, kitchen tops...'
        },

        {
          id: 4,
          title: 'Dining',
          imagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1675426589/kafinta/categories/dining_yazb5r.svg',
          products: 'Chairs, tables, utensils...'
        },
      ]
    }
  },
}
</script>