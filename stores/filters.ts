import { defineStore } from 'pinia'
import { useCustomFetch } from "../composables/useCustomFetch";

interface Category {
  id: number;
  // Add other properties as needed
}

interface Location {
  // Define properties for locations
}

interface Subcategory {
  // Define properties for subcategories
}

export const useFilters = defineStore('filters', {
  state: () => ({ 
    categories: [] as Category[],
    locations: [] as Location[],
    subcategories: [] as Subcategory[],
  }),

  getters: {
    getCategories: (state) => state.categories,
    getSubcategories: (state) => state.subcategories,
    getLocations: (state) => state.locations,
  },
  
  actions: {
    async fetchCategories() {
      const { data } = await useCustomFetch<Category[]>('api/categories/')
      if (data.value) {
        this.categories = data.value;
      }
    },

    async fetchLocations() {
      const { data } = await useCustomFetch<Location[]>('api/locations/')
      if (data.value) {
        this.locations = data.value;
      }
    },

    async selectCategory(category: Category) {
      this.subcategories = [];
      const { data } = await useCustomFetch<{ subcategories: Subcategory[] }>(`api/categories/${category.id}/subcategories/`)
      if (data.value) {
        this.subcategories = data.value.subcategories;
      }
    }
  },
})