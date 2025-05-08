<template>
  <transition name="slide-fade">
    <nav class="fixed z-100 top-0 left-0 w-4/6 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col justify-between bg-secondary h-screen">
      <!-- Top section with logo and navigation links -->
      <div class="mt-6">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white" />
        </div>

        <div class="mt-6">
          <!-- Navigation menu items -->
          <template v-for="item in navigationItems" :key="item.text">
            <nuxt-link :to="item.to">
              <NavigationSideMenu
                :menu_text="item.text"
                :is_active="isRouteActive(item.route)"
              >
                <component :is="iconComponents[item.icon]" />
              </NavigationSideMenu>
            </nuxt-link>
          </template>
        </div>
      </div>

      <!-- Bottom section with user profile and actions -->
      <div class="p-4 bg-accent-600 rounded-t-3xl">
        <!-- User profile section -->
        <div class="flex items-center gap-5">
          <div class="relative flex w-fit">
            <UserProfilePicture :username="username" :large_dimensions="true" />
            <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="true" :is_displayed="true" />
          </div>

          <div>
            <UiTypographyP class="text-white">{{ username }}</UiTypographyP>
            <p class="text-green-500 text-sm">$0.00</p>
          </div>
        </div>

        <!-- Switch mode button -->
        <div>
          <UiButtonsPrimary
            v-if="isSeller"
            @clicked="switchToSelling"
            class="mt-4 bg-primary"
            :standout="true"
            :flexdisplay="true"
          >
            Switch to Selling
          </UiButtonsPrimary>
          <UiButtonsPrimary
            v-else
            @clicked="becomeASeller"
            class="mt-4 bg-primary"
            :standout="true"
            :flexdisplay="true"
          >
            Become a Seller
          </UiButtonsPrimary>
        </div>

        <!-- Profile and settings shortcuts -->
        <div class="mt-2 flex gap-2 w-full">
          <nuxt-link
            :to="{ name: 'username-profile', params: { username } }"
            class="block rounded-md p-2 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 w-1/2"
          >
            <UiIconsProfile class="w-5 h-5 mx-auto" />
            <p class="text-white group-hover:text-primary duration-500 ease-in-out text-sm text-center mt-1">Profile</p>
          </nuxt-link>
          <nuxt-link
            :to="{ name: 'username-settings', params: { username } }"
            class="block rounded-md p-2 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 w-1/2"
          >
            <UiIconsSettings class="w-5 h-5 mx-auto" />
            <p class="text-white group-hover:text-primary duration-500 ease-in-out text-sm text-center mt-1">Settings</p>
          </nuxt-link>
        </div>

        <!-- Logout button -->
        <button
          @click="logout"
          class="rounded-md p-3 text-white hover:text-primary duration-500 ease-in-out group bg-secondary hover:bg-accent-500 flex items-center gap-3 justify-center w-full mt-2"
        >
          <UiIconsSettings class="w-5 h-5 max-w-fit" />
          <span class="text-white group-hover:text-primary duration-500 ease-in-out text-sm">Log out</span>
        </button>
      </div>
    </nav>
  </transition>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import icon components
import UiIconsProfile from '~/components/Ui/Icons/Profile.vue';
import UiIconsOverview from '~/components/Ui/Icons/Overview.vue';
import UiIconsCart from '~/components/Ui/Icons/Cart.vue';
import UiIconsTransactions from '~/components/Ui/Icons/Transactions.vue';
import UiIconsSettings from '~/components/Ui/Icons/Settings.vue';

// Map icon names to their component references
const iconComponents = {
  'UiIconsProfile': UiIconsProfile,
  'UiIconsOverview': UiIconsOverview,
  'UiIconsCart': UiIconsCart,
  'UiIconsTransactions': UiIconsTransactions,
  'UiIconsSettings': UiIconsSettings
};

// Props with validation
const props = defineProps({
  username: {
    type: String,
    default: 'username'
  },
  isSeller: {
    type: Boolean,
    default: false
  }
});

// Router and route
const router = useRouter();
const route = useRoute();

// Navigation items configuration
const navigationItems = [
  {
    text: 'Dashboard',
    route: 'dashboard',
    to: { name: 'username-buying-dashboard', params: { username: props.username } },
    icon: 'UiIconsOverview'
  },
  {
    text: 'Cart',
    route: 'cart',
    to: { name: 'username-buying-cart', params: { username: props.username } },
    icon: 'UiIconsCart'
  },
  // {
  //   text: 'Orders',
  //   route: 'orders',
  //   to: { name: 'username-buying-orders', params: { username: props.username } },
  //   icon: 'UiIconsTransactions'
  // }
];

// Check if a route is active based on the current route
const isRouteActive = (routeSegment) => {
  // Check both route name and path to handle different routing scenarios
  return (
    (route.name && route.name.includes(routeSegment)) ||
    (route.path && route.path.includes(routeSegment))
  );
};

// Navigation methods
const switchToSelling = () => {
  router.push({
    name: 'username-selling-dashboard',
    params: { username: props.username }
  });
};

const becomeASeller = () => {
  router.push({
    name: 'username-selling-onboarding',
    params: { username: props.username }
  });
};

const logout = () => {
  // Implement logout functionality
  console.log('Logging out...');
  // Call your auth store logout method here
  // router.push('/auth/login');
};

// Watch for route changes to update active states
watch(
  () => route.path,
  () => {
    // No need for additional checks in the buyer sidebar
  }
);

// Initialize on component mount
onMounted(() => {
  // No need for additional initialization in the buyer sidebar
});
</script>