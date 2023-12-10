<template>
  <div class="text-secondary flex gap-3 items-center">
    <UiIconsStar class="w-5 h-5" />
    <UiTypographyP>{{ rating }}</UiTypographyP>
  </div>
</template>
<script>
export default {
  props: {
    rating: String
  }
}
</script>