export default defineNuxtConfig({
  // ssr: true,
  modules:[
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  

  css:[
    '@/assets/css/glide.scss'
  ],

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
  runtimeConfig: {
    public: {
      base_url: 'http://127.0.0.1:8000',
    },
  },

  compatibilityDate: '2024-09-11',
})