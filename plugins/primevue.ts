import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primeuix/themes';

const MyPreset = definePreset(Lara, {
  semantic: {
      primary: {
        50: '#f9f6eb',
        100: '#f3eed8',
        200: '#e7dcb1',
        300: '#dbcb8a',
        400: '#cfba63',
        500: '#C9B14F',
        600: '#9c8730',
        700: '#756524',
        800: '#4e4318',
        900: '#27220c',
        950: '#141106'
      }
  }
});

// import "primeicons/primeicons.css";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputVariant: 'filled',
    theme: {
      preset: MyPreset,
      options: {
        prefix: '',
        darkModeSelector: 'none',
        cssLayer: false
    }
    },
  });
});