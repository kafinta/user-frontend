<template>
  <div class="py-4">
    <template v-if="isLoading">
      <UiSkeleton height="2rem" class="mb-3 w-1/2" />
      <UiSkeleton height="1.5rem" class="mb-2 w-1/3" />
      <UiSkeleton height="1.5rem" class="mb-2 w-1/4" />
      <UiSkeleton height="1.5rem" class="mb-2 w-1/2" />
      <UiSkeleton height="6rem" v-for="i in 3" :key="i" class="mb-3 w-full" />
    </template>
    <template v-else>
      <UiTypographyH2>Customer Reviews</UiTypographyH2>
      <div class="p-5 border border-accent-200 rounded-md mt-2 ">
        <div class="flex flex-col md:flex-row gap-5 lg:gap-10 justify-between items-start md:items-center">
          <div>
            <UiTypographyH2>{{ product?.rating || 0 }} out of 5</UiTypographyH2>
            <ProductsReviewStars :review="product?.rating || 0" />
            <UiTypographyP class="mt-2">{{ product?.review_count || 0 }} ratings and reviews</UiTypographyP>
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
    </template>
  </div>
</template>
<script setup>
import UiSkeleton from '~/components/Ui/Skeleton/Index.vue';
import UiTypographyH2 from '~/components/Ui/Typography/H2.vue';
import UiTypographyP from '~/components/Ui/Typography/P.vue';
import UiIconsStar from '~/components/Ui/Icons/Star.vue';
import ProductsReviewStars from '~/components/Products/Review/Stars.vue';
import ProductsPageReviewBreakdown from '~/components/Products/Page/Review/Breakdown.vue';
import ProductsReviewItem from '~/components/Products/Review/Item.vue';
const props = defineProps({
  product: Object,
  isLoading: Boolean
});

const ratings = [
  { rating: 1, percentage: 60 },
  { rating: 2, percentage: 15 },
  { rating: 3, percentage: 5 },
  { rating: 4, percentage: 5 },
  { rating: 5, percentage: 15 },
];
const reversedItems = ratings.slice().reverse();
</script>