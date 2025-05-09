<template>
  <div class="user-roles">
    <div v-if="isLoading" class="text-center py-2">
      <p>Loading roles...</p>
    </div>
    <div v-else-if="roles.length === 0" class="text-center py-2">
      <p>No roles assigned</p>
    </div>
    <div v-else class="flex flex-wrap gap-2">
      <div 
        v-for="role in roles" 
        :key="role.id" 
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="getRoleClass(role.slug)"
      >
        {{ role.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

// Get roles from the auth store
const roles = computed(() => authStore.roles)
const isLoading = computed(() => authStore.isLoading)

// Function to get appropriate class based on role slug
function getRoleClass(roleSlug) {
  switch (roleSlug) {
    case 'seller':
      return 'bg-primary text-white'
    case 'customer':
      return 'bg-accent-400 text-white'
    default:
      return 'bg-accent-200 text-secondary'
  }
}

// Fetch roles if authenticated and roles are empty
if (authStore.isAuthenticated && roles.value.length === 0) {
  authStore.fetchRoles()
}
</script>
