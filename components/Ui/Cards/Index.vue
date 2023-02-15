<template>
  <nuxt-link to="" class="cursor-pointer group">
    <div style="height: 16rem; width: 14rem;" class="background rounded-2xl transform ease-in-out duration-500 hover:scale-90" :style="{ background:`url(${backgroundImagePath})`}">
      <div class="w-full h-full p-5 flex items-end bg-gradient-to-b from-transparent via-transparent to-black rounded-b-2xl">
        <UiTypographyP :is_white="true">{{title}}</UiTypographyP>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    backgroundImagePath: String,
    title: String,
    urlPath: String,
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