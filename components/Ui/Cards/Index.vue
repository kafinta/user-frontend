<template>
  <button @click="$emit('clicked')" class="cursor-pointer group">
    <div style="width: 100%;" class="aspect-square background rounded-2xl transform ease-in-out duration-500 hover:scale-90" :style="{ background:`url(${backgroundImagePath})`}">
      <div class=" text-left w-full h-full p-5 flex items-end bg-gradient-to-b from-transparent via-transparent to-black rounded-b-2xl">
        <UiTypographyH3 color="white">{{title}}</UiTypographyH3>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    backgroundImagePath: String,
    title: String,
    urlPath: String,
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