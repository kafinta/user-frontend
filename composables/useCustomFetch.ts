import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
import { defu } from 'defu'

// Define CSRF token management
let csrfTokenPromise: Promise<any> | null = null;
let csrfTokenObtained = false;

// Function to get cookie value by name
function getCookieValue(name: string): string | undefined {
  if (import.meta.server) return undefined;

  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Check if this cookie starts with the name we're looking for
    if (cookie.startsWith(name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return undefined;
}

async function getCsrfToken() {
  if (import.meta.client) {
    // Skip if we've already obtained a token in this session
    if (csrfTokenObtained && getCookieValue('XSRF-TOKEN')) {
      return Promise.resolve();
    }

    if (!csrfTokenPromise) {
      const config = useRuntimeConfig();
      const endpoint = `${config.public.base_url}/sanctum/csrf-cookie`;

      csrfTokenPromise = $fetch(endpoint, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(() => {
        const token = getCookieValue('XSRF-TOKEN');
        if (token) {
          csrfTokenObtained = true;
        } else {
          csrfTokenObtained = false;
        }
        return;
      }).catch(error => {
        console.error('Failed to get CSRF token:', error);
        csrfTokenPromise = null; // Reset so we can try again next time
        csrfTokenObtained = false;
        return;
      });
    }
    return csrfTokenPromise;
  }
  return Promise.resolve();
}

export async function useCustomFetch<T>(
  url: NitroFetchRequest,
  options: Omit<NitroFetchOptions<NitroFetchRequest>, 'method'> & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
    skipCsrf?: boolean
  } = {}
) {
  const { method = 'GET', skipCsrf = false, ...restOptions } = options
  const config = useRuntimeConfig()

  // Ensure url is a string if it's a Ref
  const resolvedUrl = typeof url === 'string'
    ? url
    : unref(url)

  // Get CSRF token first if needed (for non-GET requests)
  if (import.meta.client && !skipCsrf && method !== 'GET') {
    await getCsrfToken();
  }

  // Get the CSRF token from cookie after ensuring it's set
  const csrfToken = import.meta.client ? getCookieValue('XSRF-TOKEN') : undefined;

  const defaults: NitroFetchOptions<NitroFetchRequest> = {
    baseURL: config.public.base_url,
    credentials: 'include', // Critical for cookie auth
    ...(method ? { method } : {}),
    headers: {
      'accept': 'application/json, text/plain, */*',
      'content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to recognize AJAX requests
      ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {})
    }
  }

  // Merge defaults with user provided options
  const params = defu(restOptions, defaults)

  // For non-GET requests, get CSRF token first (unless skipCsrf is true)
  if (import.meta.client && method !== 'GET' && !skipCsrf) {
    return getCsrfToken().then(() => {
      return $fetch<T>(resolvedUrl, params)
    })
  }

  // For GET requests or if skipCsrf is true, proceed without CSRF token
  return $fetch<T>(resolvedUrl, params)
}