<template>
  <article class="grid gap-2">
    <div class="flex gap-2">
      <ProductsReviewStars :review="review" />
    </div>
    <UiTypographyP>{{ text }}</UiTypographyP>
    <div class="flex justify-between items-center">
      <UiTypographyP>{{ date }} by {{reviewer}}</UiTypographyP>
      <div class="text-green-500 flex items-center gap-2">
        <UiIconsBadge />
        <UiTypographyP>Verified purchase</UiTypographyP>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  props: {
    review: {
      type: Number,
      default: 2.3
    },
    text: {
      type: String,
      default: 'Example text'
    },
    reviewer: {
      type: String,
      default: 'reviewer'
    },
    date: {
      type: String,
      default: `${new Date().toLocaleDateString()}`
    }
  }
}
</script>