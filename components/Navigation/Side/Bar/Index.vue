<template>
  <transition name="slide-fade">
    <nav class="fixed z-100 top-0 left-0 w-4/6 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col justify-between bg-secondary h-screen">
      <!-- Top section with logo and navigation links -->
      <div class="mt-6">
        <div class="px-8">
          <NavigationLogoInverted class="w-36 text-white" />
        </div>

        <div class="mt-6">
          <!-- Navigation menu items - conditional rendering based on mode -->
          <!-- Seller navigation items -->
          <template v-if="currentMode === 'seller'">
            <template v-for="(item, index) in sellerNavigationItems" :key="`seller-${index}`">
              <nuxt-link
                v-if="item.showWhen ? item.showWhen() : true"
                :to="item.to"
              >
                <NavigationSideMenu
                  :menu_text="item.text"
                  :is_active="isRouteActive(item.route)"
                  :isSeller="item.requiresSeller ? isSeller : true"
                >
                  <component :is="iconComponents[item.icon]" />
                </NavigationSideMenu>
              </nuxt-link>
            </template>
          </template>

          <!-- Buyer navigation items -->
          <template v-else>
            <template v-for="(item, i) in buyerNavigationItems" :key="`buyer-${i}`">
              <nuxt-link :to="item.to">
                <NavigationSideMenu
                  :menu_text="item.text"
                  :is_active="isRouteActive(item.route)"
                >
                  <component :is="iconComponents[item.icon]" />
                </NavigationSideMenu>
              </nuxt-link>
            </template>
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

        <!-- Switch mode buttons - conditional based on current mode and roles -->
        <div>
          <!-- When in seller mode, show switch to buying -->
          <UiButtonsPrimary
            v-if="currentMode === 'seller'"
            @clicked="switchToBuying"
            class="mt-4 bg-primary"
            :standout="true"
            :flexdisplay="true"
          >
            Switch to Buying
          </UiButtonsPrimary>

          <!-- When in buyer mode and user is a seller, show switch to selling -->
          <UiButtonsPrimary
            v-else-if="isSeller"
            @clicked="switchToSelling"
            class="mt-4 bg-primary"
            :standout="true"
            :flexdisplay="true"
          >
            Switch to Selling
          </UiButtonsPrimary>

          <!-- When in buyer mode and user is not a seller, show become a seller -->
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
import { onMounted, watch, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

// Import icon components
import UiIconsProfile from '~/components/Ui/Icons/Profile.vue';
import UiIconsHome from '~/components/Ui/Icons/Home.vue';
import UiIconsGigs from '~/components/Ui/Icons/Gigs.vue';
import UiIconsCart from '~/components/Ui/Icons/Cart.vue';
import UiIconsTransactions from '~/components/Ui/Icons/Transactions.vue';
import UiIconsSettings from '~/components/Ui/Icons/Settings.vue';

// Map icon names to their component references
const iconComponents = {
  'UiIconsProfile': UiIconsProfile,
  'UiIconsHome': UiIconsHome,
  'UiIconsGigs': UiIconsGigs,
  'UiIconsCart': UiIconsCart,
  'UiIconsTransactions': UiIconsTransactions,
  'UiIconsSettings': UiIconsSettings
};

// Props with validation
const props = defineProps({
  username: {
    type: String,
    required: true
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  // Default mode can be 'seller' or 'buyer'
  defaultMode: {
    type: String,
    default: 'seller',
    validator: (value) => ['seller', 'buyer'].includes(value)
  }
});

// Router and route
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Track current mode (seller or buyer)
const currentMode = ref(props.defaultMode);

// Determine current mode based on route
const updateCurrentMode = () => {
  if (route.name && route.name.includes('selling')) {
    currentMode.value = 'seller';
  } else if (route.name && route.name.includes('buying')) {
    currentMode.value = 'buyer';
  }
};

// Seller navigation items configuration
const sellerNavigationItems = computed(() => [
  {
    text: 'Onboarding',
    route: 'onboarding',
    to: { name: 'username-selling-onboarding', params: { username: props.username } },
    icon: 'UiIconsProfile',
    requiresSeller: false,
    showWhen: () => !props.isSeller
  },
  {
    text: 'Dashboard',
    route: 'dashboard',
    to: { name: 'username-selling-dashboard', params: { username: props.username } },
    icon: 'UiIconsHome',
    requiresSeller: true
  },
  {
    text: 'Products',
    route: 'products',
    to: { name: 'username-selling-products', params: { username: props.username } },
    icon: 'UiIconsGigs',
    requiresSeller: true
  },
  {
    text: 'Orders',
    route: 'orders',
    to: { name: 'username-selling-orders', params: { username: props.username } },
    icon: 'UiIconsCart',
    requiresSeller: true
  },
  {
    text: 'Earnings',
    route: 'earnings',
    to: { name: 'username-selling-earnings', params: { username: props.username } },
    icon: 'UiIconsTransactions',
    requiresSeller: true
  }
]);

// Buyer navigation items configuration
const buyerNavigationItems = computed(() => [
  {
    text: 'Dashboard',
    route: 'dashboard',
    to: { name: 'username-buying-dashboard', params: { username: props.username } },
    icon: 'UiIconsHome'
  },
  {
    text: 'Cart',
    route: 'cart',
    to: { name: 'username-buying-cart', params: { username: props.username } },
    icon: 'UiIconsCart'
  },
  // Uncomment when orders page is ready
  // {
  //   text: 'Orders',
  //   route: 'orders',
  //   to: { name: 'username-buying-orders', params: { username: props.username } },
  //   icon: 'UiIconsTransactions'
  // }
]);

// Check if a route is active based on the current route
const isRouteActive = (routeSegment) => {
  // Check both route name and path to handle different routing scenarios
  return (
    (route.name && route.name.includes(routeSegment)) ||
    (route.path && route.path.includes(routeSegment))
  );
};

// Check if user needs to be redirected to onboarding
const checkOnboardingRedirect = () => {
  // Only redirect if user is not a seller and trying to access seller features
  if (!props.isSeller &&
      route.name &&
      route.name.includes('selling') &&
      !route.name.includes('onboarding')) {
    router.push({
      name: 'username-selling-onboarding',
      params: { username: props.username }
    });
  }
};

// Navigation methods
const switchToBuying = () => {
  currentMode.value = 'buyer';
  router.push({
    name: 'username-buying-dashboard',
    params: { username: props.username }
  });
};

const switchToSelling = () => {
  currentMode.value = 'seller';
  router.push({
    name: 'username-selling-dashboard',
    params: { username: props.username }
  });
};

const becomeASeller = () => {
  currentMode.value = 'seller';
  router.push({
    name: 'username-selling-onboarding',
    params: { username: props.username }
  });
};

const logout = async () => {
  try {
    // Call auth store logout method
    const result = await authStore.logout();

    // Show success notification using the centralized notification system
    const { $auth } = useNuxtApp();
    if (result.status === 'success') {
      $auth.notifications.showSuccess('Logged Out', result.message || 'Successfully logged out');
    } else {
      $auth.notifications.showAuthError(result.message || 'Logout failed');
    }

    // Redirect to login page
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
    const { $auth } = useNuxtApp();
    $auth.notifications.showAuthError('An unexpected error occurred during logout');

    // Still redirect to login page even if there's an error
    router.push('/auth/login');
  }
};

// Watch for route changes to update active states and current mode
watch(
  () => route.path,
  () => {
    updateCurrentMode();
    checkOnboardingRedirect();
  }
);

// Initialize on component mount
onMounted(() => {
  updateCurrentMode();
  checkOnboardingRedirect();
});
</script>