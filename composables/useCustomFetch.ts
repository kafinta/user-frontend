import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'


export function useCustomFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
    const XSRF_TOKEN = useCookie('XSRF-TOKEN')
    const config = useRuntimeConfig()

    const defaults: UseFetchOptions<T> = {
        baseURL: config.public.base_url as string ?? 'http://127.0.0.1:8000',
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
           console.log(_ctx.response._data)
        },

        onResponseError(_ctx) {

            if (_ctx.response.status == 401) {
                const user_session = useCookie('user_session', { sameSite: 'lax' })
                const router = useRouter()
                const user_account = useUserAccount()

                // user_account.value = undefined as any
                user_session.value = null

                console.log("error", _ctx.response._data.message)
                // router.push('/login')
            } else {
                const { $toast } = useNuxtApp()
                // $toast.error(_ctx.response._data.message)
            }
        }
    }

    // for nice deep defaults, please use unjs/defu
    const params = defu(options, defaults)

    return useFetch(url, params)
}
