<template>
  <div class="flex items-center justify-between gap-5 px-6 md:px-8 lg:px-10 py-4 bg-white max-w-7xl w-full">
    <div>
      <NavigationLogo class="w-36" @logoClicked="reloadPage()"></NavigationLogo>
    </div>

    <form class="mx-auto w-full md:flex items-center justify-end relative hidden">
      <input @focus="this.$refs.input.focus()"  class="w-full flex justify-center py-3 px-4 border text-sm outline-none border-secondary ring-0 focus:outline-none focus:border-primary active:border-primary rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out" autocomplete="off" ref="input" type="text" placeholder="What are you looking for?" />

      <button class="bg-primary rounded-md p-3 absolute px-4">
        <UiIconsSearch class="text-white w-5 h-5" />
      </button>
    </form>

    <NavigationMenu @revealMenu="toggleMenu()" />

    <nav class="max-w-full hidden md:block">
      <ul class="flex gap-5 items-center justify-end">
        <li class="relative cursor-pointer">
          <UiIconsNotifications class="w-4 h-4" />
          <div v-if="notifications" class="h-2 w-2 rounded-full bg-primary border-white border -top-0.5 right-0 absolute"></div>
        </li>
        <li class="relative cursor-pointer">      
          <UiIconsMessages class="w-4 h-4" />
          <div v-if="messages" class="h-2 w-2 rounded-full bg-primary border-white border -top-0.5 -right-1 absolute"></div>
        </li>
        <li class="hidden lg:block">
          <UiButtonsSecondary class="flex justify-center" style="width: 7.3rem;">Switch to Selling</UiButtonsSecondary>
        </li>

        <li class="relative cursor-pointer">
          <div v-if="profileImagePath" class="profile_background rounded-full transform ease-in-out duration-500" :style="{ background:`url(${profileImagePath})`}"></div>
          <div v-if="!profileImagePath" class="w-8 h-8 rounded-full text-white text-center font-bold bg-secondary bg-opacity-20 transform ease-in-out duration-500 flex items-center justify-center">
            {{ first_letter }}
          </div>
          <div :class="is_online ? 'bg-green-600' : 'bg-secondary bg-opacity-50'" class="h-2.5 w-2.5 rounded-full border-white border bottom-0 right-0 absolute"></div>
          <div class="hidden">{{ username }}</div>
        </li>
        <li v-if="earning" class="hidden">
          <p class="text-primary border text-sm border-primary rounded-md px-2 py-1">${{earning}}</p>
        </li>
      </ul>
    </nav>

    <nav :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="z-10 md:z-0 w-full fixed h-screen left-0 top-[65.5px] md:hidden duration-500 ease-in-out bg-white">
    </nav>

  </div>
</template>

<script>
export default {
  data() {
    return {
      menu_revealed: false,
      first_letter: ''
    }
  },

  props: {
    is_online: Boolean,
    notifications: Boolean,
    messages: Boolean,
    username: String,
    earning: Number,
    profileImagePath: String
  },

  methods: {
    toggleMenu(){
      this.menu_revealed = !this.menu_revealed
    },

    reloadPage(){
      return navigateTo('/')
    },

    getFirstLetter(){
      setTimeout(() => {
        if (this.username !== undefined && this.username !== '') {
          this.first_letter = this.username.slice(0,1)
      } else {
        console.log("error")
      }
      }, 1000);
    }
  },

  created(){
    this.getFirstLetter()
  }
}
</script>

<style>
  .profile_background {
    height: 2rem;
    width: 2rem;
    background-position: center center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }
</style>