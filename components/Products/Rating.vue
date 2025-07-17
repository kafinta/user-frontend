<template>
  <div class="text-secondary flex gap-2 items-baseline">
    <div class="flex">
      <UiIconsStar v-if="loading" v-for="i in 5" :key="i" class="w-4 h-4 text-accent-100" />
      <UiIconsStar v-else v-for="n in 5" :key="n" class="w-4 h-4 text-yellow-500" />
    </div>
    <UiTypographyP v-if="!loading || rating">({{ rating }})</UiTypographyP>
  </div>
</template>
<script setup>
const props = defineProps({
  loading: Boolean,
  rating: Number
})
</script>