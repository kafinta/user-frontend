// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server side
  if (import.meta.server) return

  // Get auth store inside the middleware function to ensure it's reactive
  const authStore = useAuthStore();
  const { $auth } = useNuxtApp();

  // Extract route requirements from meta
  const routeRequirements = {
    requiresAuth: to.meta.requiresAuth === true,
    authOnly: to.meta.authOnly === true,
    isVerifyRoute: to.meta.isVerifyRoute === true,
    requiresVerification: to.meta.requiresVerification === true,
    requiredRoles: to.meta.requiredRoles as string[] || [],
    requiresSeller: to.meta.requiresSeller === true || (to.meta.requiredRoles as string[] || []).includes('seller'),
    requiresCustomer: to.meta.requiresCustomer === true || (to.meta.requiredRoles as string[] || []).includes('customer')
  };

  // Helper function to navigate to dashboard
  const navigateToDashboard = () => {
    if ($auth && $auth.navigation) {
      return $auth.navigation.toDashboard();
    }

    // Fallback if navigation helper is not available
    if (authStore.user && authStore.user.username) {
      if (authStore.isSeller) {
        return navigateTo({
          name: 'username-selling-dashboard',
          params: { username: authStore.user.username }
        });
      } else if (authStore.isCustomer) {
        return navigateTo({
          name: 'username-buying-dashboard',
          params: { username: authStore.user.username }
        });
      }
    }

    return navigateTo('/');
  };

  // Helper function to show access denied notification
  const showAccessDenied = (message = 'You do not have the required permissions to access this page') => {
    if ($auth && $auth.notifications) {
      $auth.notifications.accessDenied(message);
    }
  };

  // Helper function to check if user has required roles
  const checkRoleRequirements = () => {
    const { requiredRoles, requiresSeller, requiresCustomer } = routeRequirements;

    // If no role requirements, return true
    if (!requiresSeller && !requiresCustomer && requiredRoles.length === 0) {
      return true;
    }

    // If roles haven't been loaded yet, fetch them in the background
    if (authStore.isAuthenticated && authStore.roles.length === 0) {
      authStore.fetchRoles().catch(error => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to fetch roles in middleware:', error);
        }
      });
    }

    // Check if user has required roles
    const hasRequiredRoles = requiredRoles.length === 0 ||
      requiredRoles.some(role => authStore.hasRole(role));

    // Check for specific role requirements
    const hasSeller = !requiresSeller || authStore.isSeller;
    const hasCustomer = !requiresCustomer || authStore.isCustomer;

    return hasRequiredRoles && hasSeller && hasCustomer;
  };

  // MAIN MIDDLEWARE LOGIC

  // Case 1: Route requires authentication but user is not authenticated
  if (routeRequirements.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  }

  // Case 2: Route requires verification and user needs verification
  if (routeRequirements.requiresVerification && authStore.needsVerification) {
    return navigateTo('/auth/verify');
  }

  // Case 3: User is authenticated but doesn't have required roles
  if (authStore.isAuthenticated && !checkRoleRequirements()) {
    showAccessDenied();
    return navigateToDashboard();
  }

  // Case 4: Verification route but user is already verified
  if (routeRequirements.isVerifyRoute && authStore.isAuthenticated && authStore.isVerified) {
    return navigateToDashboard();
  }

  // Case 5: Auth-only route (login/signup) but user is already authenticated and verified
  if (routeRequirements.authOnly && authStore.isAuthenticated && authStore.isVerified) {
    return navigateToDashboard();
  }

  // Case 6: Special case - Allow access to verification page for authenticated but unverified users
  if (routeRequirements.isVerifyRoute && authStore.isAuthenticated && authStore.needsVerification) {
    return; // Allow access
  }
})