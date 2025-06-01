<template>
  <div class="flex w-full select-none">
    <!-- Sidebar navigation - visible on all screens (md+) or when toggled (mobile) -->
    <NavigationSideBar
      :isSeller="isSeller"
      :username="username"
      :defaultMode="mode"
      :class="[
        'duration-150 ease-in-out md:translate-x-0',
        menuRevealed ? 'translate-x-0' : '-translate-x-full'
      ]"
    />

    <!-- Spacer div to maintain layout when sidebar is visible -->
    <div class="w-4/5 md:w-1/4 lg:w-1/5 xl:w-1/6 hidden md:block"></div>

    <!-- Backdrop overlay when mobile menu is open -->
    <SharedBackdrop :show="menuRevealed" @close="toggleMenu" />

    <!-- Mobile navigation header -->
    <nav class="flex mx-auto items-center justify-between px-6 py-4 bg-white w-full z-10 fixed md:hidden">
      <div class="w-36">
        <NavigationLogo @logoClicked="handleLogoClick"></NavigationLogo>
      </div>

      <!-- Mobile menu toggle button -->
      <button
        class="flex md:hidden"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <div class="w-8">
          <div
            class="block cursor-pointer bg-primary"
            :class="[
              mobileNavOpen ? 'transition transform rotate-45 items-center w-8' : 'transition w-8',
            ]"
            style="height: 3px;"
          ></div>
          <div
            class="block cursor-pointer bg-primary"
            :class="[
              mobileNavOpen ? 'transition transform -rotate-45 item-center w-8 -mt-0.5' : 'transition w-8 mt-1.5',
            ]"
            style="height: 3px;"
          ></div>
        </div>
      </button>
    </nav>

    <!-- Main content area -->
    <div class="w-full md:w-3/4 lg:w-4/5 xl:w-5/6 mt-12 md:mt-0 left-0">
      <!-- Page title header -->
      <UiTypographyH3
        v-if="pageTitle"
        class="py-3 px-6 md:px-8 lg:px-10 border-b border-accent-200"
      >
        {{ pageTitle }}
      </UiTypographyH3>

      <!-- Main content -->
      <main class="px-6 md:px-8 lg:px-10 py-6 mx-auto min-h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

// Props with validation
const props = defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  // Mode can be 'seller' or 'buyer'
  mode: {
    type: String,
    default: 'buyer',
    validator: (value) => ['seller', 'buyer'].includes(value)
  }
});

// Route and router for navigation
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const menuRevealed = ref(false);
const mobileNavOpen = ref(false);

// Computed properties
const username = computed(() => route.params.username || 'username');
const isSeller = computed(() => authStore.isSeller);

// Methods
function toggleMenu() {
  menuRevealed.value = !menuRevealed.value;
  mobileNavOpen.value = !mobileNavOpen.value;
}

// Handle logo click based on mode
function handleLogoClick() {
  if (props.mode === 'seller') {
    // Reload page (seller behavior)
    window.location.reload();
  } else {
    // Navigate to home (buyer behavior)
    router.push({ name: '/' });
  }
}

// Roles are now handled by middleware when needed
// No automatic role fetching on dashboard mount to prevent race conditions
</script>
