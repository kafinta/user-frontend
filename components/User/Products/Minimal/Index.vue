<template>
  <div class="border border-accent-100">
    <div class="bg-accent-100 w-full aspect-video"></div>
    <div class="p-5">
      <UiTypographyH3>{{name}}</UiTypographyH3>
      <UiTypographyP color="primary" class="text-primary font-bold">#{{price}}</UiTypographyP>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Product Name'
    },
    price: {
      type: Number,
      default: 9999.99
    },
  },
}
</script>