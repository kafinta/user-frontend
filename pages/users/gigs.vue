<template>
  <div class="min-h-screen">
    <UiTypographyH2>Manage Gigs</UiTypographyH2>

    <div class="mt-6 flex justify-end w-full">
      <UiButtonsPrimary>Create a New Gig</UiButtonsPrimary>
    </div>

    <div class="border border-accent-100 flex divide-x divide-accent-100 mt-4">
      <div :class="tab.active ? 'bg-primary text-white' : 'hover:bg-secondary'" class="px-4 py-2 duration-500 ease-in-out group" v-for="tab in tabs" :key="tab.id">
        <UiTypographyP :class="tab.active ? 'text-white' : 'text-secondary'" class="duration-500 ease-in-out group-hover:text-white">{{tab.title}}</UiTypographyP>
      </div>
    </div>  

  </div>
</template>
<script>
export default {
  layout: 'seller',
  data() {
    return {
      tabs: [
        {
          id: 1,
          title: 'Active',
          main_title: 'Active Gigs',
          active: true
        },
        {
          id: 2,
          title: 'Pending Approval',
          main_title: 'Gigs Pending Approval',
          active: false
        },
        {
          id: 3,
          title: 'Draft',
          main_title: 'Draft Gigs',
          active: false
        },
        {
          id: 4,
          title: 'Paused',
          main_title: 'Paused Gigs',
          active: false
        },
      ]
    }
  },
}
</script>