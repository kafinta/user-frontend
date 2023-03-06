<template>
  <transition name="slide-fade" >
    <nav class="fixed top-0 left-0 w-3/5 md:w-1/3 lg:w-1/5 xl:w-1/6 md:flex flex-col justify-between bg-secondary py-10 h-screen">
      <div class="px-6 md:px-10">
        <NavigationLogoInverted class="w-36 text-white"/>
      </div>

      <div class="my-10">
        <nuxt-link to="/">
          <NavigationSideMenu>
          </NavigationSideMenu>
        </nuxt-link>

      </div>
    </nav>
  </transition>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    routeCheck(){

    }
  },

  created() {
      this.routeCheck();
  },
}
</script>

<style>
</style>