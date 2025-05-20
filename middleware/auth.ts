// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from '#app';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify';

// Import SimpleResponse type from auth store
import type { SimpleResponse } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware on server side
  if (import.meta.server) return

  // Get auth store inside the middleware function to ensure it's reactive
  const authStore = useAuthStore();
  const { $auth } = useNuxtApp();

  // For debugging in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Auth middleware running for route:', to.fullPath);
    console.log('Auth state:', {
      isAuthenticated: authStore.isAuthenticated,
      isVerified: authStore.isVerified,
      needsVerification: authStore.needsVerification,
      user: authStore.user
    });
  }

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
    // First try to use the auth plugin's navigation helper
    if ($auth && $auth.navigation) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using auth plugin navigation to dashboard');
      }
      return $auth.navigation.toDashboard();
    }

    // Fallback if navigation helper is not available
    if (authStore.user && authStore.user.username) {
      const username = authStore.user.username;

      if (process.env.NODE_ENV !== 'production') {
        console.log('Navigating to dashboard for user:', username, 'isSeller:', authStore.isSeller, 'isCustomer:', authStore.isCustomer);
      }

      if (authStore.isSeller) {
        return navigateTo({
          name: 'username-selling-dashboard',
          params: { username }
        });
      } else if (authStore.isCustomer) {
        return navigateTo({
          name: 'username-buying-dashboard',
          params: { username }
        });
      }
    }

    // Default fallback to home page
    if (process.env.NODE_ENV !== 'production') {
      console.log('No user or roles found, navigating to home page');
    }
    return navigateTo('/');
  };

  // Helper function to show access denied notification
  const showAccessDenied = (message = 'You do not have the required permissions to access this page') => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Showing access denied notification:', message);
    }

    // First try to use the auth plugin's notifications
    if ($auth && $auth.notifications) {
      $auth.notifications.accessDenied(message);
    } else {
      // Fallback if notifications helper is not available
      const toast = useAppToast();
      toast.error('Access Denied', message);
    }

    // Also update the auth store status and message
    authStore.clearMessages();
    if (authStore.status !== 'error') {
      // Only set these if they're not already set by another process
      authStore.status = 'error';
      authStore.message = message;
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
      authStore.fetchRoles()
        .then((response: SimpleResponse) => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Roles fetched in middleware:', response);
          }
        })
        .catch(error => {
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

  // Clear any previous messages when navigating to a new route
  authStore.clearMessages();

  // Special case for auth pages (login/signup)
  if (routeRequirements.authOnly) {
    // If user is already authenticated and verified, redirect to dashboard
    if (authStore.isAuthenticated && authStore.isVerified) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User is authenticated and verified, redirecting from auth page to dashboard');
      }
      return navigateToDashboard();
    }
    // Otherwise allow access to auth pages
    if (process.env.NODE_ENV !== 'production') {
      console.log('Allowing access to auth page');
    }
    return;
  }

  // Special case for verification page
  if (routeRequirements.isVerifyRoute) {
    // If user is authenticated but needs verification, allow access
    if (authStore.isAuthenticated && authStore.needsVerification) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User needs verification, allowing access to verify page');
      }
      return;
    }

    // If user is already verified, redirect to dashboard
    if (authStore.isAuthenticated && authStore.isVerified) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User is already verified, redirecting from verify page to dashboard');
      }
      return navigateToDashboard();
    }

    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User is not authenticated, redirecting from verify page to login');
      }
      return navigateTo('/auth/login');
    }
  }

  // Case 1: Route requires authentication but user is not authenticated
  if (routeRequirements.requiresAuth && !authStore.isAuthenticated) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Route requires auth but user is not authenticated, redirecting to login');
    }

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
    if (process.env.NODE_ENV !== 'production') {
      console.log('Route requires verification but user needs verification, redirecting to verify page');
    }

    // Show a notification if we're not already on the verify page
    if (to.fullPath !== '/auth/verify') {
      const toast = useAppToast();
      toast.info('Verification Required', 'Please verify your email to access this page');
    }

    return navigateTo('/auth/verify');
  }

  // Case 3: User is authenticated but doesn't have required roles
  if (authStore.isAuthenticated && !checkRoleRequirements()) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('User does not have required roles, showing access denied and redirecting to dashboard');
    }
    showAccessDenied('You do not have the required permissions to access this page');
    return navigateToDashboard();
  }

  // If we reach here, the user is allowed to access the route
  if (process.env.NODE_ENV !== 'production') {
    console.log('Auth middleware completed, allowing access to route:', to.fullPath);
  }
})