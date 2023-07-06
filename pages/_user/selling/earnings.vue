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
  </LayoutsSellerDashboard>
</template>
<script>
  export default {
    data() {
      return {
        overview: [
          {
            id: 1,
            title: "Withdrawn Funds",
            amount: 0.00,
            imagePath: require('@/assets/images/insights/completed.svg')
          },
          {
            id: 2,
            title: "Pending Funds",
            amount: 0.00,
            imagePath: require('@/assets/images/insights/pending.svg')
          },
          {
            id: 3,
            title: "Available Funds",
            amount: 0.00,
            imagePath: require('@/assets/images/insights/paid.svg')
          },
          {
            id: 4,
            title: "Total Earnings",
            amount: 0.00,
            imagePath: require('@/assets/images/insights/paid.svg')
          },
        ]
      }
    },
  }
</script>