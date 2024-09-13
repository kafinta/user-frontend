<template>
  <button @click="$emit('clicked')" class="cursor-pointer group rounded-xl border border-accent-300 p-3 h-full bg-secondary">
    <UiTypographyH3 color="white" class="text-left  mt-2 mb-5">{{title}}</UiTypographyH3>
    <img :src="backgroundImagePath" class="aspect-[4/3] w-full rounded-md" alt="Image">
  </button>
</template>

<script>
export default {
  props: {
    backgroundImagePath: String,
    title: String,
    query: Object
  },
}
</script>

<style>
  .background {
    background-position: center center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }
</style>