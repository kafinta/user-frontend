<template>
  <div class="min-h-screen">
    <UiTypographyH2>Manage Gigs</UiTypographyH2>

    <div class="mt-6 flex justify-end w-full gap-5">
      <UiButtonsTertiary>Filter</UiButtonsTertiary>
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