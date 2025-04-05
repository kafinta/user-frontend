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
      // Check if response contains a token and set it in localStorage
      if (response._data && typeof response._data === 'object') {
        if ('token' in response._data && response._data.token) {
          if (import.meta.client) {
            localStorage.setItem('auth_token', response._data.token)
          }
        } else if ('access_token' in response._data && response._data.access_token) {
          if (import.meta.client) {
            localStorage.setItem('auth_token', response._data.access_token)
          }
        }
      }
    },
    onResponseError({ request, response }) {
      // 401 Unauthorized handling - could dispatch a custom event instead of directly accessing store
      if (response.status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          // Could dispatch a logout event here
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