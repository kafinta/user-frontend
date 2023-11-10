import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'


export function useCustomFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
    const XSRF_TOKEN = useCookie('XSRF-TOKEN')
    const config = useRuntimeConfig()

    // console.log( XSRF_TOKEN.value)

    const defaults: UseFetchOptions<T> = {
        baseURL: config.public.base_url as string ?? 'http://localhost:8000',
        // cache request
        key: url,
        credentials: 'include',

        // set user token if connected
        headers:
        {
            'accept': 'application/json, text/plain, */*',
            'X-XSRF-TOKEN': XSRF_TOKEN.value ? XSRF_TOKEN.value : ''
        },

        onResponse(_ctx) {
            // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
           toast.success(_ctx.response._data.message)
        },

        onResponseError(_ctx) {
            if (_ctx.response.status == 401) {
                const user_session = useCookie('user_session', { sameSite: 'lax' })
                toast.error(_ctx.response._data.message)
            } else {
                toast.error(_ctx.response._data.message)
            }
        }
    }

    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return useFetch(url, params)
}
