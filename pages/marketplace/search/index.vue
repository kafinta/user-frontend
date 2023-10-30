<template>
  <LayoutsMarketplace>
    
    <div class="flex justify-between items-center">
      <UiTypographyH2>Search results for <b>{{$route.query.query}}</b></UiTypographyH2>
      <UiButtonsPrimary @clicked="openDialog=true" class="lg:hidden">
        <div class="flex gap-5">
          <p>Filters</p>
          <UiIconsFilter class="w-5 flex m-0" />
        </div>
      </UiButtonsPrimary>
    </div>
    <div class="flex gap-5 mt-10">
      <aside  class="lg:w-1/4 2xl:w-1/5 hidden lg:block">
        <UiTypographyP class="mb-2">Filters</UiTypographyP>
        <Accordion>
          <AccordionItem container_class="border border-accent-100 py-3 px-5"
            trigger_class="" active>
            <template #accordion-trigger>
              <UiTypographyP>Category</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab v-for="category in 2" :key="category">Category</UiButtonsTab>
                <UiButtonsTab v-for="category in 1" :key="category">Category Item</UiButtonsTab>
                <UiButtonsTab v-for="category in 3" :key="category">Category Type</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem container_class="border border-accent-100 py-3 px-5 mt-3"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Price</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab>10k - 25k</UiButtonsTab>
                <UiButtonsTab>25k - 50k</UiButtonsTab>
                <UiButtonsTab>50k - 100k</UiButtonsTab>
                <UiButtonsTab>100k - 500k</UiButtonsTab>
                <UiButtonsTab>500k - 1m</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem container_class="border border-accent-100 py-3 px-5 mt-3"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Location</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab v-for="location in locations" :key="location">{{ location }}</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </aside>

      <div class="w-full">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
          <UserProductsMinimal v-for="item in 30" :key="item" />
        </div>
          <div class="join gap-1 mt-10 justify-center w-full">
            <button class="join-item btn">«</button>
            <button class="join-item btn btn-active">1</button>
            <button class="join-item btn">»</button>
          </div>
      </div>

    </div>


    <ModalsDrawer okText="Apply" :scrollable="true" :footerButtons="true" :openDialog="openDialog" @closeDialog="openDialog=false">
      <template #title>Filters</template>
      <div class="h-full">
        <Accordion :class="filter_revealed ? 'block' : 'hidden md:block'" class="">
          <AccordionItem container_class="border border-accent-100 py-3 px-5"
            trigger_class="" active>
            <template #accordion-trigger>
              <UiTypographyP>Category</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab v-for="category in 2" :key="category">Category</UiButtonsTab>
                <UiButtonsTab v-for="category in 1" :key="category">Category Item</UiButtonsTab>
                <UiButtonsTab v-for="category in 3" :key="category">Category Type</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem container_class="border border-accent-100 py-3 px-5 mt-3"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Price</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab>10k - 25k</UiButtonsTab>
                <UiButtonsTab>25k - 50k</UiButtonsTab>
                <UiButtonsTab>50k - 100k</UiButtonsTab>
                <UiButtonsTab>100k - 500k</UiButtonsTab>
                <UiButtonsTab>500k - 1m</UiButtonsTab>
              </div>
            </template>
          </AccordionItem>

          <AccordionItem container_class="border border-accent-100 py-3 px-5 mt-3"
            trigger_class="">
            <template #accordion-trigger>
              <UiTypographyP>Location</UiTypographyP>
            </template>

            <template #accordion-content>
              <div class="gap-3 mt-3 flex flex-wrap">
                <UiButtonsTab v-for="location in locations" :key="location">{{ location }}</UiButtonsTab>
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
      openDialog: false,
      locations: []
    }
  },


  mounted() {

  },

  computed: {
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