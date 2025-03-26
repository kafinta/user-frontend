import type { UseFetchOptions } from '#app'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
import type { Ref } from 'vue'
import { defu } from 'defu'

export function useCustomFetch<T>(
  url: NitroFetchRequest, 
  options: Omit<NitroFetchOptions<NitroFetchRequest>, 'method'> & { 
    requireAuth?: boolean 
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
  } = {}
) {
  const { requireAuth = false, method = 'GET', ...restOptions } = options
  const config = useRuntimeConfig()
  const token = useAuth().token // Assuming you have an auth composable

  // Ensure url is a string if it's a Ref
  const resolvedUrl = typeof url === 'string' 
    ? url 
    : unref(url)

  // Debug logs
  // console.log('API URL:', config.public.base_url + resolvedUrl)

  const defaults: NitroFetchOptions<NitroFetchRequest> = {
    baseURL: config.public.base_url,
    credentials: 'include',
    // Only add method if it's one of the allowed types
    ...(method ? { method } : {}),
    headers: {
      'accept': 'application/json, text/plain, */*',
      ...(token.value && requireAuth 
        ? { 'Authorization': `Bearer ${token.value}` } 
        : {}
      )
    },
    // Add error and response interceptors
    onRequest({ request, options }) {
      // console.log('Making request to:', request)
      // console.log('With options:', options)
    },
    onRequestError({ request, error }) {
      // console.error('Request error:', error)
    },
    onResponse({ request, response }) {
      // console.log('Response received:', response._data)
    },
    onResponseError({ request, response }) {
      // console.error('Response error:', response._data)
      
      // Optional: Handle specific error scenarios
      if (response.status === 401) {
        // Unauthorized - potentially refresh token or redirect to login
        useAuth().logout()
      }
    }
  }

  // Merge defaults with user provided options
  const params = defu(restOptions, defaults)

  // Use $fetch with resolved URL
  return $fetch<T>(resolvedUrl, params)
}

// Optional: Create an auth composable if not already existing
function useAuth() {
  const token = useState<string | null>('auth_token', () => null)

  return {
    token,
    login(newToken: string) {
      token.value = newToken
    },
    logout() {
      token.value = null
      // Additional logout logic like clearing session, redirecting, etc.
    }
  }
}