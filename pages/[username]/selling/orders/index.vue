<template>
  <LayoutsSellerDashboard page_title="Orders Overview">
    <ul class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 w-full">
      <li class="rounded-2xl border border-accent-100 block" v-for="cards in 6">
        <ProductsImage class="rounded-t-2xl" />
        <div class="p-5 flex flex-col gap-5">
          <ProductsName>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</ProductsName>
          <ul class="grid grid-cols-2 gap-5">
            <li>
              <UiTypographyH3>5</UiTypographyH3>
              <UiTypographyP>Quantity</UiTypographyP>
            </li>
            <li>
              <UiTypographyH3>$9999</UiTypographyH3>
              <UiTypographyP>Price</UiTypographyP>
            </li>
            <li>
              <UiTypographyH3>{{ new Date().toLocaleDateString() }}</UiTypographyH3>
              <UiTypographyP>Date</UiTypographyP>
            </li>
            <li>
              <h3 class="text-xl md:text-2xl 2xl:text-3xl font-medium" :class="status === 'completed' ? 'text-green-600' : status === 'cancelled' ? 'text-red-600' : status === 'shipped' ? 'text-orange-500' : status === 'delivered' ? 'text-green-600' : status === 'pending' ? 'text-pink-500' : 'text-secondary'">Pending</h3>
              <UiTypographyP>Status</UiTypographyP>
            </li>
          </ul>
          <UiButtonsPrimary :flexdisplay="true">View</UiButtonsPrimary>
        </div>
      </li>
    </ul>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      image: '',
      status: 'pending',
      orders: 10
    }
  }
}
</script>
<style>
th, td {
  padding: 1rem;
}
</style>