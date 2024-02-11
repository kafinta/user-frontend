
import { FormInput } from '#build/components';
<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <main class="h-full w-full grid place-items-center">
      <div class="w-full lg:w-2/3 2xl:w-1/2 mx-auto">
        <UiTypographyH3 class="text-center">Profile Registration</UiTypographyH3>

        <form action="" class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
          <div class="mx-auto lg:col-span-2 relative flex items-center justify-center">
            <input @change="previewImage($event)" type="file" id="profilePictureInput" class="hidden" accept="image/*">
            <label for="profilePictureInput" class="group h-52 aspect-square rounded-full bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
              <img src="/images/icons/camera.svg" class="w-20 opacity-50" alt="" />
            </label>
            <img :src="previewSrc" ref="preview" class="h-52 aspect-square rounded-full object-cover">
          </div>
          <FormInput label="First name" type="text"></FormInput>
          <FormInput label="Last name" type="text"></FormInput>
          <FormInput label="Nationality" type="text"></FormInput>
          <FormInput label="Phone Number" type="phone"></FormInput>
          <FormTextarea type="tel" label="Description" placeholder="Write a few words to describe your brand/company." class="lg:col-span-2" ></FormTextarea>
          <div class="col-span-2">
            <FormButton  class="max-w-64 mx-auto">Create Profile</FormButton>
          </div>
        </form>
      </div>
    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      previewSrc: '', // Initial empty value for preview
      previewLoaded : false
    };
  },
  methods: {
    previewImage(event){
      const preview = this.$refs.preview;
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          preview.src = e.target.result;
          this.previewSrc = e.target.result;
          this.previewLoaded = true;
        };

        reader.readAsDataURL(file);
      }
    }
  },
  mounted(){

  }
}
</script>
<style>
.preview_image{
  background: url(`${this.previewSrc}`);
}
</style>