<template>
  <div class="min-h-screen">
    <UiTypographyH2>Manage Gigs</UiTypographyH2>

    <div class="mt-6 flex justify-end w-full gap-5">
      <UiButtonsTertiary class="group">
        <div class="flex gap-3 item-center">
          <UiTypographyP class="group-hover:text-primary duration-500">Filter</UiTypographyP>
          <UiIconsFilter class="w-5" />
        </div>
      </UiButtonsTertiary>
      <UiButtonsPrimary @clicked="$router.push({path: '/artisans/projects/new'})">List a New Project</UiButtonsPrimary>
    </div>

  </div>
</template>
<script>
export default {
  layout: 'seller',
  data() {
    return {
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