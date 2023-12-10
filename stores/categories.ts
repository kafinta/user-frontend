import { defineStore } from 'pinia'
// import {useCustomFetch} from "../composables/useCustomFetch";

export const useCategoriesStore = defineStore('categories', {
  state: () => ({ 
    categories: []
  }),

  getters: {
  },
  actions: {
    testAction() {
      console.log('test worked');
    }
  }
})