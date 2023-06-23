<template>
  <nuxt-link to="/" target="_blank" class="group hover:border-accent-300 duration-500 transition cursor-pointer border border-accent-100 p-2 grid grid-cols-3 lg:grid-cols-9 lg:gap-5 items-center h-fit">
    <div class="bg-accent-100 aspect-[3/2] w-full col-span-1 m-0"></div>
    <UiTypographyP class="col-span-2 lg:col-span-4">{{ product_name }}</UiTypographyP>
    <UiTypographyP class="col-span-1 hidden lg:block">{{ product_impressions }}</UiTypographyP>
    <UiTypographyP class="col-span-1 hidden lg:block">{{ product_clicks }}</UiTypographyP>
    <UiTypographyP class="col-span-1 hidden lg:block">{{ product_purchases }}</UiTypographyP>
    <button class="col-span-1 hidden lg:flex justify-end">
      <UiIconsMore class="w-5" />
    </button>
  </nuxt-link>
</template>
<script>
export default {
  props: {
    product_name: {
      type: String,
      default: "Product test name"
    },
    product_impressions: {
      type: Number,
      default: 0
    },
    product_clicks:{
      type: Number,
      default: 0
    },
    product_purchases: {
      type: Number,
      default: 0
    }
  }
}
</script>