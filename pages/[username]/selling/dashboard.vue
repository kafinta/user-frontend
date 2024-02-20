<template>
  <LayoutsSellerDashboard page_title="Seller Dashboard">
    <div class="border border-accent-100 rounded-md divide-y divide-x lg:divide-y-0 divide-accent-100 grid grid-cols-2 lg:grid-cols-4">
      <div class="p-5 flex gap-5 items-center">
        <img src="/images/insights/completed.svg" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>Your Products</UiTypographyP>
          <UiTypographyH2>0</UiTypographyH2>
        </div>
      </div>
      <div class="p-5 flex gap-5 items-center">
        <img src="/images/insights/pending.svg" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>Active Orders</UiTypographyP>
          <UiTypographyH2>0</UiTypographyH2>
        </div>
      </div>
      <div class="p-5 flex gap-5 items-center">
        <img src="/images/insights/completed.svg" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>Completed Orders</UiTypographyP>
          <UiTypographyH2>0</UiTypographyH2>
        </div>
      </div>
      <div class="p-5 flex gap-5 items-center">
        <UiIconsCart class="w-8 h-8 text-primary" />
        <div>
          <UiTypographyP>Total Earnings</UiTypographyP>
          <UiTypographyH2>$0.00</UiTypographyH2>
        </div>
      </div>
    </div>
    <div class="mt-8">
      <div class="flex items-center justify-between">
        <UiTypographyH3>Active Orders</UiTypographyH3>
        <UiButtonsSecondary @clicked="$router.push({name: 'username-selling-orders'})" class="flex gap-1 items-center">
            See All
          <UiIconsAccordion class="transform rotate-90 w-4 h-4" />
        </UiButtonsSecondary>
      </div>
      <ul class="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-4">
        <OrdersCard v-for="item in 2" :key="item" />
      </ul>
    </div>
    <div class="mt-8">
      <div class="flex items-center justify-between">
        <UiTypographyH3>Top Products</UiTypographyH3>
        <UiButtonsSecondary @clicked="$router.push({name: 'username-selling-products'})" class="flex gap-1 items-center">
            See All
        <UiIconsAccordion class="transform rotate-90 w-4 h-4" />
        </UiButtonsSecondary>
      </div>      
      <ul class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <ProductsCard v-for="item in 3" />
      </ul>
    </div>
  </LayoutsSellerDashboard>

</template>

<script>
export default {
  data() {
    return {
      username: 'Quadri',
      description_edit: false,
      date: '',
      tabs: [
        {
          id: 1,
          title: 'Active Orders',
          count: 0,
          active: true
        },
        {
          id: 2,
          title: 'Completed Orders',
          active: false
        },
        {
          id: 3,
          title: 'Canceled Orders',
          active: false
        },
      ]
    }
  },

  computed: {
  },

  methods: {
  },

  mounted(){
    setTimeout(() => {
      this.date = new Date()
    }, 2000);
  },
}
</script>

<style>
</style>