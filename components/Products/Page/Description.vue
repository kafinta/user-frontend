<template>
  <div class="mt-2">
    <template v-if="isLoading">
      <UiSkeleton height="2rem" class="mb-3 w-1/2" />
      <UiSkeleton height="1rem" class="mb-1" v-for="i in 8" :key="i" />
    </template>
    <template v-else>
      <UiTypographyH3>Product Description</UiTypographyH3>
      <UiTypographyP class="mt-3">{{ product?.description || 'N/A' }}</UiTypographyP>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  product: Object,
  isLoading: Boolean
});
</script>