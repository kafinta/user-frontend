<template>
  <LayoutsSellerDashboard page_title="Earnings overview">
    <div class="border border-accent-100 rounded-md divide-x divide-accent-100 grid grid-cols-2 lg:grid-cols-4">
      <div class="p-5 flex gap-5 items-center" v-for="item in overview" :key="item.id">
        <img :src="item.imagePath" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>{{ item.title }}</UiTypographyP>
          <UiTypographyH2>${{ item.amount }}</UiTypographyH2>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="grid grid-cols-4 py-2 gap-2 justify-between px-10">
        <UiTypographyP class="">Amount</UiTypographyP>
        <UiTypographyP class="mx-auto">Clearance Date</UiTypographyP>
        <UiTypographyP class="mx-auto">Product</UiTypographyP>
      </div>
      <div class="py-2 px-10 border-accent-100 border grid grid-cols-4 items-center mb-2" v-for="item in 5">
        <UiTypographyP class="">$0.00</UiTypographyP>
        <UiTypographyP class="mx-auto">00/00/0000</UiTypographyP>
        <div class="bg-accent-100 w-12 aspect-[3/2] mx-auto"></div>
        <div class="flex justify-end">
          <UiButtonsTertiary>View Order</UiButtonsTertiary>
        </div>
      </div>
    </div>
  </LayoutsSellerDashboard>
</template>
<script>
import completed from '@/assets/images/insights/completed.svg'
import paid from '@/assets/images/insights/paid.svg'
import pending from '@/assets/images/insights/pending.svg'
  export default {
    data() {
      return {
        overview: [
          {
            id: 1,
            title: "Withdrawn Funds",
            amount: 0.00,
            imagePath: completed
          },
          {
            id: 2,
            title: "Pending Funds",
            amount: 0.00,
            imagePath: pending
          },
          {
            id: 3,
            title: "Available Funds",
            amount: 0.00,
            imagePath: paid
          },
          {
            id: 4,
            title: "Total Earnings",
            amount: 0.00,
            imagePath: paid
          },
        ]
      }
    },
  }
</script>