<template>
  <div class="flex">
    <div class="grid gap-1">
      <div class="flex gap-2 items-center" v-for="rating in reversedItems" :key="rating">
        <UiTypographyP>{{rating.rating}}</UiTypographyP>
        <UiIconsStar class="w-5 text-primary" />
        <div class="h-2 rounded-md w-36 bg-accent-100">
          <div :style="{width : `${rating.percentage}%`} " class="h-2 bg-primary rounded-md"></div>
        </div>
        <UiTypographyP>{{rating.percentage}}%</UiTypographyP>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      ratings: [
        {
          rating: 1,
          percentage: 60
        },
        {
          rating: 2,
          percentage: 15
        },
        {
          rating: 3,
          percentage: 5
        },
        {
          rating: 4,
          percentage: 5
        },
        {
          rating: 5,
          percentage: 15
        },
      ]
    }
  },
  mounted(){

  },
  computed: {
    reversedItems() {
      return this.ratings.slice().reverse();
    },
  },
}
</script>