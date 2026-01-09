<template>
  <div class="w-full select-none">
    <!-- Dashboard Navbar -->
    <NavigationDashboardNavBar
      :mode="mode"
      :show-cart="true"
      :has-notifications="true"
    />

    <!-- Main content area -->
    <div class="w-full pt-16">
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

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
    validator: (value: string) => ['seller', 'buyer'].includes(value)
  }
})

// Route for getting username
const route = useRoute()

// Computed properties
const username = computed(() => route.params.username || 'username')
</script>
