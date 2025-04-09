// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server side
  if (process.server) return
  
  const authStore = useAuthStore()
  
  // Check if route requires authentication (defined in route meta)
  const requiresAuth = to.meta.requiresAuth === true
  
  // Check if route is auth-only (like login/signup pages)
  const authOnly = to.meta.authOnly === true
  
  // Handle redirect logic
  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  if (authOnly && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})