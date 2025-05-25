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
      const { $auth } = useNuxtApp();

      // Use the auth plugin's navigation helper if available
      if ($auth && $auth.navigation) {
        return $auth.navigation.toDashboard();
      }

      // Fallback to direct navigation if plugin not available
      if (authStore.user && authStore.user.username) {
        const username = authStore.user.username;
        const path = authStore.isSeller
          ? `/${username}/selling/dashboard`
          : `/${username}/buying/dashboard`;

        return navigateTo(path);
      } else {
        // Fallback to home page if no user
        return navigateTo('/');
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
    }
  };
}