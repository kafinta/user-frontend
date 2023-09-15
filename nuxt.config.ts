export default defineNuxtConfig({
  // ssr: true,
  modules:[
    '@nuxtjs/tailwindcss',
  ],

  css:[
    '@/assets/css/main.css',
    '@/assets/css/glide.scss'
  ],

  runtimeConfig: {
    public: {
      baseURL: 'http://127.0.0.1:8000',
    },
  },
})