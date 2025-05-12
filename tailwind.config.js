/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#C9B14F',
        'secondary': '#333333',
        'accent': {
          '50': '#f2f2f2',
          '100': '#e6e6e6',
          '200': '#cccccc',
          '300': '#b3b3b3',
          '400': '#999999',
          '500': '#333333',
          '600': '#666666',
          '700': '#4d4d4d',
          '800': '#333333',
          '900': '#1a1a1a',
          '950': '#0d0d0d'
        }
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
    },
  },
  variants: {
    extend: {},
  },
};