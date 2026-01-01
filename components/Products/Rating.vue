<template>
  <div class="text-secondary flex gap-2 items-baseline">
    <div class="flex">
      <!-- Loading state: all gray stars -->
      <UiIconsStar v-if="loading" v-for="i in 5" :key="i" class="w-4 h-4 text-accent-100" />
      <!-- Loaded state: filled, half, and empty stars based on rating -->
      <div v-else class="flex relative">
        <UiIconsStar v-for="n in 5" :key="n" class="w-4 h-4 text-accent-200" />
        <div class="absolute top-0 left-0 flex overflow-hidden" :style="{ width: `${(rating || 0) * 20}%` }">
          <UiIconsStar v-for="n in 5" :key="`filled-${n}`" class="w-4 h-4 text-yellow-500" />
        </div>
      </div>
    </div>
    <UiTypographyP v-if="!loading && rating">({{ rating }})</UiTypographyP>
  </div>
</template>
<script setup>
const props = defineProps({
  loading: Boolean,
  rating: Number
})
</script>