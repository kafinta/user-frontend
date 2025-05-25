// Types for API responses
interface ApiResponse {
  status: string;
  message: string;
  data?: {
    user?: any;
    roles?: any[];
    email_verified?: boolean;
  };
}

export function useAuthApi() {
  const authStore = useAuthStore();
  const toast = useAppToast();

  // Define fetchRoles first so it can be used in handleAuthSuccess
  const fetchRoles = async () => {
    const response = await useCustomFetch<ApiResponse>('/api/user/roles', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data?.roles) {
      authStore.setRoles(response.data.roles);
    }

    return response;
  };

  // Helper function to handle successful auth responses
  const handleAuthSuccess = async (response: any) => {
    if (response.data?.user) {
      authStore.setUser(response.data.user);
      authStore.setVerified(!!response.data.user.email_verified_at);
    }

    // Fetch roles after setting user
    await fetchRoles();

    return response;
  };

  return {
    // Helper for handling auth success
    handleAuthSuccess,

    // Reusable operations that update auth state
    fetchProfile: async () => {
      const response = await useCustomFetch<ApiResponse>('/api/user/profile', {
        method: 'GET'
      });

      if (response.status === 'success' && response.data?.user) {
        authStore.setUser(response.data.user);
        authStore.setVerified(!!response.data.user.email_verified_at);
      }

      return response;
    },

    fetchRoles,

    logout: async () => {
      const response = await useCustomFetch<ApiResponse>('/api/logout', {
        method: 'POST'
      });

      if (response.status === 'success') {
        authStore.clearAuthData();
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

    // This is reusable as it might be called from multiple places
    requestEmailVerification: async () => {
      return await useCustomFetch<ApiResponse>('/api/user/resend-verification-email', {
        method: 'POST'
      });
    },

    // Navigation helper for post-auth redirects
    navigateToDashboard: () => {
      const authStore = useAuthStore();

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