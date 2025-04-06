// composables/useCustomFetch.ts
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
  
  // Get token from localStorage directly to avoid circular dependency
  // with the auth store that will use this composable
  const getAuthToken = (): string | null => {
    if (import.meta.client) {
      try {
        return localStorage.getItem('auth_token')
      } catch (e) {
        console.error('Error accessing localStorage:', e)
        return null
      }
    }
    return null
  }

  // Ensure url is a string if it's a Ref
  const resolvedUrl = typeof url === 'string' 
    ? url 
    : unref(url)

  const defaults: NitroFetchOptions<NitroFetchRequest> = {
    baseURL: config.public.base_url,
    credentials: 'include',
    ...(method ? { method } : {}),
    headers: {
      'accept': 'application/json, text/plain, */*',
      ...(requireAuth && getAuthToken()
        ? { 'Authorization': `Bearer ${getAuthToken()}` } 
        : {}
      )
    },
    onRequest({ request, options }) {
      // Request interceptor logic
    },
    onRequestError({ request, error }) {
      // Request error handling
    },
    onResponse({ request, response }) {
      // Only handle token storage, leave user data to the auth store
      if (response._data && typeof response._data === 'object') {
        // Check for auth_token in data object (new API structure)
        if ('data' in response._data && 
            response._data.data && 
            typeof response._data.data === 'object' &&
            'auth_token' in response._data.data && 
            response._data.data.auth_token) {
          if (import.meta.client) {
            localStorage.setItem('auth_token', response._data.data.auth_token)
          }
        }
        // Emit an event so the auth store can update when token changes
        if (import.meta.client) {
          window.dispatchEvent(new CustomEvent('auth:token-updated'))
        }
      }
    },
    onResponseError({ request, response }) {
      if (response.status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('auth_token')
          // Dispatch an event that the auth store can listen for
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
      }
    }
  }

  // Merge defaults with user provided options
  const params = defu(restOptions, defaults)

  // Use $fetch with resolved URL
  return $fetch<T>(resolvedUrl, params)
}