<template>
  <transition name="slide-fade" >
    <nav class="fixed z-100 top-0 left-0 w-4/6 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col justify-between bg-secondary h-screen">
      <div class="mt-6">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white"/>
        </div>

        <div class="mt-6">
          <nuxt-link :to="{name: 'username-buying-dashboard'}">
            <NavigationSideMenu menu_text="Dashboard" :is_active="dashboardActive">
              <UiIconsOverview />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'username-buying-cart'}">
            <NavigationSideMenu menu_text="Cart" :is_active="cartActive">
              <UiIconsCart />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'username-buying-dashboard'}">
            <NavigationSideMenu menu_text="Orders" :is_active="OrdersActive">
              <UiIconsTransactions />
            </NavigationSideMenu>
          </nuxt-link>
        </div>
      </div>

      <div class="p-4 bg-accent-600 rounded-t-3xl">
        <div class="flex items-center gap-5">
          <div class="relative flex w-fit">
            <UserProfilePicture :username="username" :large_dimensions="true"/>
            <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="true" :is_displayed="true"/>
          </div>

          <div>
            <UiTypographyP class="text-white">{{ username }}</UiTypographyP>
            <p class="text-green-500 text-sm">$0.00</p>
          </div>
          
        </div>

        <div>
          <UiButtonsPrimary v-if="isSeller" @clicked="$router.push({name: 'username-selling-dahboard'})" class="mt-4 bg-primary" :standout="true" :flexdisplay="true">Switch to Selling</UiButtonsPrimary>
          <UiButtonsPrimary v-else @clicked="$router.push({name: 'username-selling-onboarding'})" class="mt-4 bg-primary" :standout="true" :flexdisplay="true">Become a Seller</UiButtonsPrimary>
        </div>

        <div class="mt-2 flex gap-2 w-full">
          <nuxt-link to="/username/profile" class="block rounded-md p-2 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 w-1/2">
            <UiIconsProfile class="w-5 h-5 mx-auto" />
            <p class="text-white group-hover:text-primary duration-500 ease-in-out text-sm text-center mt-1">Profile</p>
          </nuxt-link>
          <nuxt-link to="/username/settings" class="block rounded-md p-2 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 w-1/2">
            <UiIconsSettings class="w-5 h-5 mx-auto" />
            <p class="text-white group-hover:text-primary duration-500 ease-in-out text-sm text-center mt-1">Settings</p>
          </nuxt-link>
        </div>

        <button to="/sellers/settings" class="rounded-md p-3 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 flex items-center gap-3 justify-center w-full mt-2">
          <UiIconsSettings class="w-5 h-5 max-w-fit" />
          <span class="text-white group-hover:text-primary duration-500 ease-in-out text-sm">Log out</span>
        </button>
      </div>
    </nav>
  </transition>
</template>

<script>
export default {
  props: {
    username: {
      default: 'username',
      type: String
    },
    isSeller: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      dashboardActive: false,
      OrdersActive: false,
      cartActive: false,
    };
  },

  methods: {
    routeCheck(){
      if (this.$route.name.includes('dashboard')) {
        this.dashboardActive = true
      }
      if (this.$route.name.includes('cart')) {
        this.cartActive = true
      }
      if (this.$route.name.includes('orders')) {
        this.OrdersActive = true
      }
    },
  },

  mounted() {
    this.routeCheck()
  },
}
</script>

<style>
</style>