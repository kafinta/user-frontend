<template>
  <LayoutsDashboard mode="buyer" page_title="Cart">
    <ul class="grid gap-8 lg:grid-cols-2 2xl:grid-cols-3">
      <li v-for="item in 10" class="bg-accent-100 rounded-md h-72"></li>
    </ul>
  </LayoutsDashboard>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
});

useHead({
  title: 'Shopping Cart | Kafinta',
  meta: [
    { name: 'description', content: 'View and manage items in your shopping cart' }
  ]
});

const username = 'Quadri';
const button_width = true;
const categories = [
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
      ];
</script>

<style>

</style>