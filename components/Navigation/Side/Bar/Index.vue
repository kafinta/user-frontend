<template>
  <transition name="slide-fade" >
    <nav class="fixed z-100 top-0 left-0 w-4/6 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col justify-between bg-secondary h-screen">
      <div class="mt-6">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white"/>
        </div>

        <div class="mt-6">
          <nuxt-link :to="{name: 'user-selling-dashboard'}">
            <NavigationSideMenu menu_text="Dashboard" :is_active="dashboardActive">
              <UiIconsOverview />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'user-selling-inbox'}">
            <NavigationSideMenu menu_text="Inbox" :is_active="inboxActive">
              <UiIconsMessages />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'user-selling-products'}">
            <NavigationSideMenu menu_text="Products" :is_active="productsActive">
              <UiIconsGigs />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'user-selling-orders'}">
            <NavigationSideMenu menu_text="Orders" :is_active="OrdersActive">
              <UiIconsCart />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'user-selling-earnings'}">
            <NavigationSideMenu menu_text="Earnings" :is_active="earningsActive">
              <UiIconsTransactions />
            </NavigationSideMenu>
          </nuxt-link>
        </div>
      </div>

      <div class="py-6 bg-accent-600 rounded-t-2xl">
        <div class="flex items-center gap-5 px-6">
          <div class="relative flex w-fit">
            <UserProfilePicture :username="user_info.username" :custom_dimensions="true" class="h-10 w-10"/>
            <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="true" :is_displayed="true"/>
          </div>

          <div>
            <UiTypographyP class="text-white">{{ user_info.username }}</UiTypographyP>
            <p class="text-green-500 text-sm">$0.00</p>
          </div>
        </div>

        <div class="px-6">
          <UiButtonsPrimary @clicked="$router.push({path: '/sellers'})" class="mt-4 bg-primary" :standout="true" :flexdisplay="true">Switch to Buying</UiButtonsPrimary>
        </div>

        <div class="px-6 mt-2 flex gap-2 w-full">
          <nuxt-link to="/sellers/profile" class="block rounded-md p-2 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 w-1/2">
            <UiIconsProfile class="w-5 h-5 mx-auto" />
            <p class="text-white group-hover:text-primary duration-500 ease-in-out text-sm text-center mt-1">Profile</p>
          </nuxt-link>
          <nuxt-link to="/sellers/settings" class="block rounded-md p-2 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 w-1/2">
            <UiIconsSettings class="w-5 h-5 mx-auto" />
            <p class="text-white group-hover:text-primary duration-500 ease-in-out text-sm text-center mt-1">Settings</p>
          </nuxt-link>
        </div>

      </div>
    </nav>
  </transition>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  data() {
    return {
      dashboardActive: false,
      inboxActive: false,
      gigsActive: false,
      OrdersActive: false,
      earningsActive: false,
      productsActive: false
    };
  },

  computed: {
    ...mapGetters({
      user_info: "authentication/getUserInfo",
    }),
  },

  methods: {
    ...mapActions({
      getUser: 'authentication/retrieveUserInfo'
    }),

    routeCheck(){
      if (this.$route.name.includes('dashboard')) {
        this.dashboardActive = true
      }
      if (window.location.pathname.includes('inbox')) {
        this.inboxActive = true
      }
      if (window.location.pathname.includes('products')) {
        this.productsActive = true
      }
      if (window.location.pathname.includes('orders')) {
        this.OrdersActive = true
      }
      if (window.location.pathname.includes('earnings')) {
        this.earningsActive = true
      }
    },
  },

  mounted() {
    this.getUser()
    this.routeCheck()
  },
}
</script>

<style>
</style>