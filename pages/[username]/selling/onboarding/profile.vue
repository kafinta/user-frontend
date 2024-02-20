<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <main class="w-full lg:w-2/3 2xl:w-1/2 mx-auto">
      <UiTypographyH3 class="text-center">Profile Registration</UiTypographyH3>
      <form action="" class="flex flex-col lg:grid lg:grid-cols-2 gap-6 w-full mt-6">
        <div class="col-span-1 lg:col-span-2 relative flex items-center justify-center">
          <input @change="previewImage($event)" type="file" id="profilePictureInput" class="hidden" accept="image/*" :v-model="form.profile_picture">
          <label for="profilePictureInput" class="group h-52 aspect-square rounded-full bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
            <img src="/images/icons/camera.svg" class="w-20 opacity-50" alt="Profile image preview" />
          </label>
          <img :src="previewSrc" ref="preview" class="h-52 aspect-square rounded-full object-cover">
        </div>
        <FormInput label="First name" type="text" v-model:inputValue="form.first_name"></FormInput>
        <FormInput label="Last name" type="text" v-model:inputValue="form.last_name"></FormInput>
        <FormInput label="Nationality" type="text" v-model:inputValue="form.nationality"></FormInput>
        <FormInput label="Phone Number" type="phone" v-model:inputValue="form.phone"></FormInput>
        <FormTextarea type="tel" label="Description" v-model:inputValue="form.description" placeholder="Write a few words to describe your brand/company." class="lg:col-span-2" ></FormTextarea>
        <div class="col-span-2">
          <FormButton class="max-w-64 mx-auto">Create Profile</FormButton>
        </div>
      </form>
    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      previewSrc: '',
      form: {
        first_name: '',
        last_name: '',
        description: '',
        nationality: '',
        phone: '',
        profile_picture: '',
      }
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
}
</script>