<template>
  <transition name="slide-fade" >
    <div class="relative z-10">
      <div class="fixed top-0 left-0 w-4/5 md:w-1/3 lg:w-1/5 xl:w-1/6 2xl:w-1/6 md:flex flex-col justify-between bg-accent2-100 dark:bg-accent1-900 py-10 h-screen">

          <div class="pr-16 pl-10 md:px-10 lg:px-6 2xl:px-8 w-full">
            <NavigationLogo class="" />
          </div>

          <div class="my-10">

            <div class="my-3">
              <nuxt-link to="/">
                <SideMenu :is_active="homeActive" menu_text="Dashboard">
                  <Dashboard />
                </SideMenu>
              </nuxt-link>
            </div>

            <div class="my-3">
              <nuxt-link to="/overview">
                <SideMenu :is_active="analyticsActive" menu_text="Overview">
                  <Overview />
                </SideMenu>
              </nuxt-link>
            </div>

            <div class="my-3">
              <nuxt-link to="/books">
                <SideMenu :is_active="libraryActive" menu_text="Books">
                  <Library />
                </SideMenu>
              </nuxt-link>
            </div>

            <div class="my-3">
              <nuxt-link to="/categories">
                <SideMenu :is_active="categoriesActive" menu_text="Categories">
                  <Gridfilled />
                </SideMenu>
              </nuxt-link>
            </div>

            <div class="my-3">
              <nuxt-link to="/users">
                <SideMenu :is_active="usersActive" menu_text="Users">
                  <Users />
                </SideMenu>
              </nuxt-link>
            </div>

            <div class="my-3">
              <nuxt-link to="/transactions">
                <SideMenu :is_active="transactionsActive" menu_text="Transactions">
                  <Transactions />
                </SideMenu>
              </nuxt-link>
            </div>

            <div class="my-3">
              <nuxt-link to="/settings">
                <SideMenu :is_active="settingsActive" menu_text="Settings">
                  <Settings />
                </SideMenu>
              </nuxt-link>
            </div>
          </div>

        <div class="h1">

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SideMenu from './SideMenu.vue'
import Dashboard from '../Icons/Dashboard.vue'
import Overview from '../Icons/Overview.vue'
import Library from '../Icons/Library.vue'
import Users from '../Icons/Users.vue'
import Cart from '../Icons/Cart.vue'
import Transactions from '../Icons/Transactions.vue'
import Profile from '../Icons/Profile.vue'
import Settings from '../Icons/Settings.vue'
import Gridfilled from '../Icons/Gridfilled.vue'
export default {
  data() {
    return {
      homeActive: false,
      libraryActive: false,
      usersActive: false,
      analyticsActive: false,
      transactionsActive: false,
      profileActive: false,
      settingsActive: false,
      categoriesActive: false,
    };
  },
  methods: {
    routeCheck() {
      if (this.$route.name === "index") {
        this.homeActive = true;
      }
      else {
        if (this.$route.name === "books" || this.$route.name === "books-id") {
          this.libraryActive = true;
        }
        else {
          if (this.$route.name === "users" || this.$route.name === "view_user") {
            this.usersActive = true;
          }
          else {
            if (this.$route.name === "overview") {
              this.analyticsActive = true;
            }
            else {
              if (this.$route.name === "transactions") {
                this.transactionsActive = true;
              }
              else {
                if (this.$route.name === "profile") {
                  this.profileActive = true;
                }
                else {
                  if (this.$route.name === "settings") {
                    this.settingsActive = true;
                  }
                  else {
                    if (this.$route.name === "categories" || this.$route.name === "edit_category") {
                      this.categoriesActive = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  created() {
      this.routeCheck();
  },
  components: { SideMenu, Dashboard, Overview, Library, Users, Cart, Transactions, Profile, Settings, Gridfilled }
}
</script>

<style>
</style>