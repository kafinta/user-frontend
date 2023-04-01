<template>
  <div class="min-h-screen">
    <UiTypographyH2>Manage Projects</UiTypographyH2>

    <div class="mt-6 flex w-full gap-5">
      <div class="h-full w-1/5 p-5">
        <button class="border-0 p-0 flex gap-3 item-center mb-5">
          <UiTypographyP>Filters</UiTypographyP>
          <UiIconsFilter class="w-5 group-hover:text-secondary" />
        </button>

        <Accordion>
          <AccordionItem container_class="py-3 px-5 bg-accent-100"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Account</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="py-3">

              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </div>
      <div class="w-4/5">
        <div class="flex justify-end w-full">
          <UiButtonsPrimary @clicked="$router.push({path: '/artisans/projects/new'})">List a New Project</UiButtonsPrimary>
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