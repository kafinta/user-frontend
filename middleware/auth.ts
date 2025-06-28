// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify'

// Import SimpleResponse type from auth store
import type { SimpleResponse } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on server side
  if (import.meta.server) return

  // Get auth store inside the middleware function to ensure it's reactive
  const authStore = useAuthStore();

  // Initialize auth store if not already done
  if (!authStore.initialized) {
    await authStore.initialize();
  }

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

    // Route based on role - all users are customers by default
    if (authStore.isSeller) {
      return navigateTo(`/${username}/selling/dashboard`);
    } else {
      // All authenticated users are customers by default
      return navigateTo(`/${username}/buying/dashboard`);
    }
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

    // Basic role checks - all authenticated users are customers by default
    if (requiresSeller && !authStore.isSeller) return false;
    // Customer check is simplified since all authenticated users are customers
    if (requiresCustomer && !authStore.isAuthenticated) return false;

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
    // If there's a token in the URL, always allow access (token verification)
    if (to.query.token) {
      return;
    }

    // If user is authenticated but needs verification, allow access
    if (authStore.isAuthenticated && authStore.needsVerification) {
      return;
    }

    // If user is already verified, redirect to dashboard
    if (authStore.isAuthenticated && authStore.isVerified) {
      return navigateToDashboard();
    }

    // If not authenticated and no token, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login');
    }
  }

  // Case 1: Route requires authentication but user is not authenticated
  if (routeRequirements.requiresAuth && !authStore.isAuthenticated) {
    // No session validation - rely on backend to handle expired sessions
    // Just redirect to login if user data is not in localStorage
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

  // Case 3: Username validation for user-specific routes
  if (authStore.isAuthenticated && to.params.username) {
    const urlUsername = to.params.username;
    const userUsername = authStore.user?.username;

    // Check if the username in the URL matches the authenticated user's username
    if (urlUsername !== userUsername) {
      showAccessDenied('You can only access your own pages');
      return navigateToDashboard();
    }
  }

  // Case 4: Role-based access control
  if (authStore.isAuthenticated && routeRequirements.requiresSeller) {
    // Roles are loaded from localStorage on app initialization
    // No need to fetch roles - just check if user has seller role
    if (!authStore.isSeller) {
      showAccessDenied('You do not have the required permissions to access this page');
      return navigateToDashboard();
    }
  }

  // If we reach here, the user is allowed to access the route
})