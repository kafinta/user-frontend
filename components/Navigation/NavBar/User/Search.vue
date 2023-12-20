<template>
  <nav class="fixed z-100 w-full top-0 border-b border-accent-100 bg-white">
    <Container :addTopBottomPadding="false" class="flex items-center gap-5 py-4 w-full">
      <div>
        <NavigationLogo class="w-36" @logoClicked="$router.push({path: '/'})"></NavigationLogo>
      </div> 

      <NavigationMenu class="flex justify-end" @revealMenu="toggleMenu()" />

      <form @submit.prevent="pushSearch" class="mx-auto w-full md:flex items-center justify-end relative hidden">
        <input @focus="focus()" @input="$emit('input', $event.target.value)" v-model="search_input" class="flex justify-center py-3 px-4 border text-sm outline-none border-secondary ring-0 focus:outline-none focus:border-primary active:border-primary rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out bg-white" autocomplete="off" ref="input" type="text" placeholder="What are you looking for?" />

        <button type="submit" class="bg-primary rounded-md p-3 absolute px-4">
          <UiIconsSearch class="text-white w-5 h-6" />
        </button>
      </form>

      <nav class="hidden md:block">
        <ul class="flex gap-5 items-center" v-if="signedIn">
          <li class="">
            <UiButtonsSecondary>Switch to Selling</UiButtonsSecondary>
          </li>

          <li class="relative cursor-pointer">
            <slot />
          </li>
          <li v-if="earning" class="hidden">
            <p class="text-primary border text-sm border-primary rounded-md px-2 py-1">${{earning}}</p>
          </li>
        </ul>

        <ul v-else class="flex gap-5 items-center">
          <li>
            <UiButtonsSecondary class="w-16" @clicked="$router.push({path: '/login'})">Sign In</UiButtonsSecondary>
          </li>
          <li>
            <UiButtonsPrimary class="w-32" @click="$router.push({path: '/signup'})">Sign Up</UiButtonsPrimary>
          </li>
        </ul>
      </nav>

      <NavigationNavBarUserMobile :menu_revealed="toggle_menu"></NavigationNavBarUserMobile>
    </Container>

  </nav>
</template>

<script>
export default {
  data() {
    return {
      toggle_menu: false,
      search_input: ''
    }
  },

  props: {
    is_online: Boolean,
    signedIn: {
      type: Boolean,
      default: true
    },
    notifications: Boolean,
    messages: Boolean,
    username: {
      default: `$route.params.username`,
      type: String
    },
    earning: Number,
    profileImagePath: String
  },

  methods: {
    toggleMenu(){
      this.toggle_menu = !this.toggle_menu
    },

    focus(){
      this.$refs.input.focus()
    },

    pushSearch(){
      this.$router.push({name: 'marketplace-search', query: {query: this.search_input}})
      this.$location.reload()
    }
  },
}
</script>