<template>
  <div v-if="imagePath" :style="{background:`url(${imagePath})`}" class="w-full product background"></div>
  <div v-else class="bg-accent-100 product w-full"></div>
</template>
<script setup>
const props = defineProps({
  imagePath: {
    type: String,
    default: ''
  }
});
</script>