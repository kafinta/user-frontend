import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCustomFetch } from "../composables/useCustomFetch"

export interface Category {
  id: number
  name: string
  image_path: string
  slug?: string
}

export interface Location {
  id: number
  name: string
  image_path?: string
}

export interface Subcategory {
  id: number
  name: string
  category_id: number
  location_id: number
}

export const useFiltersStore = defineStore('filters', () => {
  // State
  const categories = ref<Category[]>([])
  const locations = ref<Location[]>([])
  const subcategories = ref<Subcategory[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchCategories() {
    isLoading.value = true
    error.value = null
    try {
      const response = await useCustomFetch<{ data: Category[] }>('api/categories/')
      
      if (response.data) {
        categories.value = response.data
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLocations() {
    isLoading.value = true
    error.value = null
    try {
      const response = await useCustomFetch<{ data: Location[] }>('api/locations/')
      
      if (response.data) {
        locations.value = response.data
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSubcategories(category_id: number, location_id: number) {
    isLoading.value = true
    error.value = null
    subcategories.value = []
    
    try {
      const response = await useCustomFetch<{ data: { subcategories: Subcategory[] } }>(
        `api/subcategories/find?category_id=${category_id}&location_id=${location_id}`
      )
      
      if (response.data?.subcategories) {
        subcategories.value = response.data.subcategories
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    categories,
    locations,
    subcategories,
    isLoading,
    error,

    // Actions
    fetchCategories,
    fetchLocations,
    fetchSubcategories
  }
})