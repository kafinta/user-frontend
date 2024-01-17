<template>
  <nav class="fixed z-100 w-full top-0 border-b border-accent-100 bg-white">
    <div class="max-w-7xl 2xl:max-w-8xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-5 py-4">
      <div class="w-36">
        <NavigationLogo @logoClicked="$router.push({path: '/'})" />
      </div> 

        <form @submit.prevent="pushSearch" class="w-1/2 md:flex relative hidden">
          <input @focus="focus()" @input="$emit('input', $event.target.value)" v-model="search_input" class="w-full flex justify-center py-3 px-4 border text-sm outline-none border-secondary ring-0 focus:outline-none focus:border-primary active:border-primary rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out bg-white" autocomplete="off" ref="input" type="text" placeholder="What are you looking for?" />

          <button type="submit" class="bg-primary rounded-md p-3 absolute px-4 right-0 top-0">
            <UiIconsSearch class="text-white w-5 h-[22px]" />
          </button>
        </form>

        <div class="hidden md:flex">
          <ul class="flex gap-5 items-center" v-if="signedIn">
            <li v-if="isSeller">
              <UiButtonsSecondary @clicked="$router.push({name: ''})">Switch to Selling</UiButtonsSecondary>
            </li>
            <li>
              <UiButtonsTertiary :flexdisplay="true">
                <UiIconsCart class="w-5" />
                <span>Cart</span>
              </UiButtonsTertiary>
            </li>
            <li class="relative">
              <UserProfilePicture @click="toggleOptions()" :large_dimensions="true" :username="username" class="cursor-pointer" />

              <div ref="userOptions" :class="user_options ? 'grid gap-1' : 'hidden'" class=" p-2 rounded-md border border-accent-100 text-secondary absolute bg-white right-0 w-48 mt-4">
                <NuxtLink :to="{name: 'username-buying', params: {username: username}}" class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer">Dashboard</NuxtLink>
                <NuxtLink :to="{name: 'username-buying', params: {username: username}}" class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer">Profile</NuxtLink>
                <NuxtLink :to="{name: 'username-buying', params: {username: username}}" class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer">Orders</NuxtLink>
                <hr>
                <button class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer text-left">Log out</button>
              </div>
            </li>
          </ul>

          <ul v-else class="flex gap-5 items-center w-fit">
            <li>
              <UiButtonsSecondary class="w-16" @clicked="$router.push({path: '/login'})">Sign In</UiButtonsSecondary>
            </li>
            <li>
              <UiButtonsPrimary class="w-32" @click="$router.push({path: '/signup'})">Sign Up</UiButtonsPrimary>
            </li>
          </ul>
        </div>

      <!-- <NavigationMenu class="flex justify-end" @revealMenu="toggleMenu()" /> -->

      <!-- <NavigationNavBarUserMobile :menu_revealed="toggle_menu"></NavigationNavBarUserMobile> -->
    </div>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      toggle_menu: false,
      user_options: false,
      search_input: ''
    };
  },
  props: {
    is_online: Boolean,
    signedIn: {
      type: Boolean,
      default: true
    },
    isSeller: {
      type: Boolean,
      default: true
    },
    username: {
      default: 'Username',
      type: String
    },
    profileImagePath: String
  },
  methods: {
    toggleMenu() {
      this.toggle_menu = !this.toggle_menu;
    },
    focus() {
      this.$refs.input.focus();
    },
    pushSearch() {
      this.$router.push({ name: 'marketplace-search', query: { query: this.search_input } });
      this.$location.reload();
    },
    toggleOptions(){
      this.user_options = !this.user_options
    },
  },
  mounted(){
  }
}
</script>