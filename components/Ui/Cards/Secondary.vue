<template>
  <nuxt-link to="" class="cursor-pointer group w-72">
    <div class="">
      <div class="background rounded-t-2xl h-48 w-72 transform ease-in-out duration-500" :style="{ background:`url(${backgroundImagePath})`}"></div>

      <div class="py-2 px-5 bg-slate-50 rounded-b-2xl flex gap-3 items-center w-72">
        <slot/>
        <div>
          <UiTypographyP class="text-left">{{title}}</UiTypographyP>
          <p class="text-xs text-secondary text-opacity-50 text-left" v-if="artisan">by {{ artisan }}</p>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    backgroundImagePath: String,
    title: String,
    artisan: String,
    urlPath: String,
    profileImagePath: String
  },
}
</script>

<style>
  .background {
    background-position: center center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }

  .profile_background {
    height: 2rem;
    width: 2rem;
    background-position: center center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }
</style>