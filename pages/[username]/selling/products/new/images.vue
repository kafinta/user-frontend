<template>
  <LayoutsSellerDashboard page_title="New Product">
    <main class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <div class="flex items-center">
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Product Images</UiTypographyH3>

      <form @submit.prevent="submitDetails()" class="flex flex-col lg:grid lg:grid-cols-2 gap-6">
        <div class="w-full">
          <UiTypographyP>Product pictures</UiTypographyP>
          <div class="w-full relative flex items-center justify-center">
            <input @change="handleFrontImage($event)" type="file" id="frontPictureInput" class="hidden" accept="image/*" :v-model="frontImageFile">
            <label for="frontPictureInput" class="group h-52 w-full rounded-md bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
              <img src="/images/icons/camera.svg" class="w-20 opacity-50" alt="Camera icon"/>
            </label>
            <img src="" ref="imagePreview" class="h-52 w-full rounded-md object-cover" alt="Front Image Preview">
          </div>
        </div>
        <FormButton class="lg:col-span-2 w-64 mx-auto">Publish</FormButton>
      </form>

    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data(){
    return {
      frontImageFile: ''
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
  }
}
</script>