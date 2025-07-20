import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import { defu } from 'defu';
import { unref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify';
import { navigateTo } from '#app';

// Singleton for CSRF token management
const csrfManager = {
  tokenPromise: null as Promise<void> | null,
  tokenObtained: false,

  // Get CSRF token if needed
  async ensureToken() {
    if (import.meta.server) return Promise.resolve();

    // Skip if we already have a valid token
    if (this.tokenObtained && this.getCookie('XSRF-TOKEN')) {
      return Promise.resolve();
    }

    if (!this.tokenPromise) {
      const endpoint = `/sanctum/csrf-cookie`;

      // Only log in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Fetching CSRF token from:', endpoint);
      }

      this.tokenPromise = $fetch(endpoint, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      })
      .then(() => {
        const token = this.getCookie('XSRF-TOKEN');

        if (token) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('CSRF token obtained');
          }
          this.tokenObtained = true;
        } else {
          console.warn('CSRF cookie not found after fetch');
          this.tokenObtained = false;
        }

      })
      .catch(error => {
        console.error('Failed to get CSRF token:', error);
        this.tokenPromise = null;
        this.tokenObtained = false;
      });
    }

    return this.tokenPromise;
  },

  // Get cookie by name
  getCookie(name: string): string | undefined {
    if (import.meta.server) return undefined;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    }
    return undefined;
  },

  logCookieStatus() {
  }
};

export async function useCustomFetch<T>(
  url: NitroFetchRequest,
  options: Omit<NitroFetchOptions<NitroFetchRequest>, 'method'> & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
    skipCsrf?: boolean,
    suppressAuthError?: boolean // NEW: suppress session expired toast/redirect
  } = {}
) {
  const { method = 'GET', skipCsrf = false, suppressAuthError = false, ...restOptions } = options;

  // Ensure URL is relative to leverage the proxy
  let resolvedUrl = unref(url);

  // If URL starts with http, extract the path to make it relative, otherwise ensure it starts with a leading slash
  if (typeof resolvedUrl === 'string') {
    if (resolvedUrl.startsWith('http')) {
      // Only log in development
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Converting absolute URL to relative for proxy compatibility:', resolvedUrl);
      }
      try {
        const urlObj = new URL(resolvedUrl);
        resolvedUrl = urlObj.pathname + urlObj.search;
      } catch (e) {
        console.error('Failed to parse URL:', e);
      }
    }
    // Ensure URL starts with a leading slash for proxy to work correctly
    else if (!resolvedUrl.startsWith('/')) {
      resolvedUrl = '/' + resolvedUrl;
    }
  }

  // For CSRF-requiring methods, ensure we have a token first
  if (import.meta.client && !skipCsrf && method !== 'GET') {
    await csrfManager.ensureToken();
  }

  // Get the CSRF token
  const csrfToken = import.meta.client ? csrfManager.getCookie('XSRF-TOKEN') : undefined;

  // Log request information in development only
  if (import.meta.client && process.env.NODE_ENV !== 'production') {
    console.log(`Making ${method} request to ${resolvedUrl}`);
  }

  // Check if we're sending FormData (for file uploads)
  const isFormData = restOptions.body instanceof FormData;

  // Create default options with proper credentials and headers
  const defaults: NitroFetchOptions<NitroFetchRequest> = {
    // Ensure we're using relative URLs to leverage the proxy
    baseURL: '',
    credentials: 'include', // Critical for sending cookies
    method,
    headers: {
      'Accept': 'application/json',
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      'X-Requested-With': 'XMLHttpRequest',
      ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {})
    }
  };

  // Merge defaults with user options (user options take precedence)
  const params = defu(restOptions, defaults);

  try {
    const response = await $fetch<T>(resolvedUrl, params);
    return response;
  } catch (error: any) {
    // Only log detailed errors in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Error in ${method} request to ${resolvedUrl}:`, error);
    } else {
      // In production, log minimal information
      console.error(`API Error: ${error.message || 'Unknown error'}`);
    }

    // Reset CSRF token on authentication errors
    if (error.response?.status === 401 && import.meta.client) {
      csrfManager.tokenObtained = false;
      csrfManager.tokenPromise = null;
      // Global sign out and redirect logic
      const authStore = useAuthStore();
      const toast = useAppToast();
      authStore.clearAuthData();
      if (!suppressAuthError) {
        if (toast?.sessionExpired) {
          toast.sessionExpired();
        } else if (toast?.error) {
          toast.error('Session expired. Please log in again.');
        }
        navigateTo({ path: '/auth/login', query: { redirect: window.location.pathname } });
      }
    }

    throw error;
  }
}
