<template>
  <nav class="fixed z-100 w-full top-0">
    <div class="flex items-center justify-between gap-5 px-6 md:px-8 lg:px-10 py-4 bg-white max-w-7xl mx-auto w-full">
      <div>
        <NavigationLogo class="w-36" @logoClicked="$router.push({path: '/'})"></NavigationLogo>
      </div>

      <NavigationMenu class="flex justify-end" @revealMenu="toggleMenu()" />

      <form class="mx-auto w-full md:flex items-center justify-end relative hidden">
        <input @focus="focus()" @input="$emit('input', $event.target.value)" class="w-full flex justify-center py-3 px-4 border text-sm outline-none border-secondary ring-0 focus:outline-none focus:border-primary active:border-primary rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out" autocomplete="off" ref="input" type="text" placeholder="What are you looking for?" />

        <button class="bg-primary rounded-md p-3 absolute px-4">
          <UiIconsSearch class="text-white w-5 h-6" />
        </button>
      </form>

      <nav class="hidden md:block">
        <ul class="flex gap-5 items-center justify-end" v-if="signedIn">
          <li class="relative cursor-pointer">
            <UiIconsNotifications class="w-4 h-4" />
            <UiIconsPopup v-if="notifications" class="h-2 w-2 -top-0.5 right-0 absolute"></UiIconsPopup>
          </li>
          <li class="relative cursor-pointer">      
            <UiIconsMessages class="w-4 h-4" />
            <UiIconsPopup v-if="messages" class="h-2 w-2 -top-0.5 -right-1 absolute"></UiIconsPopup>
          </li>
          <li class="">
            <UiButtonsSecondary class="w-[7.3rem] xl:w-[8.3rem] 2xl:w-[9.3rem]">Switch to Selling</UiButtonsSecondary>
          </li>

          <li class="relative cursor-pointer">
            <slot />
          </li>
          <li v-if="earning" class="hidden">
            <p class="text-primary border text-sm border-primary rounded-md px-2 py-1">${{earning}}</p>
          </li>
        </ul>

        <ul class="flex gap-5 items-center justify-end" v-if="!signedIn">
          <li>
            <UiButtonsSecondary class="w-12 xl:w-14 2xl:w-16" @clicked="$router.push({path: '/login'})">Sign In</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsPrimary class="w-[8.5rem]" @click="$router.push({path: '/signup'})">Sign Up</UiButtonsPrimary>
          </li>
        </ul>
      </nav>

      <NavigationNavBarUserMobile :menu_revealed="toggle_menu"></NavigationNavBarUserMobile>
    </div>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      toggle_menu: false,
    }
  },

  props: {
    is_online: Boolean,
    signedIn: Boolean,
    notifications: Boolean,
    messages: Boolean,
    username: String,
    earning: Number,
    profileImagePath: String
  },

  methods: {
    toggleMenu(){
      this.toggle_menu = !this.toggle_menu
    },

    focus(){
      this.$refs.input.focus()
    }
  },
}
</script>