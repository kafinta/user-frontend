<template>
  <div class="py-5">
    <template v-if="isLoading">
      <UiSkeleton height="3rem" class="mb-3 w-1/2" />
      <table class="border border-accent-200 border-collapse table-fixed mt-3 w-full">
        <tr v-for="i in 6" :key="i">
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">
            <UiSkeleton height="1.5rem" class="bg-secondary bg-opacity-20" />
          </td>
          <td class="border border-accent-200 px-5 py-3">
            <UiSkeleton height="1.5rem"/>
          </td>
        </tr>
      </table>
    </template>
    <template v-else>
      <UiTypographyH2>Product Specifications</UiTypographyH2>
      <table class="border border-accent-200 border-collapse table-fixed mt-3 w-full">
        <tr>
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Product ID</td>
          <td class="border border-accent-200 px-5 py-3">{{ product?.id || 'N/A' }}</td>
        </tr>
        <tr>
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Manufactured by</td>
          <td class="border border-accent-200 px-5 py-3">{{ product?.manufacturer || 'N/A' }}</td>
        </tr>
        <tr>
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Sold by</td>
          <td class="border border-accent-200 px-5 py-3">{{ product?.seller || 'N/A' }}</td>
        </tr>
        <tr>
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Size</td>
          <td class="border border-accent-200 px-5 py-3">{{ product?.size || 'N/A' }}</td>
        </tr>
        <tr>
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Weight</td>
          <td class="border border-accent-200 px-5 py-3">{{ product?.weight || 'N/A' }}</td>
        </tr>
        <tr v-for="attr in attributes" :key="attr.id">
          <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">{{ attr.name }}</td>
          <td class="border border-accent-200 px-5 py-3">{{ attr.value?.name || 'N/A' }}</td>
        </tr>
      </table>
    </template>
  </div>
</template>
<script setup>
import UiSkeleton from '~/components/Ui/Skeleton/Index.vue';
import UiTypographyH2 from '~/components/Ui/Typography/H2.vue';
const props = defineProps({
  product: Object,
  attributes: Array,
  isLoading: Boolean
});
</script>