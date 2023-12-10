<template>
  <Container  class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="bg-primary bg-opacity-10 p-4 grid place-items-center text-left">
      <div>
        <UiTypographyH2>Explore our categories</UiTypographyH2>
        <UiTypographyP>Find the products you want easily</UiTypographyP>
      </div>
    </div>
    <ul v-if="isLoading" class="col-span-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <li v-for="item in categories" :key="item.id" class="">
        <LazyUiButtonsTertiary :flexdisplay="true" @clicked="$router.push({name: 'marketplace-products', query: {category : item.name}})" >{{ item.name }}</LazyUiButtonsTertiary>
      </li>
      <li class="col-span-1 md:col-span-2 lg:col-span-1">
        <NuxtLink to="marketplace/categories" class="flex w-full text-center py-2 px-5 text-secondary font-medium text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md border hover:text-primary hover:border-primary focus:border-primary focus:text-primary outline-none items-center gap-3 hover:gap-5">
          See All
          <span><UiIconsAccordion class="w-3 rotate-90" /></span>
        </NuxtLink>
      </li>
    </ul>
    <div v-else class="col-span-2 flex items-center justify-center">
      <UiIconsLoading class="text-accent-100 h-10 w-10"  />
    </div>
  </Container>
</template>
<script>
import { useCategoriesStore } from '../stores/categories'
import { mapActions } from 'pinia'
export default {
  data(){
    return {
      isLoading: false
    }
  },

  methods: {
    ...mapActions(useCategoriesStore, { test: 'getSomeCategories' }),
  },
  
  mounted(){
    this.test()
  },
}
</script>