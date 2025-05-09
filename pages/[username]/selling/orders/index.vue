<template>
  <LayoutsDashboard mode="seller" page_title="Orders Overview">
    <div class="flex divide-x border w-full border-accent-200 rounded-md mb-5 overflow-x-hidden">
      <button :class="active ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary'" class="rounded-l-md px-5 py-3">Awaiting Fulfilment</button>
      <button :class="active ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary'" class="px-5 py-3">Shipped</button>
      <button :class="active ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary'" class="px-5 py-3">Delivered</button>
      <button :class="active ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary'" class="px-5 py-3">Completed</button>
      <button :class="active ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary'" class="px-5 py-3">Return Requested</button>
      <button :class="active ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary'" class="px-5 py-3 rounded-r-md">Cancelled</button>
    </div>

    <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
      <li class="rounded-2xl border border-accent-200 block" v-for="cards in 6">
        <ProductsImage class="rounded-t-2xl" />
        <div class="p-5 flex flex-col gap-5">
          <ProductsName>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</ProductsName>
          <ul class="grid grid-cols-2 gap-5">
            <li>
              <UiTypographyH3>5</UiTypographyH3>
              <UiTypographyP>Quantity</UiTypographyP>
            </li>
            <li>
              <UiTypographyH3>$9999</UiTypographyH3>
              <UiTypographyP>Price</UiTypographyP>
            </li>
            <li>
              <UiTypographyH3>{{ new Date().toLocaleDateString() }}</UiTypographyH3>
              <UiTypographyP>Date</UiTypographyP>
            </li>
            <li>
              <h3 class="text-xl md:text-2xl 2xl:text-3xl font-medium" :class="status === 'completed' ? 'text-green-600' : status === 'cancelled' ? 'text-red-600' : status === 'shipped' ? 'text-orange-500' : status === 'delivered' ? 'text-green-600' : status === 'pending' ? 'text-pink-500' : 'text-secondary'">Pending</h3>
              <UiTypographyP>Status</UiTypographyP>
            </li>
          </ul>
          <UiButtonsPrimary :flexdisplay="true">View</UiButtonsPrimary>
        </div>
      </li>
    </ul>
  </LayoutsDashboard>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true,
  requiresSeller: true
});

import { ref } from 'vue';

const image = ref('');
const status = ref('pending');
const orders = ref(10);
const active = ref(true);
</script>
<style>
th, td {
  padding: 1rem;
}
</style>