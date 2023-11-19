<template>
  <LayoutsMarketplace>
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
          <UserProductsMinimal v-for="item in 30" :key="item" />
        </div>
          <div class="join gap-1 mt-10 justify-center w-full">
            <button class="join-item btn">«</button>
            <button class="join-item btn btn-active">1</button>
            <button class="join-item btn">»</button>
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

const selectCategory = () => {
  
}

onMounted(() => {
  // categoryLoaded.value = false
})
</script>