<template>
  <div class="flex gap-2 items-center">
    <UiIconsStar v-for="star in 5" :key="star" :opacity="getStarOpacity(star)" class="w-7 text-primary" />
  </div>
</template>
<script>
export default {
  props: {
    review: {
      type: Number,
      default: 5
    }
  },
  methods: {
    getStarOpacity(star) {
      if (this.review % 1 > 0.7) {
        return Math.round(this.review) >= star ? 1 : 0.4;
      } else {
        return Math.floor(this.review) >= star ? 1 : 0.4;
      }
    },
  },
}
</script>