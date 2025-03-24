import { defineNuxtConfig } from 'nuxt/config';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineNuxtConfig({
  // ssr: true,
  modules:[
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  vite: {
    plugins: [
      // vue(),
      Components({
        resolvers: [PrimeVueResolver()]
      })
    ]
  },

  css: [
    '@glidejs/glide/dist/css/glide.core.min.css',
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