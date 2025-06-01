// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify'
import { useAuthApi } from '~/composables/useAuthApi';

// Import SimpleResponse type from auth store
import type { SimpleResponse } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
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
    // Try to validate session first in case user has valid cookies but empty auth state
    try {
      await authStore.validateSession();

      // If session validation restored auth state, continue with middleware checks
      if (authStore.isAuthenticated) {
        // Session restored successfully, continue with other checks below
      } else {
        // No valid session, redirect to login
        if (!to.fullPath.includes('/auth/')) {
          const toast = useAppToast();
          toast.info('Authentication Required', 'Please log in to access this page');
        }

        return navigateTo({
          path: '/auth/login',
          query: { redirect: to.fullPath }
        });
      }
    } catch (error) {
      // Session validation failed, redirect to login
      if (!to.fullPath.includes('/auth/')) {
        const toast = useAppToast();
        toast.info('Authentication Required', 'Please log in to access this page');
      }

      return navigateTo({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      });
    }
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
    // If route requires seller role but user doesn't have it, check if roles are loaded
    if (!authStore.isSeller) {
      // If no roles are loaded at all, try to fetch them first
      if (authStore.roles.length === 0) {
        try {
          const authApi = useAuthApi();
          await authApi.fetchRoles();

          // After fetching roles, check again
          if (!authStore.isSeller) {
            showAccessDenied('You do not have the required permissions to access this page');
            return navigateToDashboard();
          }
        } catch (error) {
          console.error('Failed to fetch roles for access control:', error);
          showAccessDenied('Unable to verify permissions');
          return navigateToDashboard();
        }
      } else {
        // Roles are loaded but user is not a seller
        showAccessDenied('You do not have the required permissions to access this page');
        return navigateToDashboard();
      }
    }
  }

  // If we reach here, the user is allowed to access the route
})