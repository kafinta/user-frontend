<template>
  <div class="flex w-full">
    <NavigationSideBar :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="md:translate-x-0 duration-150 ease-in-out" />
    <div class="w-4/5 md:w-1/3 lg:w-1/5 xl:w-1/6 hidden md:block"></div>

    <nav class="flex mx-auto items-center max-h-fit justify-between px-6 py-4 bg-white w-full z-90 fixed md:hidden">
        <div class="w-36">
          <NavigationLogo @logoClicked="reloadPage()"></NavigationLogo>
        </div>
        <NavigationMenu @revealMenu="toggleMenu()" />
    </nav>

    <div class="w-full md:w-2/3 lg:w-4/5 xl:w-5/6 mt-12 md:mt-0 left-0">
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
      online_presence: true,
      menu_revealed: false,
    }
  },

  methods: {
    toggleMenu(){
      this.menu_revealed = !this.menu_revealed
    },
  },
}
</script>

<style>

</style>