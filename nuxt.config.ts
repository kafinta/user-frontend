import type { baseURL } from "nuxt/dist/core/runtime/nitro/paths";

export default defineNuxtConfig({
  // ssr: true,
  modules:[
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  css:[
    '@/assets/css/glide.scss'
  ],

  runtimeConfig: {
    public: {
      base_url: 'https://backend-9jp2.onrender.com',
    },
  },

  // router: {
  //   routes: [
  //     // Your routes here
  //     {
  //       path: '/',
  //       middleware: ['routing'],
  //     },
  //     // More routes with optional middleware usage
  //   ],
  // },
})