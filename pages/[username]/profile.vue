<template>
  <LayoutsDashboard mode="seller" page_title="My Profile">
    <div class="block lg:flex gap-8">
      <div class="w-full lg:w-2/5 grid gap-5">
        <div class="border border-accent-200 p-6">
          <div class="relative flex w-fit justify-center mx-auto">
            <UserProfilePicture :username="username" :custom_dimensions="true" class="h-36 w-36"/>
          </div>
          <UiTypographyH3 class="text-center mt-4 mb-3">{{username}}</UiTypographyH3>

          <!-- User Roles -->
          <div class="flex justify-center mb-4">
            <UserProfileRoles />
          </div>

          <div class="border-t border-accent-200 grid grid-cols-1 gap-4 pt-4">
            <div class="flex items-center justify-between">
              <div class="flex gap-3 items-center">
                <UiIconsLocation class="w-5 h-5 text-secondary" />
                <UiTypographyP>Nationality</UiTypographyP>
              </div>
              <UiTypographyP>Nigerian</UiTypographyP>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex gap-3 items-center">
                <UiIconsProfile class="w-5 h-5 text-secondary" />
                <UiTypographyP>Member since</UiTypographyP>
              </div>
              <UiTypographyP>Mar 2023</UiTypographyP>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-3/5 mt-8 lg:mt-0">
        <div class="border border-accent-200 p-6 duration-150 ease-in-out">
          <div class="mb-3">
            <UiTypographyH3>Description</UiTypographyH3>
          </div>
          <UiTypographyP>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor perspiciatis ipsam quo rerum itaque assumenda nisi corporis eaque, provident nihil optio enim ullam perferendis illum mollitia obcaecati, possimus praesentium doloremque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum omnis minus incidunt quis ullam quisquam facere. Fugiat, debitis! Quas sint magni culpa, expedita odio totam possimus illum aut nulla fuga.</UiTypographyP>
          <div :class="description_edit ? 'flex' : 'hidden'" class="items-center gap-3 my-3 duration-150 ease-in-out">
            <UiButtonsTertiary @clicked="toggleDescription()" :flexdisplay="true">Cancel</UiButtonsTertiary>
            <UiButtonsPrimary  @clicked="toggleDescription()" :flexdisplay="true" :standout="true">Update</UiButtonsPrimary>
          </div>
        </div>
      </div>
    </div>
  </LayoutsDashboard>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

// Define page meta for authentication
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
})

useHead({
  title: 'My Profile | Kafinta',
  meta: [
    { name: 'description', content: 'View and manage your Kafinta profile' }
  ]
});

// Get route and auth store
const route = useRoute()
const authStore = useAuthStore()

// Get username from route params or auth store
const username = computed(() => {
  return route.params.username || authStore.user?.username || 'User'
})

// State for description editing
const description_edit = ref(false)

// Toggle description edit mode
function toggleDescription() {
  description_edit.value = !description_edit.value
}

// Roles should be available from login/signup response
// If roles are missing, user should re-login or they will be fetched when specifically needed
</script>

<style>
</style>