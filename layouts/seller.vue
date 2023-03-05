<template>
  <div class="flex items-center">
    <NavigationSideBar />
    <div class="w-4/5 md:w-1/3 lg:w-1/5 xl:w-1/6 2xl:w-1/8"></div>
    <div class="px-6 md:px-8 lg:px-10 py-6 mx-auto">
      <Nuxt/>
      <slot />
      <NavigationFooter />
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