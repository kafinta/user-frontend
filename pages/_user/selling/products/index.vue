<template>
  <LayoutsSellerDashboard class="min-h-screen">
    <UiTypographyH2>Manage Products</UiTypographyH2>

    <div class="mt-6 md:flex block w-full gap-5">
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
        <div class="flex justify-between items-center w-full">
          <UiButtonsTab @clicked="filter_drawer = true" class="md:hidden border-0 p-0 flex gap-3 items-center">
            <p class="text-base">Filters</p>
            <UiIconsFilter class="w-5 group-hover:text-secondary" />
          </UiButtonsTab>
          <UiButtonsPrimary @clicked="$router.push({name: 'james-products-new'})">List a New Project</UiButtonsPrimary>
        </div>

        <div>
          <div class="hidden lg:grid grid-cols-12 mt-5">
          <UiTypographyP class="col-span-5">Product</UiTypographyP>
          <UiTypographyP class="col-span-2 mx-auto">Impressions</UiTypographyP>
          <UiTypographyP class="col-span-2 mx-auto">Clicks</UiTypographyP>
          <UiTypographyP class="col-span-2 mx-auto">Purchases</UiTypographyP>
          </div>
          <UserProductsMinimalDetailed v-for="item in 5" :key="item" class="grid gap-5 mt-2" />
        </div>
      </div>
    </div>

  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      filter_revealed: false,
      filter_drawer: false
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