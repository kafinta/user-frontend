<template>
  <div class="block lg:flex gap-8">
    <div class="w-full lg:w-2/5 grid gap-5">
      <div class="border border-accent-100 p-6">
        <div class="flex items-center gap-5 mb-4">
          <div class="relative flex w-fit">
            <UserProfilePicture :artisan="username" :custom_dimensions="true" class="h-10 w-10"/>
            <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="true" :is_displayed="true"/>
          </div>

          <div>
            <UiTypographyP class="text-secondary">{{ username }}</UiTypographyP>
          </div>
        </div>
        <div class="border-t border-accent-100 grid grid-cols-1 gap-2 py-4">
          <div class="flex items-center justify-between">
            <UiTypographyP>Response rate</UiTypographyP>
            <UiTypographyP :small_text="true">50%</UiTypographyP>
          </div>
          <div class="flex items-center justify-between">
            <UiTypographyP>Response time</UiTypographyP>
            <UiTypographyP :small_text="true">1 Hour</UiTypographyP>
          </div>
          <div class="flex items-center justify-between">
            <UiTypographyP>Delivered on time</UiTypographyP>
            <UiTypographyP :small_text="true">100%</UiTypographyP>
          </div>
          <div class="flex items-center justify-between">
            <UiTypographyP>Order completion</UiTypographyP>
            <UiTypographyP :small_text="true">100%</UiTypographyP>
          </div>
        </div>
        <div class="border-t border-accent-100 flex items-center justify-between pt-4">
          <UiTypographyP>Earned in {{ date.toLocaleString('default', {month: 'long'}) }}</UiTypographyP>
          <UiTypographyP class="font-medium">$0.00</UiTypographyP>
        </div>
      </div>

      <div class="border border-accent-100 p-6 duration-150 ease-in-out">
        <div class="flex justify-between items-center">
          <UiTypographyH3>Inbox</UiTypographyH3>
          <UiButtonsSecondary @clicked="t$route.push({path: '/users/inbox'})">View All</UiButtonsSecondary>
        </div>
        <div class="bg-accent-50 h-64 mt-3 duration-150 ease-in-out">
        </div>
      </div>
    </div>

    <div class="w-full lg:w-3/5 mt-8 lg:mt-0">
      <div class="border border-accent-100 flex divide-x divide-accent-100">
        <div :class="tab.active ? 'bg-primary text-white' : 'hover:bg-secondary'" class="px-4 py-2 duration-500 ease-in-out group" v-for="tab in tabs" :key="tab.id">
          <UiTypographyP :class="tab.active ? 'text-white' : 'text-secondary'" class="duration-500 ease-in-out group-hover:text-white">{{tab.title}}</UiTypographyP>
        </div>
      </div>
      <div class="mt-8 grid gap-4">
        <div class="border border-accent-100 py-2 px-4 w-full flex justify-between items-center" v-for="item in 5">
          <div class="flex items-center gap-5">
            <div class="relative flex w-fit">
              <UserProfilePicture :artisan="username" :custom_dimensions="true" class="h-10 w-10"/>
              <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="false" :is_displayed="true"/>
            </div>

            <div>
              <UiTypographyP class="text-secondary">{{ username }}</UiTypographyP>
            </div>
          </div>

          <div class="flex gap-8 items-center">
            <div>
              <UiTypographyP :small_text="true">Price</UiTypographyP>
              <UiTypographyP>$100</UiTypographyP>
            </div>
            <div>
              <UiTypographyP :small_text="true">Status</UiTypographyP>
              <UiTypographyP>In Progress</UiTypographyP>
            </div>
            <UiButtonsTertiary>View</UiButtonsTertiary>
          </div>
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
      description_edit: false,
      date: '',
      tabs: [
        {
          id: 1,
          title: 'Active Orders',
          count: 0,
          active: true
        },
        {
          id: 2,
          title: 'Completed Orders',
          active: false
        },
        {
          id: 3,
          title: 'Canceled Orders',
          active: false
        },
      ]
    }
  },

  methods: {

  },

  created() {
    this.date = new Date()
  },
}
</script>

<style>
</style>