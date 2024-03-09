<template>
  <LayoutsSellerDashboard page_title="New Product">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <div class="flex items-center">
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Product Specifications</UiTypographyH3>

      <form @submit.prevent="updateProduct()" class="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        <FormSelect label="Brand" placeholder="Select the brand of your product manufacturer" class="col-span-1">
          <FormOptions v-for="item in 20" option="Brand" />
        </FormSelect>
        <FormSelect label="Assembly" placeholder="Is the product fully assembled or not?" class="col-span-1">
          <FormOptions option="Fully Assembled" />
          <FormOptions option="Assemble Later" />
        </FormSelect>
        <FormSelect label="Style" placeholder="Select the style of your product" class="col-span-1">
          <FormOptions v-for="item in 20" option="style" />
        </FormSelect>
        <FormSelect label="Material" placeholder="Select the material of your product" class="col-span-1">
          <FormOptions v-for="item in 20" option="Material" />
        </FormSelect>
        <FormSelect label="Sets" placeholder="Select number of sets in the product" class="col-span-1">
          <FormOptions option="1 set" />
          <FormOptions option="2 set" />
          <FormOptions option="3 set" />
          <FormOptions option="4 set" />
          <FormOptions option="5 set" />
        </FormSelect>
        <FormSelect label="Dimensions" placeholder="Select the dimension of your product" class="col-span-1">
          <FormOptions v-for="item in 20" option="Dimension" />
        </FormSelect>
        <div class="col-span-2 p-5 border border-secondary border-opacity-20 rounded-md">
          <label for="Color" class="text-sm text-secondary mb-1 block">Color</label>
          <div class="flex gap-6 flex-wrap">
            <button v-for="items in 7" class="flex gap-2 p-2 rounded-md border border-accent-200 items-center">
              <div class="bg-red-600 h-5 w-5 rounded-full"></div>
              <span>Red</span>
            </button> 
            <button v-for="items in 3" class="flex gap-2 p-2 rounded-md border border-accent-200 items-center">
              <div class="bg-blue-600 h-5 w-5 rounded-full"></div>
              <span>Blue</span>
            </button> 
            <button v-for="items in 4" class="flex gap-2 p-2 rounded-md border border-accent-200 items-center">
              <div class="bg-purple-600 h-5 w-5 rounded-full"></div>
              <span>Purple</span>
            </button> 
            <button v-for="items in 3" class="flex gap-2 p-2 rounded-md border border-accent-200 items-center">
              <div class="bg-green-600 h-5 w-5 rounded-full"></div>
              <span>Green</span>
            </button> 
            <button v-for="items in 5" class="flex gap-2 p-2 rounded-md border border-accent-200 items-center">
              <div class="bg-yellow-400 h-5 w-5 rounded-full"></div>
              <span>Yellow</span>
            </button> 
          </div>
        </div>
        <FormButton class="col-span-2 w-64 mx-auto">Save & Continue</FormButton>
      </form>

    </div>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data(){
    return {
    }
  },

  methods: {
    updateProduct(){
      this.$router.push({name: 'username-selling-products-new-images'})
    },
  }
}
</script>