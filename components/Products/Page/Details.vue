<template>
  <div class="col-span-1 lg:col-span-2">
    <template v-if="isLoading">
      <UiSkeleton height="2.5rem" class="mb-3 full" />
      <UiSkeleton height="1.5rem" class="mb-2 full" />
      <UiSkeleton height="1.5rem" class="mb-2 full" />
      <UiSkeleton height="2rem" class="mb-4 full" />
      <UiSkeleton height="3rem" class="mb-4 full" />
      <UiSkeleton height="2.5rem" class="w-full" />
    </template>
    <template v-else>
      <UiTypographyH2>{{ product?.name || 'N/A' }}</UiTypographyH2>
      <UiTypographyP>Listed by 
        <span><UiButtonsSecondary>{{ product?.user?.name || 'Seller' }}</UiButtonsSecondary></span>
        <span><UiButtonsSecondary>{{ product?.category?.name || 'Category' }}</UiButtonsSecondary></span>
      </UiTypographyP>
      <div class="flex gap-2 items-center my-3">
        <UiTypographyP>{{ product?.rating || 0 }}</UiTypographyP>
        <div class="flex gap-0.5 items-center">
          <UiIconsStar v-for="star in 5" :key="star" class="w-5 h-5 text-primary" />
        </div>
        <UiButtonsSecondary>{{ product?.review_count || 0 }} reviews</UiButtonsSecondary>
      </div>
      <hr />
      <div class="grid my-5">
        <div v-if="product?.discount">
          <div class="bg-red-500 text-sm px-4 py-2 text-white rounded-md w-fit">Limited time deal</div>
          <div class="flex items-center gap-2 mt-2">
            <UiTypographyP>-{{ product?.discount || 0 }}%</UiTypographyP>
            <UiTypographyH2>${{ product?.price || 0 }}</UiTypographyH2>
          </div>
          <UiTypographyP>Previous price: ${{ product?.previous_price || (product?.price + 100) }}</UiTypographyP>
        </div>

        <form class="grid gap-5 p-5 border border-accent-200 rounded-xl mt-5">
          <!-- <div class="">
            <label for="color choice">Color:</label>
            <input type="radio" name="Image" id="">
          </div> -->
          <!-- <FormSelect label="Size" placeholder="Choose a size option">
            <FormOptions v-for="$ in 5" :option="`Size option ${$}`" />
          </FormSelect> -->
          <div class="grid grid-cols-5 gap-5 items-end">
            <FormSelect class="col-span-2" label="Quantity" placeholder="Qty: 1">
            </FormSelect>
            <FormButton class="col-span-3 gap-5 h-[46px] items-center">
              <UiIconsCart class="w-5 h-5 block" />Add to cart
            </FormButton>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  product: Object,
  isLoading: Boolean
});
</script>