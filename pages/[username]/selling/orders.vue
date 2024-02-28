<template>
  <LayoutsSellerDashboard page_title="Purchases Overview">
    <div class="flex gap-5">
      <div class="h-full hidden md:block w-80 lg:w-96 p-5">
        <button @click="filter_revealed = true" class="border-0 p-0 flex gap-3 items-center mb-5">
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
                <UiButtonsTab>Active</UiButtonsTab>
                <UiButtonsTab>Draft</UiButtonsTab>
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
                <UiButtonsTab>Active</UiButtonsTab>
                <UiButtonsTab>Draft</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </div>
      <div class="w-full">
        <div class="grid-cols-5 hidden lg:grid">
          <UiTypographyP>Product</UiTypographyP>
          <UiTypographyP class="mx-auto">Status</UiTypographyP>
          <UiTypographyP class="mx-auto">Purchase date</UiTypographyP>
          <UiTypographyP class="mx-auto">Delivery date</UiTypographyP>
        </div>
        <div class="hover:border-accent-200 lg:hover:border-accent-100 ease-in-out duration-500 cursor-pointer lg:cursor-default border border-accent-100 p-2 w-full grid lg:grid-cols-5 items-center mt-4" v-for="item in 5">
          <div class="bg-accent-100 aspect-[3/2] w-1/2"></div>
          <div class="mx-auto">
            <UiTypographyP>In Progress</UiTypographyP>
          </div>
          <div class="hidden lg:block mx-auto">
            <UiTypographyP>Date</UiTypographyP>
          </div>
          <div class="hidden lg:block mx-auto">
            <UiTypographyP>Date</UiTypographyP>
          </div>
          <div class="hidden lg:flex justify-end">
            <UiButtonsTertiary>View</UiButtonsTertiary>
          </div>
        </div>
      </div>

    </div>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      username: 'Quadri',
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