<template>
  <LayoutsDashboard mode="seller" page_title="Products Overview">
    <div class="md:flex block w-full gap-5">
      <div class="w-full">
        <div class="flex justify-between items-center w-full">
          <UiTypographyP>My Products</UiTypographyP>
          <UiButtonsPrimary @clicked="$router.push({path: 'products/new'})">List a New Product</UiButtonsPrimary>
        </div>
        <ul v-if="products" class="grid lg:grid-cols-2 gap-6 place-items-center mt-6">
          <li v-for="item in 4" class="flex gap-4 border items-center border-accent-200 rounded-lg w-full p-2 h-full">
            <div class="bg-accent-200 rounded-md product w-1/3 h-full"></div>
            <div class="w-2/3 justify-between flex flex-col h-full gap-4">
              <UiTypographyH3>This is the product name</UiTypographyH3>
              <div class="flex gap-5">
                <UiButtonsSecondary class="flex items-center gap-2">
                  <UiIconsEdit class="w-5 h-5" />
                  Edit
                </UiButtonsSecondary>
                <button @click="deleteModalOpen = true" class="flex items-center gap-2 text-red-600">
                  <UiIconsDelete class="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="grid place-items-center h-full mt-6">
          <div>
            <UiTypographyH3>No item yet.</UiTypographyH3>
            <UiButtonsPrimary @clicked="$router.push({path: 'products/new'})">List a New Product</UiButtonsPrimary>
          </div>
        </div>
      </div>
    </div>

    <ModalsOverlay @closeOverlay="deleteModalOpen = false" :openOverlay="deleteModalOpen">
      <template #title>Delete Product</template>
      <UiIconsDelete class="w-24 h-24" />
      <UiTypographyP>Are you sure you want to delete this product listing? This action is irreversible!</UiTypographyP>
      <div class="flex gap-6">
        <UiButtonsPrimary @clicked="deleteModalOpen = false">Cancel</UiButtonsPrimary>
        <button @click="deleteModalOpen = false" class="text-white bg-red-600 py-2 px-5 font-medium text-base 2xl:text-lg rounded-md">Delete Anyway</button>
      </div>
    </ModalsOverlay>
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

const products = ref(true);
const deleteModalOpen = ref(false);
</script>
<style>
  .gig-img {
    width: 5rem !important;
    min-width: 5rem;
    background-color: #D3D3D3;
    aspect-ratio: 3/2;
  }
</style>