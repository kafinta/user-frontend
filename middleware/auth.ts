// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify';

// Import SimpleResponse type from auth store
import type { SimpleResponse } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server side
  if (import.meta.server) return

  // Get auth store inside the middleware function to ensure it's reactive
  const authStore = useAuthStore();

  // Skip middleware debugging in production
  // This section previously contained debug logging code

  // Extract route requirements from meta
  const routeRequirements = {
    requiresAuth: to.meta.requiresAuth === true,
    authOnly: to.meta.authOnly === true,
    isVerifyRoute: to.meta.isVerifyRoute === true,
    requiresVerification: to.meta.requiresVerification === true,
    requiresSeller: to.meta.requiresSeller === true,
    requiresCustomer: to.meta.requiresCustomer === true
  };

  // Helper function to navigate to dashboard
  const navigateToDashboard = () => {
    // If not authenticated or no username, go to home page
    if (!authStore.isAuthenticated || !authStore.user?.username) {
      return navigateTo('/');
    }

    // Get the username
    const username = authStore.user.username;

    // Route based on role
    if (authStore.isSeller) {
      return navigateTo(`/${username}/selling/dashboard`);
    } else if (authStore.isCustomer) {
      return navigateTo(`/${username}/buying/dashboard`);
    }

    // Default fallback
    return navigateTo('/');
  };

  // Helper function to show access denied notification
  const showAccessDenied = (message = 'You do not have the required permissions to access this page') => {
    const toast = useAppToast();
    toast.accessDenied(message);
  };

  // Simplified role checking - complex role logic should be handled at page level
  const hasBasicRoleAccess = () => {
    const { requiresSeller, requiresCustomer } = routeRequirements;

    // If no specific role requirements, allow access
    if (!requiresSeller && !requiresCustomer) {
      return true;
    }

    // Basic role checks only
    if (requiresSeller && !authStore.isSeller) return false;
    if (requiresCustomer && !authStore.isCustomer) return false;

    return true;
  };

  // MAIN MIDDLEWARE LOGIC

  // Special case for auth pages (login/signup)
  if (routeRequirements.authOnly) {
    // If user is already authenticated and verified, redirect to dashboard
    if (authStore.isAuthenticated && authStore.isVerified) {
      return navigateToDashboard();
    }
    // Otherwise allow access to auth pages
    return;
  }

  // Special case for verification page
  if (routeRequirements.isVerifyRoute) {
    // Special handling for token verification page
    if (to.path === '/auth/verify-token') {
      // Always allow access to token verification page
      // The page itself will handle redirects based on verification status
      return;
    }

    // For code verification page
    // If user is authenticated but needs verification, allow access
    if (authStore.isAuthenticated && authStore.needsVerification) {
      return;
    }

    // If user is already verified, redirect to dashboard
    if (authStore.isAuthenticated && authStore.isVerified) {
      return navigateToDashboard();
    }

    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login');
    }
  }

  // Case 1: Route requires authentication but user is not authenticated
  if (routeRequirements.requiresAuth && !authStore.isAuthenticated) {
    // Show a notification if we're not already on an auth page
    if (!to.fullPath.includes('/auth/')) {
      const toast = useAppToast();
      toast.info('Authentication Required', 'Please log in to access this page');
    }

    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  }

  // Case 2: Route requires verification and user needs verification
  if (routeRequirements.requiresVerification && authStore.needsVerification) {
    // Show a notification if we're not already on the verify page
    if (to.fullPath !== '/auth/verify') {
      const toast = useAppToast();
      toast.info('Verification Required', 'Please verify your email to access this page');
    }

    return navigateTo('/auth/verify');
  }

  // Case 3: Basic role checking (complex role logic should be handled at page level)
  if (authStore.isAuthenticated && !hasBasicRoleAccess()) {
    showAccessDenied('You do not have the required permissions to access this page');
    return navigateToDashboard();
  }

  // If we reach here, the user is allowed to access the route
})