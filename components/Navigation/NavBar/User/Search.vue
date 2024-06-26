<template>
  <nav class="fixed z-100 w-full top-0 border-b border-accent-200 bg-white">
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
            <UiButtonsSecondary @clicked="$router.push({name: 'username-selling', params: {username: 'username'}})">Switch to Selling</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsTertiary :flexdisplay="true" @clicked="$emit('cartClicked')">
              <UiIconsCart class="w-5" />
              <span>Cart</span>
            </UiButtonsTertiary>
          </li>
          <li class="relative">
            <UserProfilePicture @click="toggleOptions()" :large_dimensions="true" :username="username" class="cursor-pointer" />

            <div ref="userOptions" :class="user_options ? 'grid gap-1' : 'hidden'" class="p-2 px-3 rounded-md border border-accent-200 text-secondary absolute bg-white right-0 w-56 mt-4">
              <div class="flex gap-5 items-center py-2">
                <UserProfilePicture @click="toggleOptions()" :custom_dimensions="true" :username="username" class="cursor-pointer w-12" />
                <div>
                  <UiTypographyP><span class="font-medium">{{ username }}</span></UiTypographyP>
                  <UiTypographyP>Seller</UiTypographyP>
                </div>
              </div>
              <hr>
              <NuxtLink :to="{name: 'username-buying-dashboard', params: {username: username}}" class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer mt-1">Dashboard</NuxtLink>
              <NuxtLink :to="{name: 'username-profile', params: {username: username}}" class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer">Profile</NuxtLink>
              <NuxtLink :to="{name: 'username-buying-dashboard', params: {username: username}}" class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer mb-1">Orders</NuxtLink>
              <hr>
              <button class="w-full hover:bg-accent-100 py-2 px-4 rounded cursor-pointer text-left mt-1">Log out</button>
            </div>
          </li>
        </ul>

        <ul v-else class="flex gap-5 items-center w-fit">
          <li>
            <UiButtonsSecondary class="w-16" @clicked="$router.push({path: '/auth/login'})">Sign In</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsPrimary class="w-32" @click="$router.push({path: '/auth/signup'})">Sign Up</UiButtonsPrimary>
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-6">
        <UiButtonsSecondary @clicked="toggleSearchBox()" class="flex gap-2 group items-center md:hidden">
          <UiIconsSearch :class="keep_button_hovered ? 'text-primary' : 'text-secondary'" class=" group-hover:text-primary w-5 h-5 duration-500 ease-in-out"></UiIconsSearch>
          <span :class="keep_button_hovered ? 'text-primary border-primary' : ''">Search</span>
        </UiButtonsSecondary>
        
        <NavigationMenu class="flex justify-end" @revealMenu="toggleMenu()" />
      </div>
      <NavigationNavBarUserMobile :menu_revealed="toggle_menu" :isSeller="isSeller" :signedIn="signedIn"></NavigationNavBarUserMobile> 
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
      default: false
    },
    isSeller: {
      type: Boolean,
      default: false
    },
    username: {
      default: 'testing',
      type: String
    },
    profileImagePath: String,
    keep_button_hovered: Boolean
  },
  methods: {
    toggleMenu() {
      this.toggle_menu = !this.toggle_menu;
    },
    focus() {
      this.$refs.input.focus();
    },
    pushSearch() {
      this.$router.push({ name: 'marketplace-products', query: { query: this.search_input } });
      this.$location.reload();
    },
    toggleOptions() {
      this.user_options = !this.user_options;
    },
    toggleCart() {
      this.openCart = !this.openCart;
    },
    toggleSearchBox(){
      this.$emit("toggleSearchBox")
    },
  },
  mounted() {
  },
}
</script>