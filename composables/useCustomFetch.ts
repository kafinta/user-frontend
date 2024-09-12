import type { UseFetchOptions } from '#app'
import type { Ref } from 'vue'
import { defu } from 'defu'

export function useCustomFetch<T>(
  url: string | Ref<string>,
  options: UseFetchOptions<T> = {}
) {
  const XSRF_TOKEN = useCookie('XSRF-TOKEN')
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.base_url,
    credentials: 'include',
    headers: {
      'accept': 'application/json, text/plain, */*',
      'X-XSRF-TOKEN': XSRF_TOKEN.value ?? '',
    },
  }

  // Merge defaults with user provided options
  const params = defu(options, defaults)

  return useFetch<T>(url, params as any)
}