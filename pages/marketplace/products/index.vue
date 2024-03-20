<template>
  <LayoutsMarketplace class="px-4 sm:px-6">
    <UiTypographyH2>Search results for <b>{{$route.query.query}}</b></UiTypographyH2>
    <div class="flex justify-between items-center">
      <UiButtonsPrimary @clicked="openDialog=true" class="lg:hidden">
        <div class="flex gap-5">
          <p>Filters</p>
          <UiIconsFilter class="w-5 flex m-0" />
        </div>
      </UiButtonsPrimary>
    </div>

    <div class="grid lg:grid-cols-4 2xl:grid-cols-5 gap-5 mt-10">

      <Filter class="hidden lg:block"/>
      <div class="lg:col-span-3 2xl:col-span-4 w-full">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
          <ProductsCard v-for="item in 30" :key="item" />
        </div>
          <div class="divide-x divide-white mt-10 justify-center w-full flex">
            <button @click="prev" class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-l-md hover:bg-accent-400 duration-300 ease-in-out"><UiIconsArrow class="w-4"/></button>
            <button v-for="item in 5" ref="pagination" class="text-white bg-secondary h-10 w-10 grid place-items-center">{{ item }}</button>
            <button @click="next" class="text-white bg-secondary h-10 w-10 grid place-items-center rounded-r-md hover:bg-accent-400 duration-300 ease-in-out"><UiIconsArrow class="w-4 rotate-180"/></button>
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
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
const openDialog = ref(false)
const pagination_btns = ref.pagination
</script>