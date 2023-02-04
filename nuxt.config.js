export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Bookplaze | Official Website',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vuex-init.client.js',
    '~/plugins/dark-mode.client.js',
    '~/plugins/directives.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-mod÷÷ule',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: 'http://bookplaze-api.micakin.com',
    baseURL: 'http://127.0.0.1:8000',
    credentials: true,
  },


  tailwindcss: {
    config: {
      darkMode: 'class',

      // Options
      purge: [
        './pages/**/*.vue',
        './components/**/*.vue',
        './layouts/**/*.vue',
      ],

      theme: {
        extend: {
          boxShadow: {
            'light': '0 20px 50px rgba(172, 135, 120, 0.1)',
            'light-lg': '0 20px 50px rgba(172, 135, 120, 0.2)',
          },

          height: theme => ({
            'screen-40': '40vh',
            'screen-50': '50vh',
            'screen-60': '60vh',
            'screen-70': '70vh',
            'screen-75': '75vh',
            'screen-80': '80vh',
            'screen-85': '85vh',
            'screen-90': '90vh',

          }),

          width: {
            '112': '28rem',
            '128': '32rem',
            '144': '36rem',
            '160': '40rem',
            '176': '44rem',
            '192': '48rem',
          },

          zIndex: {
            '10': 10,
            '20': 20,
            '30': 30,
            '40': 40,
            '50': 50,
            '60': 60,
            '70': 70,
            '80': 80,
            '90': 90,
            '100': 100,
            '110': 110,
            '120': 120,
            '130': 130,
            '140': 140,
            '150': 150,
            'auto': 'auto',
          },

          colors: {
            accent1: {
              '50': '#e6ebff',
              '100': '#d1daff',
              '200': '#9aa4d0',
              '300': '#838bb0',
              '400': '#69708d',
              '500': '#51566c',
              '600': '#3e4259',
              '700': '#2a2e43',
              '800': '#181b2c',
              '900': '#080b1a'
            },
            accent2: {
              '50': '#fffdf8',
              '100': '#fffaee',
              '200': '#fff3da',
              '300': '#ffedc4',
              '400': '#ffe3a6',
              '500': '#ffd780',
              '600': '#ffc952',
              '700': '#dca836',
              '800': '#ab7b11',
              '900': '#724e00'
            },
          },

          transitionProperty: {
            'height': 'height',
            'width': 'width',
          },

          gridTemplateRows:{
            'masonry' : 'masonry'
          }
        },

      },

      variants: {
        extend: {
          width: ['group-hover'],
          height: ['group-hover'],
          scale: ['group-hover'],
          transform: ['group-hover']
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
