import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
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
      },

      surface: {
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
  }
});

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

  // Add ToastService
  nuxtApp.vueApp.use(ToastService);
});