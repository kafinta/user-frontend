<template>
  <LayoutsSellerDashboard class="min-h-screen">
    <UiTypographyH2>Orders</UiTypographyH2>

    <div class="border border-accent-100 flex divide-x divide-accent-100 mt-6">
      <div :class="tab.active ? 'bg-primary text-white' : 'hover:bg-secondary'" class="px-4 py-2 duration-500 ease-in-out group" v-for="tab in tabs" :key="tab.id">
        <UiTypographyP :class="tab.active ? 'text-white' : 'text-secondary'" class="duration-500 ease-in-out group-hover:text-white">{{tab.title}}</UiTypographyP>
      </div>
    </div>

    <div class="border border-accent-100 py-2 px-4 w-full flex justify-between items-center mt-4" v-for="item in 5">
      <div class="flex items-center gap-5">
        <div class="relative flex w-fit">
          <UserProfilePicture :artisan="username" :custom_dimensions="true" class="h-10 w-10"/>
          <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="false" :is_displayed="true"/>
        </div>

        <div>
          <UiTypographyP class="text-secondary">{{ username }}</UiTypographyP>
        </div>
      </div>

      <div class="flex gap-5 items-center">
        <div>
          <UiTypographyP :small_text="true">Price</UiTypographyP>
          <UiTypographyP>$100</UiTypographyP>
        </div>
        <div>
          <UiTypographyP :small_text="true">Status</UiTypographyP>
          <UiTypographyP>In Progress</UiTypographyP>
        </div>
      </div>

      <UiButtonsTertiary>View</UiButtonsTertiary>
    </div>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      username: 'Quadri',
      tabs: [
        {
          id: 1,
          title: 'Active',
          active: true
        },
        {
          id: 2,
          title: 'Completed',
          active: false
        },
        {
          id: 3,
          title: 'Cancelled',
          active: false
        },
      ]
    }
  },
}
</script>
<style>
  .gig-img {
    width: 5rem !important;
    min-width: 5rem;
    background-color: #D3D3D3;
    aspect-ratio: 3/2;
  }
</style>