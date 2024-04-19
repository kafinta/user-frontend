<template>
  <div class="col-span-1 lg:col-span-2">
    <UiTypographyH2>Product Name that is super duper ridiculously super long</UiTypographyH2>
    <UiTypographyP>Listed by 
      <span><UiButtonsSecondary>{{ user }}</UiButtonsSecondary></span>
      in
      <span><UiButtonsSecondary>{{ category }}</UiButtonsSecondary></span>
    </UiTypographyP>
    <div class="flex gap-2 items-center my-3">
      <UiTypographyP>5</UiTypographyP>
      <div class="flex gap-0.5 items-center">
        <UiIconsStar v-for="star in 5" class="w-5 h-5 text-primary" />
      </div>
      <UiButtonsSecondary>0 reviews</UiButtonsSecondary>
    </div>
    <hr />

    <div class="grid my-5">
      <div class="bg-secondary text-sm px-4 py-2 text-white rounded-md w-fit">Limited time deal</div>
      <div class="flex items-center gap-2 mt-2">
        <UiTypographyP>-{{percentage}}%</UiTypographyP>
        <UiTypographyH2>${{price}}</UiTypographyH2>
      </div>
      <UiTypographyP>Previous price: ${{ price + percentage/100 * price }}</UiTypographyP>

      <form class="grid gap-5 p-5 border border-accent-200 rounded-xl mt-5">
        <div class="">
          <label for="color choice">Color:</label>
          <input type="radio" name="Image" id="">
        </div>
        <FormSelect label="Size" placeholder="Choose a size option">
          <FormOptions v-for="$ in 5" :option="`Size option ${$}`" />
        </FormSelect>
        <div class="grid grid-cols-5 gap-5 items-end">
          <FormSelect class="col-span-2" label="Quantity" placeholder="Qty: 1">
            <FormOptions v-for="$ in 5" :option="`${$}`" />
          </FormSelect>
          <FormButton class="col-span-3 gap-5 h-[46px] items-center">
            <UiIconsCart class="w-5 h-5 block" />Add to cart
          </FormButton>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    category: {
      type: String,
      default:'Testing'
    },
    user: {
      type: String,
      default:'Test user'
    },
    percentage: {
      type: Number,
      default: 25
    },
    price: {
      type: Number,
      default: 500
    },
  }
}
</script>