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
          '50': '#F8F8F8',
          '100': '#EAEAEA',
          '200': '#D3D3D3',
          '300': '#BFBFBF',
          '400': '#555555',
          '500': '#444444',
          '600': '#222222',
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
  plugins: [],
};