<template>
  <transition name="slide-fade" >
    <nav class="fixed top-0 left-0 w-3/5 md:w-1/3 lg:w-1/5 xl:w-1/6 md:flex flex-col justify-between bg-secondary h-screen">
      <div class="mt-8">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white"/>
        </div>

        <div class="mt-10">
          <nuxt-link to="/users/profile">
            <NavigationSideMenu menu_text="Dashboard" :is_active="dashboardActive">
              <UiIconsOverview />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link to="/users/profile">
            <NavigationSideMenu menu_text="Inbox" :is_active="inboxActive">
              <UiIconsMessages />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link to="/users/profile">
            <NavigationSideMenu menu_text="Manage Gigs" :is_active="gigsActive">
              <UiIconsGigs />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link to="/users/dashboard">
            <NavigationSideMenu menu_text="Orders" :is_active="OrdersActive">
              <UiIconsCart />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link to="/users/profile">
            <NavigationSideMenu menu_text="Earnings" :is_active="earningsActive">
              <UiIconsTransactions />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link to="/users/profile">
            <NavigationSideMenu menu_text="Profile" :is_active="profileActive" >
              <UiIconsProfile />
            </NavigationSideMenu>
          </nuxt-link>

          <nuxt-link to="/users/profile">
            <NavigationSideMenu menu_text="Settings" :is_active="settingsActive" >
              <UiIconsSettings />
            </NavigationSideMenu>
          </nuxt-link>
        </div>
      </div>


    </nav>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      dashboardActive: false,
      inboxActive: false,
      gigsActive: false,
      OrdersActive: false,
      earningsActive: false,
      profileActive: false,
      settingsActive: false,
    };
  },
  methods: {
    routeCheck(){
      if (this.$route.name.includes('dashboard')) {
        this.dashboardActive = true
      }
      if (this.$route.name.includes('inbox')) {
        this.inboxActive = true
      }
      if (this.$route.name.includes('gigs')) {
        this.gigsActive = true
      }
      if (this.$route.name.includes('orders')) {
        this.OrdersActive = true
      }
      if (this.$route.name.includes('earnings')) {
        this.earningsActive = true
      }
      if (this.$route.name.includes('profile')) {
        this.profileActive = true
      }
      if (this.$route.name.includes('settings')) {
        this.settingsActive = true
      }
    },
  },

  created() {
    this.routeCheck();
  },
}
</script>

<style>
</style>