// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server side
  if (import.meta.server) return

  // Get auth store inside the middleware function to ensure it's reactive
  const authStore = useAuthStore();

  // Check if route requires authentication (defined in route meta)
  const requiresAuth = to.meta.requiresAuth === true

  // Check if route is auth-only (like login/signup pages)
  const authOnly = to.meta.authOnly === true

  // Check if route is for verification
  const isVerifyRoute = to.meta.isVerifyRoute === true

  // Check if route requires verification
  const requiresVerification = to.meta.requiresVerification === true

  // Check if route requires specific roles
  const requiredRoles = to.meta.requiredRoles as string[] || []

  // Check if route requires seller role
  const requiresSeller = to.meta.requiresSeller === true || requiredRoles.includes('seller')

  // Check if route requires customer role
  const requiresCustomer = to.meta.requiresCustomer === true || requiredRoles.includes('customer')

  // Handle redirect logic

  // If the route requires authentication and the user is not authenticated
  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  // If the route requires verification and the user needs verification
  if (requiresVerification && authStore.needsVerification) {
    return navigateTo('/auth/verify')
  }

  // If the user is authenticated, check for required roles
  if (authStore.isAuthenticated && (requiresSeller || requiresCustomer || requiredRoles.length > 0)) {
    // If roles haven't been loaded yet, fetch them
    if (authStore.roles.length === 0) {
      // We need to fetch roles first, but middleware doesn't support async
      // So we'll check if the user has the required roles based on what's in localStorage
      // and fetch roles in the background for future requests

      // Fetch roles in the background
      authStore.fetchRoles().catch(error => {
        console.error('Failed to fetch roles in middleware:', error)
      })
    }

    // Check if user has required roles
    const hasRequiredRoles = requiredRoles.length === 0 ||
      requiredRoles.some(role => authStore.hasRole(role))

    // Check for specific role requirements
    const hasSeller = !requiresSeller || authStore.isSeller
    const hasCustomer = !requiresCustomer || authStore.isCustomer

    // If user doesn't have required roles, redirect to appropriate page
    if (!(hasRequiredRoles && hasSeller && hasCustomer)) {
      // Use the auth plugin notification system
      try {
        const { $auth } = useNuxtApp();
        if ($auth && $auth.notifications) {
          $auth.notifications.showRoleError('You do not have the required permissions to access this page');
        } else {
          console.error('Auth notification service not available');
        }
      } catch (error) {
        console.error('Failed to show notification through auth plugin:', error);
      }

      // Redirect to home or dashboard based on available roles
      if (authStore.user && authStore.user.username) {
        if (authStore.isSeller) {
          return navigateTo({
            name: 'username-selling-dashboard',
            params: { username: authStore.user.username }
          })
        } else if (authStore.isCustomer) {
          return navigateTo({
            name: 'username-buying-dashboard',
            params: { username: authStore.user.username }
          })
        } else {
          return navigateTo('/')
        }
      } else {
        return navigateTo('/')
      }
    }
  }

  // If the route is a verification route and the user is already verified
  if (isVerifyRoute && authStore.isAuthenticated && authStore.isVerified) {
    // If user is verified, redirect to dashboard
    if (authStore.user && authStore.user.username) {
      return navigateTo({
        name: 'username-buying-dashboard',
        params: { username: authStore.user.username }
      })
    } else {
      // Fallback if username is not available
      return navigateTo('/')
    }
  }

  // If the route is auth-only (login/signup) and the user is authenticated and verified
  if (authOnly && authStore.isAuthenticated && authStore.isVerified) {
    // If user is verified, redirect to dashboard
    if (authStore.user && authStore.user.username) {
      return navigateTo({
        name: 'username-buying-dashboard',
        params: { username: authStore.user.username }
      })
    } else {
      // Fallback if username is not available
      return navigateTo('/')
    }
  }

  // Special case: Allow access to verification page for authenticated but unverified users
  if (isVerifyRoute && authStore.isAuthenticated && authStore.needsVerification) {
    // Allow access to verification page
    return
  }
})