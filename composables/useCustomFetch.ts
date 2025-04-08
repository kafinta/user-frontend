// composables/useCustomFetch.ts
import type { UseFetchOptions } from '#app'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
import { defu } from 'defu'
import { useToast } from 'primevue/usetoast'

export function useCustomFetch<T>(
  url: NitroFetchRequest, 
  options: Omit<NitroFetchOptions<NitroFetchRequest>, 'method'> & { 
    requireAuth?: boolean 
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
  } = {}
) {
  const { requireAuth = false, method = 'GET', ...restOptions } = options
  const config = useRuntimeConfig()
  const toast = useToast()
  
  // Get token from localStorage directly
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
    onResponseError({ request, response }) {
      if (response.status === 401) {
        if (import.meta.client) {
          // Clear auth data
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          
          // Show toast notification using PrimeVue
          toast.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'Your session has expired. Please login again.',
            life: 3000
          })
          
          // Redirect to login if needed
          navigateTo('/auth/login')
        }
      }
    }
  }

  // Merge defaults with user provided options
  const params = defu(restOptions, defaults)

  // Use $fetch with resolved URL
  return $fetch<T>(resolvedUrl, params)
}