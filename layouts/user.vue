<template>
  <div>
    <NavigationNavBarUser :messages="true" :notifications="true" username="Quadri" :is_online="online_presence" :earning="99" class="border-b border-slate-200" />
      <div class="px-6 md:px-8 lg:px-10 py-6 max-w-7xl mx-auto">
        <Nuxt />
        <slot />
      </div>
    <NavigationFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      online_presence: false
    }
  },
}
</script>

<style>

</style>