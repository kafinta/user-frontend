export default defineNuxtConfig({
  // ssr: true,
  modules:[
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  // app: {
  //   head: {
  //     link: [
  //       { rel: 'stylesheet', href: "node_modules/@glidejs/glide/dist/css/glide.core.min.css" }
  //     ],
  //   }
  // },

  css: [
    '@glidejs/glide/dist/css/glide.core.min.css',
    // '@glidejs/glide/dist/css/glide.theme.min.css' // (optional, if needed)
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
      base_url: 'http://127.0.0.1:8000/',
    },
  },

  compatibilityDate: '2024-09-11',
})