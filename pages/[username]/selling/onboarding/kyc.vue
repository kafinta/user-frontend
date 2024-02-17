<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <main class="w-full lg:w-2/3 2xl:w-1/2 mx-auto">
      <UiTypographyH3 class="text-center">KYC Verification</UiTypographyH3>
      <form action="" class="flex flex-col lg:grid lg:grid-cols-2 gap-6 w-full mt-6">
        <FormSelect label="Id Type" placeholder="Select the type of Id you're uploading">
          <FormOptions v-for="option in 30" option="Option $"></FormOptions>
        </FormSelect>
        <div>
          <UiTypographyP>Front picture</UiTypographyP>
          <div class="w-full relative flex items-center justify-center">
            <input @change="handleFrontImage($event)" type="file" id="frontPictureInput" class="hidden" accept="image/*" :v-model="frontImageFile">
            <label for="frontPictureInput" class="group h-52 w-full rounded-md bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
              <img src="/images/icons/camera.svg" class="w-20 opacity-50" alt="Camera icon"/>
            </label>
            <img src="" ref="frontPreview" class="h-52 w-full rounded-md object-cover" alt="Back Image Preview">
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

        <div class="col-span-2">
          <FormButton class="max-w-64 mx-auto">Upload ID</FormButton>
        </div>
      </form>
    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      frontImageFile: '',
      backImageFile: ''
    };
  },
  methods: {
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
  },
}
</script>