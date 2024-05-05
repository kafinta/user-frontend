<template>
  <div>
    <div class="flex gap-2 items-center">
      <UiIconsStar v-for="star in 5" :key="star" :opacity="getStarOpacity(n)" class="w-7 text-primary" />
    </div>
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
    getStarOpacity(index) {
      if (this.review % 1 > 0.7) {
        return Math.round(this.review) >= index ? 1 : 0.4;
      } else {
        return Math.floor(this.review) >= index ? 1 : 0.4;
      }
    },
  },
}
</script>