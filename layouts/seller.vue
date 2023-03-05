<template>
  <div class="flex w-full">
    <NavigationSideBar />
    <div class="w-4/5 md:w-1/3 lg:w-1/5 xl:w-1/6"></div>
    <div class="w-full md:w-2/3 lg:w-4/5 xl:w-5/6">
      <div class="px-6 md:px-8 lg:px-10 py-6 mx-auto">
        <Nuxt/>
        <slot />
      </div>
      <NavigationFooter class="w-full" />
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      online_presence: true
    }
  },
}
</script>

<style>

</style>