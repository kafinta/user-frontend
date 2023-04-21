<template>
  <div class="min-h-screen">
    <UiTypographyH2 class="mb-6">Profile</UiTypographyH2>

    <div class="block lg:flex gap-8">
      <div class="w-full lg:w-2/5 grid gap-5">
        <div class="border border-accent-100 p-6">
          <div class="relative flex w-fit justify-center mx-auto">
            <UserProfilePicture :artisan="username" :custom_dimensions="true" class="h-36 w-36"/>
            <div class="absolute -right-5 bottom-0 flex items-center gap-2 bg-white border-green-500 rounded-full border px-2">
              <UserProfileOnlineStatus class="relative" :is_online="true" :is_displayed="true"/>
              <UiTypographyP class="text-green-500">Online</UiTypographyP>
            </div>
          </div>
          <UiTypographyH3 class="text-center mt-4 mb-3">{{username}}</UiTypographyH3>

          <div class="border-t border-accent-100 grid grid-cols-1 gap-4 py-4">
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

        <div class="border border-accent-100 p-6 duration-150 ease-in-out">
          <div class="flex justify-between items-center mb-3">
            <UiTypographyH3>Description</UiTypographyH3>
            <UiButtonsSecondary @clicked="toggleDescription()">Edit Description</UiButtonsSecondary>
          </div>
          <UiTypographyP :class="description_edit ? 'bg-gray-100 p-4 h-44 overflow-y-scroll focus:outline-none active:outline-none duration-150 ease-in-out' : ''" class="mb-4" :contenteditable="description_edit" :small_text="true">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor perspiciatis ipsam quo rerum itaque assumenda nisi corporis eaque, provident nihil optio enim ullam perferendis illum mollitia obcaecati, possimus praesentium doloremque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum omnis minus incidunt quis ullam quisquam facere. Fugiat, debitis! Quas sint magni culpa, expedita odio totam possimus illum aut nulla fuga.</UiTypographyP>
          <div :class="description_edit ? 'flex' : 'hidden'" class="items-center gap-3 my-3 duration-150 ease-in-out">
            <UiButtonsTertiary @clicked="toggleDescription()" :flexdisplay="true">Cancel</UiButtonsTertiary>
            <UiButtonsPrimary  @clicked="toggleDescription()" :flexdisplay="true" :standout="true">Update</UiButtonsPrimary>
          </div>

          <div class="border-t mt-4">
            <div class="flex justify-between items-center my-3">
              <UiTypographyH3>Languages</UiTypographyH3>
              <UiButtonsSecondary @clicked="toggleDescription()">Add new</UiButtonsSecondary>
            </div>
            <UiTypographyP>English <span class="text-slate-400 text-sm">- Native</span></UiTypographyP>
            <UiTypographyP class="mt-1">French <span class="text-slate-400 text-sm">- Basic</span></UiTypographyP>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-3/5 mt-8 lg:mt-0">
        <div class="border border-accent-100 flex divide-x divide-accent-100">
          <div :class="tab.active ? 'bg-primary text-white' : 'hover:bg-secondary'" class="px-4 py-2 duration-500 ease-in-out group" v-for="tab in tabs" :key="tab.id">
            <UiTypographyP :class="tab.active ? 'text-white' : 'text-secondary'" class="duration-500 ease-in-out group-hover:text-white">{{tab.title}}</UiTypographyP>
          </div>
        </div>
        <div class="mt-5 grid md:grid-cols-2 gap-3">
          <div class="bg-accent-50 h-48 w-full"></div>
          <div class="bg-accent-50 h-48 w-full"></div>
          <div class="bg-accent-50 h-48 w-full"></div>
          <div class="bg-accent-50 h-48 w-full flex items-center justify-center">
            <div>
              <div class="w-24 h-24 rounded-full bg-accent-200 flex items-center justify-center p-2 relative mx-auto mb-4">
                <div class="w-1.5 h-8 bg-white"></div>
                <div class="w-1.5 h-8 bg-white rotate-90 absolute"></div>
              </div>
              <UiTypographyP>Create a new gig</UiTypographyP>
            </div>
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
      tabs: [
        {
          id: 1,
          title: 'Active Gigs',
          active: true
        },
        {
          id: 2,
          title: 'Paused Gigs',
          active: false
        },
        {
          id: 3,
          title: 'Modifications',
          active: false
        },
      ]
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