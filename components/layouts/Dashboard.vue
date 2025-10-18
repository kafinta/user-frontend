<template>
  <div class="flex w-full select-none">
    <!-- Sidebar navigation - visible on all screens (md+) or when toggled (mobile) -->
    <NavigationSideBar
      :username="username"
      :defaultMode="mode"
      :class="[
        'duration-150 ease-in-out md:translate-x-0',
        menuRevealed ? 'translate-x-0' : '-translate-x-full'
      ]"
    />

    <!-- Spacer div to maintain layout when sidebar is visible -->
    <div class="w-4/5 md:w-64 hidden md:block"></div>

    <!-- Backdrop overlay when mobile menu is open -->
    <SharedBackdrop :show="menuRevealed" @close="toggleMenu" />

    <!-- Mobile navigation header -->
    <nav class="flex mx-auto items-center justify-between px-6 py-4 bg-white w-full z-10 fixed md:hidden">
      <div class="w-36">
        <NavigationLogo @logoClicked="handleLogoClick"></NavigationLogo>
      </div>

      <!-- Mobile menu toggle button -->
      <button
        class="flex md:hidden p-2 hover:bg-accent-100 rounded-md transition-colors duration-200"
        @click="toggleMenu"
        :aria-label="menuRevealed ? 'Close menu' : 'Open menu'"
        :aria-expanded="menuRevealed"
      >
        <div class="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
          <!-- Top line -->
          <div
            class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out origin-center"
            :class="mobileNavOpen ? 'rotate-45 translate-y-2' : ''"
          ></div>
          <!-- Middle line -->
          <div
            class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out"
            :class="mobileNavOpen ? 'opacity-0' : 'opacity-100'"
          ></div>
          <!-- Bottom line -->
          <div
            class="w-6 h-0.5 bg-primary transition-all duration-300 ease-in-out origin-center"
            :class="mobileNavOpen ? '-rotate-45 -translate-y-2' : ''"
          ></div>
        </div>
      </button>
    </nav>

    <!-- Main content area -->
    <div class="w-full md:flex-1 mt-12 md:mt-0 left-0">
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
import { ref, computed, onMounted } from 'vue';
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

// Close mobile menu when navigation item is clicked
function closeMobileMenu() {
  menuRevealed.value = false;
  mobileNavOpen.value = false;
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

// Listen for close-mobile-menu event from sidebar
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('close-mobile-menu', closeMobileMenu);
  }
});

// Auth store handles role persistence via localStorage
// No need for additional role fetching - roles are loaded on app initialization
</script>
