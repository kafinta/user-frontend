<template>
  <transition name="slide-fade" >
    <div class="fixed top-0 left-0 w-4/5 md:w-1/3 lg:w-1/5 xl:w-1/6 2xl:w-1/8 md:flex flex-col justify-between bg-secondary py-10 h-screen">
      <div class="px-6 md:px-10">
        <NavigationLogo class="w-36 text-white"/>
      </div>

      <div class="my-10">

        <div class="my-3">
          <nuxt-link to="/">
            <SideMenu :is_active="homeActive" menu_text="Dashboard">
            </SideMenu>
          </nuxt-link>
        </div>

      </div>
    </div>
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