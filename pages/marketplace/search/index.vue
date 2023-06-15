<template>
  <LayoutsMarketplace>
    
    <div class="flex justify-between items-center">
      <UiTypographyH2>Search results for "{{search_input}}"</UiTypographyH2>
      <UiButtonsPrimary @clicked="openDialog=true">
        <div class="flex gap-5">
          <p>Filters</p>
          <UiIconsFilter class="w-5 flex m-0" />
        </div>
      </UiButtonsPrimary>
    </div>

    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 mt-5">
      <UserProductsMinimal v-for="item in 30" :key="item" />
    </div>

    <ModalsDrawer :openDialog="openDialog" @closeDialog="openDialog=false">
      <template #title>Filters</template>
      <div class="h-full">
        <Accordion :class="filter_revealed ? 'block' : 'hidden md:block'" class="">
          <AccordionItem container_class="border border-accent-100 py-3 px-5"
            trigger_class="" active>
            <template #accordion-trigger>
              <UiTypographyP>Status</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab>Active</UiButtonsTab>
                <UiButtonsTab>Active</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem container_class="border border-accent-100 py-3 px-5 mt-3"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Category</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab>Active</UiButtonsTab>
                <UiButtonsTab>Active</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </div>
    </ModalsDrawer>

  </LayoutsMarketplace>
</template>
<script>
export default {
  data() {
    return {
      filter_revealed: false,
      search_input: '',
      openDialog: false
    }
  },


  created() {
    this.search_input = this.$route.query.query
    console.log(this.search_input)
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