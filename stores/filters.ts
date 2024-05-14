import { defineStore } from 'pinia'
import {useCustomFetch} from "../composables/useCustomFetch";

export const useFilters = defineStore('filters', {
  state: () => ({ 
    categories: [],
    locations: [],
    subcategories: [],
  }),

  getters: {
    getCategories(state){
      return state.categories
    },
    getSubcategories(state){
      return state.subcategories
    },
    getLocations(state){
      return state.locations
    }
  },
  
  actions: {
    async fetchCategories() {
      const { pending, data, error } = await useCustomFetch('api/categories/', {
        method: 'GET',
      })
      if (data) {
        this.categories = data.value as never[];
      }
    },

    async fetchLocations () {
      const { pending, data, error } = await useCustomFetch('api/locations/', {
        method: 'GET',
      })
      if (data) {
        this.locations = data.value as never[];
      }
    },

    async selectCategory(category:any){
      this.subcategories = []
      const { pending, data, error } = await useCustomFetch(`api/categories/${category.id}/subcategories/`, {
        method: 'GET',
      })
      if (data) {
        this.subcategories = data.value.subcategories;
      }
    }
  },
})