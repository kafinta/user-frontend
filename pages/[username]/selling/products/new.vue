<template>
  <LayoutsSellerDashboard page_title="New Product">
    <main class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <div class="flex items-center">
        <div :class="step1 ? 'bg-primary text-white' : 'text-secondary border border-accent-200'" class=" h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div :class="step2 ? 'bg-primary text-white' : 'text-secondary border border-accent-200'" class=" h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div :class="step3 ? 'bg-primary text-white' : 'text-secondary border border-accent-200'" class=" h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3 v-show="step1">Product Details</UiTypographyH3>
      <UiTypographyH3 v-show="step2">Product Specifications</UiTypographyH3>
      <UiTypographyH3 v-show="step3">Product Images</UiTypographyH3>
      <form v-show="step1" @submit.prevent="submitDetails()" class="flex flex-col lg:grid lg:grid-cols-2 gap-6 w-full">
        <FormInput label="Product Name" placeholder="Enter the name of your product" class="col-span-2"/>
        <FormSelect label="Category" placeholder="Select the category of your product">
          <FormOptions v-for="item in 20" option="category" />
        </FormSelect>
        <FormSelect label="Subcategory" placeholder="Select the subcategory of your product">
          <FormOptions v-for="item in 20" option="subcategory" />
        </FormSelect>
        <FormSelect label="Location" placeholder="Select the location of your product" class="col-span-2">
          <FormOptions v-for="item in 20" option="location" />
        </FormSelect>
        <FormTextarea label="Description" placeholder="Write a detailed description for your product" class="col-span-2"></FormTextarea>
        <FormButton class="col-span-2 w-64 mx-auto">Save & Continue</FormButton>
      </form>
      <form v-show="step2" @submit.prevent="submitSpecifications()" class="flex flex-col lg:grid lg:grid-cols-2 gap-6">
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
        <FormButton class="col-span-2 w-64 mx-auto">Save & Continue</FormButton>
      </form>
      <form v-show="step3" @submit.prevent="submitDetails()" class="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        <div>
          <UiTypographyP>Front picture</UiTypographyP>
          <div class="w-full relative flex items-center justify-center">
            <input @change="handleFrontImage($event)" type="file" id="frontPictureInput" class="hidden" accept="image/*" :v-model="frontImageFile">
            <label for="frontPictureInput" class="group h-52 w-full rounded-md bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
              <img src="/images/icons/camera.svg" class="w-20 opacity-50" alt="Camera icon"/>
            </label>
            <img src="" ref="frontPreview" class="h-52 w-full rounded-md object-cover" alt="Front Image Preview">
          </div>
        </div>
        <div>
          <UiTypographyP>Back picture</UiTypographyP>
          <div class="w-full relative flex items-center justify-center">
            <input @change="handleBackImage($event)" type="file" id="backPictureInput" class="hidden" accept="image/*" :v-model="frontImageFile">
            <label for="backPictureInput" class="group h-52 w-full rounded-md bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
              <img src="/images/icons/camera.svg" class="w-20 opacity-50" alt="Camera icon"/>
            </label>
            <img src="" ref="backPreview" class="h-52 w-full rounded-md object-cover" alt="Back Image Preview">
          </div>
        </div>
        <FormButton class="col-span-2 w-64 mx-auto">Publish</FormButton>
      </form>
    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data(){
    return {
      step1: true,
      step2: false,
      step3: false
    }
  },

  methods: {
    submitDetails(){
      this.step1 = false,
      this.step2 = true
    },
    submitSpecifications(){
      this.step2 = false,
      this.step3 = true
    },
    handleFrontImage(event) {
      const frontPreview = this.$refs.frontPreview;
      const frontImageFile = event.target.files[0];
      if (frontImageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          frontPreview.src = e.target.result;
        };
        reader.readAsDataURL(frontImageFile);
      }
    },
    handleBackImage(event) {
      const backPreview = this.$refs.backPreview;
      const backImageFile = event.target.files[0];
      if (backImageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          backPreview.src = e.target.result;
        };
        reader.readAsDataURL(backImageFile);
      }
    }
  }
}
</script>