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
      <div class="p-5 border border-accent-200 rounded-xl mt-2 bg-white">
        <div class="flex flex-col md:flex-row gap-5 lg:gap-10 justify-between items-start md:items-center">
          <div>
            <UiTypographyH2>{{ product?.rating || 0 }} out of 5</UiTypographyH2>
            <ProductsReviewStars :review="Number(product?.rating || 0)" />
            <UiTypographyP class="mt-2">
              {{ reviewCount }} rating{{ reviewCount !== 1 ? 's' : '' }} and review{{ reviewCount !== 1 ? 's' : '' }}
            </UiTypographyP>

            <div v-if="reviewCount > 0" class="grid gap-1 mt-5">
              <div class="flex gap-2 items-center" v-for="rating in reversedItems" :key="rating.rating">
                <UiTypographyP>{{ rating.rating }}</UiTypographyP>
                <UiIconsStar class="w-5 text-primary" />
                <div class="h-2 rounded-md w-36 bg-accent-100">
                  <div :style="{ width: `${rating.percentage}%` }" class="h-2 bg-primary rounded-md"></div>
                </div>
                <UiTypographyP>{{ rating.percentage }}%</UiTypographyP>
              </div>
            </div>
          </div>
          <ProductsPageReviewBreakdown v-if="reviewCount > 0" />
        </div>

        <hr v-if="reviewCount > 0" class="border-accent-200 my-5">

        <div v-if="reviewCount > 0 && reviewItems.length > 0" class="grid gap-5 divide-y divide-accent-200">
          <div v-for="review in reviewItems" :key="review.id || review.reviewer || review.date" class="py-4 first:pt-0 last:pb-0">
            <ProductsReviewItem
              :review="review.rating || review.value || product?.rating || 0"
              :text="review.comment || review.text || 'No comment provided.'"
              :reviewer="review.reviewer?.name || review.user?.name || review.reviewer || 'Verified buyer'"
              :date="review.created_at ? new Date(review.created_at).toLocaleDateString() : (review.date || new Date().toLocaleDateString())"
            />
          </div>
        </div>

        <div v-else class="py-8 text-center">
          <UiTypographyH3 class="text-secondary">No reviews yet</UiTypographyH3>
          <UiTypographyP class="mt-2 text-accent-500">
            Be the first to review this product once you’ve purchased it.
          </UiTypographyP>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import UiSkeleton from '~/components/Ui/Skeleton/Index.vue';
import UiTypographyH2 from '~/components/Ui/Typography/H2.vue';
import UiTypographyH3 from '~/components/Ui/Typography/H3.vue';
import UiTypographyP from '~/components/Ui/Typography/P.vue';
import UiIconsStar from '~/components/Ui/Icons/Star.vue';
import ProductsReviewStars from '~/components/Products/Review/Stars.vue';
import ProductsPageReviewBreakdown from '~/components/Products/Page/Review/Breakdown.vue';
import ProductsReviewItem from '~/components/Products/Review/Item.vue';
const props = defineProps({
  product: Object,
  isLoading: Boolean
});

const reviewCount = computed(() => Number(props.product?.review_count || props.product?.reviews_count || 0))

const reviewItems = computed(() => {
  if (Array.isArray(props.product?.reviews)) {
    return props.product.reviews
  }
  return []
})

const ratings = [
  { rating: 1, percentage: 60 },
  { rating: 2, percentage: 15 },
  { rating: 3, percentage: 5 },
  { rating: 4, percentage: 5 },
  { rating: 5, percentage: 15 },
];
const reversedItems = ratings.slice().reverse();
</script>