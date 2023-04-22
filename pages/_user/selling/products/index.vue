<template>
  <LayoutsSellerDashboard class="min-h-screen">
    <UiTypographyH2>Manage Projects</UiTypographyH2>

    <div class="mt-6 md:flex block w-full gap-5">
      <div class="h-full w-96 p-5">
        <button @click="filter_revealed = true" class="border-0 p-0 flex gap-3 item-center mb-5">
          <UiTypographyP>Filters</UiTypographyP>
          <UiIconsFilter class="w-5 group-hover:text-secondary" />
        </button>

        <Accordion :class="filter_revealed ? 'block' : 'hidden md:block'" class="">
          <AccordionItem container_class="border border-accent-100 py-3 px-5"
            trigger_class="" active>
            <template #accordion-trigger>
              <UiTypographyP>Status</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 grid">
                <UiButtonsAccent>Active</UiButtonsAccent>
                <UiButtonsAccent>Draft</UiButtonsAccent>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem container_class="border border-accent-100 py-3 px-5 mt-3"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Category</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 grid">
                <UiButtonsAccent>Active</UiButtonsAccent>
                <UiButtonsAccent>Draft</UiButtonsAccent>
              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </div>
      <div class="w-full">
        <div class="flex justify-end w-full">
          <UiButtonsPrimary @clicked="$router.push({path: '/artisans/projects/new'})">List a New Project</UiButtonsPrimary>
        </div>

        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 mt-5">
          <UserProductsMinimal v-for="item in 5" :key="item" />
        </div>
      </div>
    </div>

  </LayoutsSellerDashboard>
</template>
<script>
export default {
  // layout: 'seller',
  data() {
    return {
      filter_revealed: false
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