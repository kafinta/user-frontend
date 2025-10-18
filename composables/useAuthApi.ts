// Types for API responses
interface ApiResponse {
  status: string;
  message: string;
  data?: {
    user?: any;
    roles?: string[]; // Roles are now simple strings (slugs)
    email_verified?: boolean;
  };
}

export function useAuthApi() {
  const authStore = useAuthStore();
  const toast = useAppToast();

  // Helper function to handle successful auth responses
  const handleAuthSuccess = async (response: any) => {
    if (response.data?.user) {
      authStore.setUser(response.data.user);
      authStore.setVerified(!!response.data.user.email_verified_at);
    }
    
    // Set roles if included in response (preferred approach)
    if (response.data?.roles) {
      authStore.setRoles(response.data.roles);
    } else if (response.data?.user?.roles) {
      // If roles are nested in user object
      authStore.setRoles(response.data.user.roles);
    }
    
    return response;
  };

  return {
    // Helper for handling auth success
    handleAuthSuccess,

    logout: async () => {
      const response = await useCustomFetch<ApiResponse>('/api/user/logout', {
        method: 'POST'
      });

      if (response.status === 'success') {
        authStore.clearAuthData();
        // Redirect to login page after logout
        navigateTo('/auth/login');
      }

      return response;
    },

    checkEmailVerification: async () => {
      const response = await useCustomFetch<ApiResponse>('/api/user/email-verification-status', {
        method: 'GET'
      });

      if (response.status === 'success') {
        authStore.setVerified(response.data?.email_verified === true);
      }

      return response;
    },

    // Navigation helper for post-auth redirects
    navigateToDashboard: async () => {
      const authStore = useAuthStore();

      // If not authenticated, go to home page
      if (!authStore.isAuthenticated) {
        console.log('Not authenticated, redirecting to home');
        return navigateTo('/');
      }

      // If no username, fetch user profile first
      if (!authStore.user?.username) {
        console.log('No username found, fetching user profile...');
        try {
          await authStore.validateSession();
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          return navigateTo('/');
        }
      }

      // Check again after potential profile fetch
      if (!authStore.user?.username) {
        console.error('Still no username after profile fetch, redirecting to home');
        return navigateTo('/');
      }

      // Get the username
      const username = authStore.user.username;
      console.log('Navigating to dashboard for user:', username);

      // Roles are now loaded from localStorage on app initialization
      // No need to fetch roles - just use the stored roles

      // Route based on role - all users are customers by default
      if (authStore.isSeller) {
        console.log('User is a seller, navigating to selling dashboard');
        return navigateTo(`/${username}/selling/dashboard`);
      } else {
        console.log('User is not a seller, navigating to buying dashboard');
        // All authenticated users are customers by default
        return navigateTo(`/${username}/buying/dashboard`);
      }
    },

    // OAuth authentication
    getSupportedProviders: async () => {
      return await useCustomFetch<ApiResponse>('/api/auth/providers', {
        method: 'GET'
      });
    },

    getOAuthRedirectUrl: async (provider: string) => {
      return await useCustomFetch<ApiResponse>(`/api/auth/${provider}/redirect`, {
        method: 'GET'
      });
    },

    authenticateWithOAuthToken: async (provider: string, accessToken: string) => {
      return await useCustomFetch<ApiResponse>('/api/auth/oauth/token', {
        method: 'POST',
        body: {
          provider,
          access_token: accessToken
        }
      });
    },

    unlinkOAuthProvider: async () => {
      return await useCustomFetch<ApiResponse>('/api/auth/unlink-provider', {
        method: 'POST'
      });
    },

    // Auth error handling
    handleUnauthorized: (skipRedirect = false) => {
      if (!import.meta.client) {
        return { status: 'error', message: 'Unauthorized' }
      }

      const route = useRoute()
      const currentPath = route.fullPath

      // Don't redirect or show notifications if we're on auth pages
      const isAuthPage = currentPath.includes('/auth/login') ||
                        currentPath.includes('/auth/signup') ||
                        currentPath.includes('/auth/verify')

      if (!isAuthPage) {
        // Show session expired notification
        toast.sessionExpired()

        // Only redirect if not on an auth page and redirect is not skipped
        if (!skipRedirect) {
          navigateTo({
            path: '/auth/login',
            query: { redirect: currentPath }
          })
        }
      }

      return {
        status: 'error',
        message: 'Unauthorized. Please log in again.'
      }
    },

    handleForbidden: () => {
      if (import.meta.client) {
        toast.accessDenied('You do not have permission to access this resource')
      }

      return {
        status: 'error',
        message: 'Forbidden. You do not have permission to access this resource.'
      }
    },

    showAccessDenied: (message = 'You do not have the required permissions to access this page') => {
      toast.accessDenied(message)
    }
  };
}