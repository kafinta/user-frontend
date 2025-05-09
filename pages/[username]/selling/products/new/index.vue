<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <div class="flex items-center">
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class=" h-10 w-10 rounded-full grid place-items-center text-secondary border border-accent-200">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class=" h-10 w-10 rounded-full grid place-items-center text-secondary border border-accent-200">3</div>
      </div>
      <UiTypographyH3>Product Details</UiTypographyH3>

      <form @submit.prevent="createProduct()" class="flex flex-col lg:grid lg:grid-cols-2 gap-6 w-full">
        <FormInput label="Product Name" placeholder="Enter the name of your product" class="col-span-2"/>
        <FormSelect label="Category" placeholder="Select the category of your product">
          <FormOptions v-for="item in 20" option="category" />
        </FormSelect>
        <FormSelect label="Subcategory" placeholder="Select the subcategory of your product">
          <FormOptions v-for="item in 20" option="subcategory" />
        </FormSelect>
        <FormSelect label="Location" placeholder="Select the location of your product" class="col-span-2">
          <FormOptions v-for="item in 20" option="location" />
        </FormSelect>
        <FormTextarea label="Description" placeholder="Write a detailed description for your product" class="col-span-2"></FormTextarea>
        <FormButton class="lg:col-span-2 w-64 mx-auto">Save & Continue</FormButton>
      </form>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true,
  requiresSeller: true
});

import { useRouter } from 'vue-router';

const router = useRouter();

function createProduct() {
  router.push({ name: 'username-selling-products-new-specifications' });
}
</script>