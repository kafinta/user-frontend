<template>
  <div class="py-5">
    <template v-if="isLoading">
      <UiSkeleton height="2rem" class="mb-3 w-1/2" />
      <UiSkeleton height="1rem" class="mb-1" v-for="i in 8" :key="i" />
    </template>
    <template v-else>
      <UiTypographyH2>Product Description</UiTypographyH2>
      <UiTypographyP>{{ product?.description || 'N/A' }}</UiTypographyP>
    </template>
  </div>
</template>
<script setup>
import UiSkeleton from '~/components/Ui/Skeleton/Index.vue';
import UiTypographyH2 from '~/components/Ui/Typography/H2.vue';
import UiTypographyP from '~/components/Ui/Typography/P.vue';
const props = defineProps({
  product: Object,
  isLoading: Boolean
});
</script>