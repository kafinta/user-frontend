import { defineNuxtConfig } from 'nuxt/config';

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
    '~/plugins/toastify.ts',
  ],

  // Global CSS imports
  css: [
    'vue3-toastify/dist/index.css'
  ],

  // Add Font Awesome for OAuth icons
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        }
      ]
    }
  },

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