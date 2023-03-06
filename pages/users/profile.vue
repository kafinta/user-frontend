<template>
  <div class="flex">
    <div class="border p-4 w-full lg:w-2/5">
      <div class="relative flex w-fit justify-center mx-auto">
        <UserProfilePicture :artisan="username" :custom_dimensions="true" class="h-36 w-36"/>
        <div class="absolute -right-5 bottom-0 flex items-center gap-2 bg-white border-green-500 rounded-full border px-2">
          <UserProfileOnlineStatus class="relative" :is_online="true" :is_displayed="true"/>
          <UiTypographyP class="text-green-500">Online</UiTypographyP>
        </div>
      </div>
      <UiTypographyH3 class="text-center mt-4">{{username}}</UiTypographyH3>

      <div class="border-t grid grid-cols-1 gap-3 py-3">
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
  </div>
</template>

<script>
export default {
  layout: 'seller',
  data() {
    return {
      username: 'Quadri',
    }
  },
}
</script>

<style>

</style>