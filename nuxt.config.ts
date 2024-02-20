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
      baseURL: 'http://127.0.0.1:8000',
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