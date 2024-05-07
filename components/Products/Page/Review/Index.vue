<template>
  <div class="py-4">
    <UiTypographyH2>Customer Reviews</UiTypographyH2>
    <div class="p-5 border border-accent-200 rounded-md mt-2 ">
      <div class="flex flex-col md:flex-row gap-5 lg:gap-10 justify-between items-start md:items-center">
        <div>
          <UiTypographyH2>{{review}} out of 5</UiTypographyH2>
          <ProductsReviewStars :review="review" />
          <UiTypographyP class="mt-2">{{total_review}} ratings and reviews</UiTypographyP>

          <div class="grid gap-1 mt-5">
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
        <ProductsPageReviewBreakdown />
      </div>
      <hr class="border-accent-200 my-5">
      <ul class="grid gap-5 divide-y divide-accent-200">
        <li v-for="review in 5" :key="review">
          <ProductsReviewItem />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    total_review: {
      type: Number,
      default: 20
    },
    review: {
      type: Number,
      default: 3.3
    }
  },

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

  methods: {

  },

  computed: {
    reversedItems() {
      return this.ratings.slice().reverse();
    },
  },
}
</script>