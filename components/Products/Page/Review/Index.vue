<template>
  <div class="py-4">
    <UiTypographyH2>Customer Reviews</UiTypographyH2>
    <div class="p-5 border border-accent-200 rounded-md mt-2 ">
      <div class="flex gap-5 lg:gap-10 items-center">
        <div>
          <UiTypographyH2>{{review}} out of 5</UiTypographyH2>
          <div class="flex gap-2 items-center">
            <UiIconsStar v-for="n in 5" :key="n" :opacity="getStarOpacity(n)" class="w-7 text-primary" />
          </div>
          <UiTypographyP class="mt-2">{{total_review}} ratings and reviews</UiTypographyP>
        </div>

        <ProductsPageReviewBreakdown  />
      </div>
      <hr class="border-accent-200 my-5">
      <ul class="grid gap-5 divide-y divide-accent-200">
        <li>
          <article class="grid gap-2">
            <div class="flex gap-2">
              <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
            </div>
            <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
            <div class="flex justify-between items-center">
              <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
              <div class="text-green-500 flex items-center gap-2">
                <UiIconsBadge />
                <UiTypographyP>Verified purchase</UiTypographyP>
              </div>

            </div>
          </article>
        </li>
        <li class="pt-5">
          <article class="grid gap-2">
            <div class="flex gap-2">
              <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
            </div>
            <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
            <div class="flex justify-between items-center">
              <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
              <div class="text-green-500 flex items-center gap-2">
                <UiIconsBadge />
                <UiTypographyP>Verified purchase</UiTypographyP>
              </div>

            </div>
          </article>
        </li>
        <li class="pt-5">
          <article class="grid gap-2">
            <div class="flex gap-2">
              <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
            </div>
            <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
            <div class="flex justify-between items-center">
              <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
              <div class="text-green-500 flex items-center gap-2">
                <UiIconsBadge />
                <UiTypographyP>Verified purchase</UiTypographyP>
              </div>

            </div>
          </article>
        </li>
        <li class="pt-5">
          <article class="grid gap-2">
            <div class="flex gap-2">
              <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
            </div>
            <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
            <div class="flex justify-between items-center">
              <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
              <div class="text-green-500 flex items-center gap-2">
                <UiIconsBadge />
                <UiTypographyP>Verified purchase</UiTypographyP>
              </div>

            </div>
          </article>
        </li>
        <li class="pt-5">
          <article class="grid gap-2">
            <div class="flex gap-2">
              <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
            </div>
            <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
            <div class="flex justify-between items-center">
              <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
              <div class="text-green-500 flex items-center gap-2">
                <UiIconsBadge />
                <UiTypographyP>Verified purchase</UiTypographyP>
              </div>

            </div>
          </article>
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
      default: 4.2
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
  }
}
</script>