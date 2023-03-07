<template>
  <div class="flex">
    <div class="w-full lg:w-2/5 grid gap-5">
      <div class="border p-4">
        <div class="relative flex w-fit justify-center mx-auto">
          <UserProfilePicture :artisan="username" :custom_dimensions="true" class="h-36 w-36"/>
          <div class="absolute -right-5 bottom-0 flex items-center gap-2 bg-white border-green-500 rounded-full border px-2">
            <UserProfileOnlineStatus class="relative" :is_online="true" :is_displayed="true"/>
            <UiTypographyP class="text-green-500">Online</UiTypographyP>
          </div>
        </div>
        <UiTypographyH3 class="text-center mt-4">{{username}}</UiTypographyH3>

        <div class="border-t grid grid-cols-1 gap-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex gap-3 items-center">
              <UiIconsLocation class="w-5 h-5 text-secondary" />
              <UiTypographyP>From</UiTypographyP>
            </div>
            <UiTypographyP>Nigeria</UiTypographyP>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-3 items-center">
              <UiIconsProfile class="w-5 h-5 text-secondary" />
              <UiTypographyP>Member since</UiTypographyP>
            </div>
            <UiTypographyP>Mar 2023</UiTypographyP>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-3 items-center">
              <UiIconsTime class="w-5 h-5 text-secondary" />
              <UiTypographyP>Avg. response time</UiTypographyP>
            </div>
            <UiTypographyP>1 day</UiTypographyP>
          </div>
        </div>
      </div>

      <div class="border p-4 duration-150 ease-in-out">
        <div class="flex justify-between items-center mb-3">
          <UiTypographyH3>Description</UiTypographyH3>
          <UiButtonsSecondary @clicked="toggleDescription()">Edit Description</UiButtonsSecondary>
        </div>
        <UiTypographyP :class="description_edit ? 'bg-gray-100 p-4 h-44 overflow-y-scroll focus:outline-none active:outline-none duration-150 ease-in-out' : ''" :contenteditable="description_edit" :small_text="true">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor perspiciatis ipsam quo rerum itaque assumenda nisi corporis eaque, provident nihil optio enim ullam perferendis illum mollitia obcaecati, possimus praesentium doloremque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum omnis minus incidunt quis ullam quisquam facere. Fugiat, debitis! Quas sint magni culpa, expedita odio totam possimus illum aut nulla fuga.</UiTypographyP>
        <div :class="description_edit ? 'flex' : 'hidden'" class="items-center gap-3 mt-3 duration-150 ease-in-out">
          <UiButtonsTertiary @clicked="toggleDescription()" :flexdisplay="true">Cancel</UiButtonsTertiary>
          <UiButtonsPrimary  @clicked="toggleDescription()" :flexdisplay="true" :standout="true">Update</UiButtonsPrimary>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  layout: 'seller',
  data() {
    return {
      username: 'Quadri',
      description_edit: false
    }
  },

  methods: {
    toggleDescription(){
      this.description_edit = !this.description_edit
    }
  },
}
</script>

<style>

</style>