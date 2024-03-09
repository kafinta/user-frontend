<template>
  <LayoutsSellerDashboard page_title="Orders Overview">
    <table class="w-full table-auto text-secondary">
      <thead class="text-left bg-accent-100 border border-accent-100">
        <tr>
          <th class="text-sm md:text-base 2xl:text-lg font-medium">Product</th>
          <th class="text-sm md:text-base 2xl:text-lg font-medium">Order No</th>
          <th class="text-sm md:text-base 2xl:text-lg font-medium">Quantity</th>
          <th class="text-sm md:text-base 2xl:text-lg font-medium">Amount</th>
          <th class="text-sm md:text-base 2xl:text-lg font-medium">Date</th>
          <th class="text-sm md:text-base 2xl:text-lg font-medium">Status</th>
        </tr>
      </thead>

      <tbody class="gap-6">
        <tr @click="" class="text-left border border-accent-100 rounded-2xl cursor-pointer" v-for="items in 5">
          <td>
            <!-- <ProductsImage :imagePath="image" class="w-24 rounded-sm"></ProductsImage> -->
            <div class="product w-24 h-auto rounded-md bg-accent-100"></div>
          </td>
          <td class="text-sm md:text-base 2xl:text-lg">5</td>
          <td class="text-sm md:text-base 2xl:text-lg">0000</td>
          <td class="text-sm md:text-base 2xl:text-lg">{{ new Date().toLocaleDateString() }}</td>
          <td><ProductsPrice class="w-1/4" /></td>
          <td class="text-sm md:text-base 2xl:text-lg">
            <button :class="status === 'completed' ? 'text-green-600' : status === 'cancelled' ? 'text-red-600' : status === 'shipped' ? 'text-orange-500' : status === 'delivered' ? 'text-green-600' : status === 'pending' ? 'text-pink-500' : 'text-secondary'" class="capitalize w-1/4">{{ status }}</button>
          </td>
        </tr>
      </tbody>

    </table>
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