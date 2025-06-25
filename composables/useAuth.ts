import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify';
import { useRouter } from 'vue-router';
import { useAuthApi } from '~/composables/useAuthApi';

interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

interface SignupData {
  email: string;
  password: string;
  username: string;
}

interface ApiResponse {
  status: 'success' | 'fail' | 'error';
  status_code: number;
  message: string;
  data?: {
    user?: any;
    email_verification_required?: boolean;
    verification_email_sent?: boolean;
    email_verified?: boolean;
  };
}

export function useAuth() {
  const authStore = useAuthStore();
  const toast = useAppToast();
  const router = useRouter();
  const { fetchRoles } = useAuthApi();

  /**
   * Handle successful authentication response
   */
  const handleAuthSuccess = async (response: ApiResponse) => {
    if (response.data?.user) {
      authStore.setUser(response.data.user);
      authStore.setVerified(!!response.data.user.email_verified_at);
    }
    // Fetch roles if not already loaded
    if (!authStore.rolesLoaded) {
      await fetchRoles();
    }
    return response;
  };

  /**
   * Login user with email and password
   */
  const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
      const response = await useCustomFetch<ApiResponse>('/api/user/login', {
        method: 'POST',
        body: credentials
      });
      if (response.status === 'success') {
        await handleAuthSuccess(response);
      }
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        status: 'error',
        status_code: error?.statusCode || 500,
        message: error?.data?.message || error?.message || 'An unexpected error occurred'
      };
    }
  };

  /**
   * Navigate to appropriate dashboard based on user role
   */
  const navigateToDashboard = async (redirectPath?: string) => {
    // If there's a redirect path, use it
    if (redirectPath) {
      return router.push(redirectPath);
    }

    // Otherwise use default dashboard navigation
    if (!authStore.isAuthenticated || !authStore.user?.username) {
      return router.push('/');
    }

    const username = authStore.user.username;
    if (authStore.isSeller) {
      return router.push(`/${username}/selling/dashboard`);
    } else {
      return router.push(`/${username}/buying/dashboard`);
    }
  };

  return {
    login,
    navigateToDashboard,
    handleAuthSuccess
  };
} 