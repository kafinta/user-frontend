<template>
  <LayoutsSellerDashboard page_title="My Profile">
    <div class="block lg:flex gap-8">
      <div class="w-full lg:w-2/5 grid gap-5">
        <div class="border border-accent-100 p-6">
          <div class="relative flex w-fit justify-center mx-auto">
            <UserProfilePicture :username="username" :custom_dimensions="true" class="h-36 w-36"/>
          </div>
          <UiTypographyH3 class="text-center mt-4 mb-3">{{username}}</UiTypographyH3>

          <div class="border-t border-accent-100 grid grid-cols-1 gap-4 pt-4">
            <div class="flex items-center justify-between">
              <div class="flex gap-3 items-center">
                <UiIconsLocation class="w-5 h-5 text-secondary" />
                <UiTypographyP>Nationality</UiTypographyP>
              </div>
              <UiTypographyP>Nigerian</UiTypographyP>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex gap-3 items-center">
                <UiIconsProfile class="w-5 h-5 text-secondary" />
                <UiTypographyP>Member since</UiTypographyP>
              </div>
              <UiTypographyP>Mar 2023</UiTypographyP>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-3/5 mt-8 lg:mt-0">
        <div class="border border-accent-100 p-6 duration-150 ease-in-out">
          <div class="mb-3">
            <UiTypographyH3>Description</UiTypographyH3>
          </div>
          <UiTypographyP>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor perspiciatis ipsam quo rerum itaque assumenda nisi corporis eaque, provident nihil optio enim ullam perferendis illum mollitia obcaecati, possimus praesentium doloremque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum omnis minus incidunt quis ullam quisquam facere. Fugiat, debitis! Quas sint magni culpa, expedita odio totam possimus illum aut nulla fuga.</UiTypographyP>
          <div :class="description_edit ? 'flex' : 'hidden'" class="items-center gap-3 my-3 duration-150 ease-in-out">
            <UiButtonsTertiary @clicked="toggleDescription()" :flexdisplay="true">Cancel</UiButtonsTertiary>
            <UiButtonsPrimary  @clicked="toggleDescription()" :flexdisplay="true" :standout="true">Update</UiButtonsPrimary>
          </div>
        </div>
      </div>
    </div>
  </LayoutsSellerDashboard>
</template>

<script>
export default {
  data() {
    return {
      username: 'Quadri',
    }
  },

  methods: {

  },
}
</script>

<style>

</style>