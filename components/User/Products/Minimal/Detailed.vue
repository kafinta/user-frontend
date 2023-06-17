<template>
  <div class="border border-accent-100 p-2 flex md:grid md:grid-cols-9 gap-5 items-center relative">
    <div class="bg-accent-100 aspect-[9/6] w-3/12 md:col-span-1"></div>
    <UiTypographyP class="md:col-span-4">{{ product_name }}</UiTypographyP>
    <UiTypographyP class="col-span-1 hidden md:block">{{ product_impressions }}</UiTypographyP>
    <UiTypographyP class="col-span-1 hidden md:block">{{ product_clicks }}</UiTypographyP>
    <UiTypographyP class="col-span-1 hidden md:block">{{ product_purchases }}</UiTypographyP>
    <button class="w-1/12 md:col-span-1 flex justify-end">
      <UiIconsMore class="w-5" />
    </button>
  </div>
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