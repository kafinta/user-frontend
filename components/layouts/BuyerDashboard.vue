<template>
  <div class="flex w-full select-none">
    <NavigationSideBarBuying :username="username" :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="md:translate-x-0 duration-150 ease-in-out" />
    <div class="w-4/5 md:w-1/4 lg:w-1/5 xl:w-1/6 hidden md:block"></div>
    <SharedBackdrop :show="menu_revealed" @close="toggleMenu()" />

    <nav class="flex mx-auto items-center max-h-fit justify-between px-6 py-4 bg-white w-full z-10 fixed md:hidden">
      <div class="w-36">
        <NavigationLogo @logoClicked="$router.push({name: '/'})"></NavigationLogo>
      </div>

      <div class="flex md:hidden" @click="toggleMenu">
        <div class="w-8">
          <div :class="(mobile_nav ? 'transition transform rotate-45 items-center w-8' : 'transition w-8') + ' ' + (BlockBackground ? 'bg-primary' : 'bg-primary')" class="block cursor-pointer" style="height: 3px;"></div>
          <div :class="(mobile_nav ? 'transition transform -rotate-45 item-center w-8 -mt-0.5' : 'transition w-8 mt-1.5') + ' ' + (BlockBackground ? 'bg-primary' : 'bg-primary')"  class="block cursor-pointer" style="height: 3px;"></div>
        </div>
      </div>    
    </nav>

    <div class="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 mt-12 md:mt-0 left-0">
      <UiTypographyH3 v-show="page_title" class="py-3 px-6 md:px-8 lg:px-10 border-b border-accent-200">{{ page_title }}</UiTypographyH3>
      <div class="py-6 px-6 md:px-8 lg:px-10 mx-auto min-h-screen">
        <slot />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      online_presence: true,
      menu_revealed: false,
      mobile_nav: false,
      username: this.$route.params.username
    }
  },

  props: { 
    BlockBackground: Boolean,
    page_title: String,
  },

  methods: {
    toggleMenu(){
      this.mobile_nav = !this.mobile_nav
      this.menu_revealed = !this.menu_revealed
    },
  },
}
</script>