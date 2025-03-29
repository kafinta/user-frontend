<template>
  <NuxtLink v-if="url" :to="url" class="font-medium text-sm xl:text-base 2xl:text-lg text-secondary hover:text-primary ease-in-out duration-500 border-b border-transparent hover:border-primary select-none outline-none">
    <slot />
  </NuxtLink>
  <button v-else @click="$emit('clicked')" class="font-medium text-sm xl:text-base 2xl:text-lg text-secondary hover:text-primary ease-in-out duration-500 border-b border-transparent hover:border-primary select-none outline-none">
    <slot />
  </button>
</template>
<script setup>
const props = defineProps({
  url: {
    type: Object,
    default: null
  }
})
</script>