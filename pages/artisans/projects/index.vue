<template>
  <div class="min-h-screen">
    <UiTypographyH2>Manage Gigs</UiTypographyH2>

    <div class="mt-6 flex justify-end w-full">
      <UiButtonsPrimary>List a New Project</UiButtonsPrimary>
    </div>

    <div class="border border-accent-100 flex divide-x divide-accent-100 mt-4">
      <div :class="tab.active ? 'bg-primary text-white' : 'hover:bg-secondary'" class="px-4 py-2 duration-500 ease-in-out group" v-for="tab in tabs" :key="tab.id">
        <UiTypographyP :class="tab.active ? 'text-white' : 'text-secondary'" class="duration-500 ease-in-out group-hover:text-white">{{tab.title}}</UiTypographyP>
      </div>
    </div>
    <table class="w-full mt-6 table-auto hidden lg:block">
      <thead class="bg-accent-50 border-accent-100 border">
        <tr class="px-4 py-2">
          <th class="text-left px-4 py-2">
            <UiTypographyP>Gig</UiTypographyP>
          </th>
          <th class="text-center px-2">
            <UiTypographyP>Impressions</UiTypographyP>
          </th>
          <th class="text-center px-2">
            <UiTypographyP>Clicks</UiTypographyP>
          </th>
          <th class="text-center px-2">
            <UiTypographyP>Orders</UiTypographyP>
          </th>
          <th class="text-center px-2">
            <UiTypographyP>Cancellations</UiTypographyP>
          </th>
          <th class="h-0 px-4">
            <UiButtonsTertiary class="h-0 opacity-0">View</UiButtonsTertiary>
          </th>
        </tr>
      </thead>
      <tbody class="border-accent-100 border divide-y w-full">
        <tr v-for="gig in 5" class="w-full">
          <td class="flex gap-3 items-center px-4 py-2">
            <div class="gig-img"></div>
            <UiTypographyP :small_text="true">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse, consequuntur et? Officia, minima iusto reprehenderit numquam non hic quam ipsum nam dignissimos magni ad atque placeat error omnis tempore expedita!</UiTypographyP>
          </td>
          <td class="text-center px-2">
            <UiTypographyP :small_text="true">10</UiTypographyP>
          </td>
          <td class="text-center px-2">
            <UiTypographyP :small_text="true">3</UiTypographyP>
          </td>
          <td class="text-center px-2">
            <UiTypographyP :small_text="true">0</UiTypographyP>
          </td>
          <td class="text-center px-2">
            <UiTypographyP :small_text="true">0%</UiTypographyP>
          </td>
          <td class="mx-0">
            <UiButtonsTertiary class="mx-auto block">View</UiButtonsTertiary>
          </td>
        </tr>
      </tbody>
    </table>

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
<style>
  .gig-img {
    width: 5rem !important;
    min-width: 5rem;
    background-color: #D3D3D3;
    aspect-ratio: 3/2;
  }
</style>