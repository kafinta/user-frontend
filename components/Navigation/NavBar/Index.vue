<template>
  <nav class="max-h-fit py-4 bg-white w-full z-100 fixed">
    <Container :addTopBottomPadding="false" class="flex items-center justify-between">
      <div class="w-36">
        <NavigationLogo @logoClicked="reloadPage()"></NavigationLogo>
      </div>

      <button class="flex md:hidden" @click="toggleMenu">
        <div class="w-8">
          <div :class="mobile_nav ? 'transition transform rotate-45 items-center w-8' : 'transition w-8'" class="block cursor-pointer bg-primary" style="height: 3px;"></div>
          <div :class="mobile_nav ? 'transition transform -rotate-45 item-center w-8 -mt-0.5' : 'transition w-8 mt-1.5'" class="block cursor-pointer bg-primary" style="height: 3px;"></div>
        </div>
      </button>

      <nav :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="md:h-fit z-100 md:static w-full md:w-fit fixed h-screen left-0 top-[66px] md:top duration-150 ease-in-out md:translate-x-0 bg-white">
        <ul class="grid grid-cols-1 place-items-center md:flex gap-5 md:gap-3 lg:gap-5 items-center px-6 pt-20 md:p-0">
          <li>
            <UiButtonsSecondary  @clicked="toggleSearchBox" class="flex gap-2 group items-center">
              <UiIconsSearch :class="keep_button_hovered ? 'text-primary' : 'text-secondary'" class=" group-hover:text-primary w-5 h-5 duration-500 ease-in-out"></UiIconsSearch>
              <span :class="keep_button_hovered ? 'text-primary border-primary' : ''">Search</span>
            </UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsSecondary @clicked="$router.push({name: 'marketplace-projects'})">Projects</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsSecondary @clicked="$router.push({name: 'marketplace'})">Marketplace</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsSecondary @clicked="$router.push({name: 'auth-login'})">Sign In</UiButtonsSecondary>
          </li>
          <li >
            <UiButtonsPrimary @clicked="$router.push({name: 'auth-signup'})">Sign Up</UiButtonsPrimary>
          </li>
        </ul>
      </nav>
    </Container>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menu_revealed: false,
      mobile_nav: false
    }
  },

  props: {
    keep_button_hovered: Boolean
  },

  methods: {
    toggleMenu(){
      this.mobile_nav = !this.mobile_nav
      this.menu_revealed = !this.menu_revealed
    },

    toggleSearchBox(){
      this.toggleMenu()
      this.mobile_nav = false
      this.$emit("toggleSearchBox")
    },
  }
}
</script>

<style>

</style>