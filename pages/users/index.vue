<template>
  <div>
    <div class="flex items-end gap-16">
      <div class="h-72 w-1/4 bg-secondary bg-opacity-5 lg:flex items-center justify-center p-7 hidden">
        <div>
          <h5 class="text-center text-lg font-medium">Hi, {{ username }}</h5>
          <p class="text-center text-base font-normal mt-2">Get matched with artisans for your project.</p>
          <div class="w-full mt-6">
            <UiButtonsPrimary class="mt-6 mx-auto">Post a Request</UiButtonsPrimary>
          </div>
        </div>
      </div>

      <div class="flex px-5 bg-secondary bg-opacity-5 w-full lg:w-3/4 h-72" ></div>
    </div>

    <div class="mt-10">
      <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Recommended services for your first project</h3>
      <CarouselsProjects />
    </div>

    <div class="mt-10 lg:hidden">
      <div class="flex items-center justify-between">
        <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Top Categories</h3>
        <UiButtonsSecondary class="flex gap-1 items-center">
          See All
          <UiIconsAccordion class="transform rotate-90 w-4 h-4" />
        </UiButtonsSecondary>
      </div>
      <div class="grid grid-cols-1 gap-3 mt-6">
        <div class="p-5 flex gap-5 border border-secondary border-opacity-20 items-center rounded-lg" v-for="category in categories" :key="category.id">
          <div class="bg-primary h-20 w-20 rounded-full flex items-center justify-center">
            <img class="w-14 h-14" alt="" :src="category.imagePath" />
          </div>

          <div>
            <h3 class="text-secondary text-lg font-medium">{{ category.title }}</h3>
            <p class="text-secondary text-sm mt-0">{{ category.products }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Products you may like</h3>
      <CarouselsProjects />
    </div>

    <div class="mt-10 bg-primary bg-opacity-5">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: 'Quadri',
      button_width: true,
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

<style>

</style>