<template>
  <transition name="slide-fade" >
    <nav class="fixed z-100 top-0 left-0 w-4/6 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col justify-between bg-secondary h-screen">
      <div class="mt-6">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white"/>
        </div>

        <div class="mt-6">
          <nuxt-link v-if="!isSeller" :to="{name: 'username-selling-onboarding'}">
            <NavigationSideMenu menu_text="Onboarding" :is_active="onboardingActive" :isSeller="!isSeller">
              <UiIconsProfile />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'username-selling-dashboard'}">
            <NavigationSideMenu menu_text="Dashboard" :is_active="dashboardActive" :isSeller="isSeller">
              <UiIconsOverview />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'username-selling-products'}">
            <NavigationSideMenu menu_text="Products" :is_active="productsActive" :isSeller="isSeller">
              <UiIconsGigs />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'username-selling-orders'}">
            <NavigationSideMenu menu_text="Orders" :is_active="OrdersActive" :isSeller="isSeller">
              <UiIconsCart />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link :to="{name: 'username-selling-earnings'}">
            <NavigationSideMenu menu_text="Earnings" :is_active="earningsActive" :isSeller="isSeller">
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
          <UiButtonsPrimary @clicked="$router.push({name: 'username-buying-dashboard'})" class="mt-4 bg-primary" :standout="true" :flexdisplay="true">Switch to Buying</UiButtonsPrimary>
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
    username:String,
    isSeller: {
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      onboardingActive: false,
      dashboardActive: false,
      gigsActive: false,
      OrdersActive: false,
      earningsActive: false,
      productsActive: false
    };
  },

  methods: {
    checkOnboarding(){
      if (this.isSeller === false) {
        this.$router.push({name: 'username-selling-onboarding'})
      }
    },

    routeCheck(){

      if (this.$route.name.includes('onboarding')) {
        this.onboardingActive = true
      }
      if (this.$route.name.includes('dashboard')) {
        this.dashboardActive = true
        this.checkOnboarding()
      }
      if (window.location.pathname.includes('products')) {
        this.productsActive = true
        this.checkOnboarding()
      }
      if (window.location.pathname.includes('orders')) {
        this.OrdersActive = true
        this.checkOnboarding()
      }
      if (window.location.pathname.includes('earnings')) {
        this.earningsActive = true
        this.checkOnboarding()
      }
    },
  },

  mounted() {
    // this.getUser()
    this.routeCheck()
  },
}
</script>

<style>
</style>