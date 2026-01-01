<template>
  <div> 
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Set default title and meta
useHead({
  title: 'Kafinta | Home & Furniture Marketplace',
  meta: [
    { name: 'description', content: 'Buy and sell products on Kafinta marketplace' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// Initialize auth store on app startup
onMounted(async () => {
  const authStore = useAuthStore()
  await authStore.initialize()
})
</script>