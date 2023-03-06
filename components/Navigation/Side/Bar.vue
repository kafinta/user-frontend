<template>
  <transition name="slide-fade" >
    <nav class="fixed top-0 left-0 w-3/5 md:w-1/3 lg:w-1/5 xl:w-1/6 md:flex flex-col justify-between bg-secondary h-screen">
      <div class="mt-8">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white"/>
        </div>

        <div class="mt-10">
          <nuxt-link to="/dashboard">
            <NavigationSideMenu menu_text="Dashboard" :is_active="false">
              <UiIconsDashboard />
            </NavigationSideMenu>
          </nuxt-link>
        </div>
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
      if (this.$route.name.includes('profile')) {
        console.log(this.$route.name)
      }
    }
  },

  created() {
    this.routeCheck();
  },
}
</script>

<style>
</style>