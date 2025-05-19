import { defineNuxtConfig } from 'nuxt/config';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineNuxtConfig({
  modules:[
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  // Server configuration
  devServer: {
    port: 3000,
    host: 'localhost'
  },

  plugins: [
    '~/plugins/primevue.ts',
    '~/plugins/auth.ts',
    '~/plugins/toastify.ts',
  ],

  image: {
    domains: ['127.0.0.1', 'localhost'],
    presets: {
      default: {
        modifiers: {
          format: 'webp',
          quality: 80
        }
      }
    }
  },

  vite: {
    plugins: [
      Components({
        resolvers: [PrimeVueResolver()]
      })
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path: string) => path
        },
        '/sanctum': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path: string) => path
        }
      }
    }
  },

  runtimeConfig: {
    public: {
      base_url: 'http://127.0.0.1:8000',
      imageBaseUrl: 'http://127.0.0.1:8000/storage'
    },
  },

  compatibilityDate: '2024-09-11',
}as any)