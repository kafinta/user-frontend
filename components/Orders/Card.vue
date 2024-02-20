<template>
  <li class="border border-accent-100 rounded-xl flex cursor-pointer">
    <!-- <ProductsImage :imagePath="image" class="rounded-l-xl w-36" /> -->
    <div class="aspect-video h-36 bg-accent-100"></div>
    <aside class="p-4 h-full flex flex-col justify-between">
      <div>
        <ProductsName>Order product name</ProductsName>
        Quantity: 3
      </div>
      <div>
        <ProductsPrice></ProductsPrice>
      </div>
    </aside>
  </li>
</template>
<script>
export default {
  props: {
    image: String,
    title: String,
    review: {
      default: 4.3,
      type: Number
    }
  },
}
</script>