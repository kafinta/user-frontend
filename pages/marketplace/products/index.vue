<template>
  <LayoutsMarketplace class="px-4 sm:px-6 relative">
    <UiTypographyH2 v-if="search">Search results for <b>{{$route.query.query}}</b></UiTypographyH2>
    <UiTypographyH2 v-else>Browse <b>{{$route.query.query}}</b></UiTypographyH2>
    <div class="flex justify-between items-center">
      <UiButtonsPrimary @clicked="openDialog=true" class="lg:hidden">
        <div class="flex gap-5">
          <p>Filters</p>
          <UiIconsFilter class="w-5 flex m-0" />
        </div>
      </UiButtonsPrimary>
    </div>

    <div class="mt-10 relative flex flex-col lg:flex-row">
      <!-- Fixed sidebar for filters -->
      <div class="hidden lg:block w-1/4 2xl:w-1/5">
        <div class="sticky top-20 pr-5 max-h-[calc(100vh-120px)] overflow-y-auto">
          <Filter />
        </div>
      </div>

      <!-- Main content area -->
      <div class="w-full lg:w-3/4 2xl:w-4/5">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
          <ProductsCard v-for="item in 30" :key="item" />
        </div>
        <div class="divide-x divide-white mt-10 justify-center w-full flex">
          <button @click="prev" class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-l-md hover:bg-accent-400 duration-300 ease-in-out">
            <UiIconsArrow class="w-4"/>
          </button>
          <button v-for="item in 5" :key="item" ref="pagination" class="text-white bg-secondary h-10 w-10 grid place-items-center">
            {{ item }}
          </button>
          <button @click="next" class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-r-md hover:bg-accent-400 duration-300 ease-in-out">
            <UiIconsArrow class="w-4 rotate-180"/>
          </button>
        </div>
      </div>
    </div>

    <ModalsDrawer okText="Apply" :scrollable="true" :footerButtons="true" :openDialog="openDialog" @closeDialog="openDialog=false">
      <template #title>Filters</template>
      <div class="h-full">
        <Filter  />
      </div>
    </ModalsDrawer>
  </LayoutsMarketplace>
</template>
<script setup>
import { ref } from "vue";

const openDialog = ref(false);

// Pagination functions
const prev = () => {
  // Implement previous page logic
  console.log('Previous page');
};

const next = () => {
  // Implement next page logic
  console.log('Next page');
};
</script>