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

  function saveToStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Error saving to localStorage', error)
    }
  }

  function loadFromStorage(key: string) {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Check if data is less than 24 hours old
        const isRecent = (Date.now() - parsed.timestamp) < (24 * 60 * 60 * 1000)
        return isRecent ? parsed.data : null
      }
      return null
    } catch (error) {
      console.error('Error loading from localStorage', error)
      return null
    }
  }

  async function fetchCategories() {
    const storedCategories = loadFromStorage('categories')
    if (storedCategories) {
      categories.value = storedCategories
      return storedCategories
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await useCustomFetch<{ data: Category[] }>('api/categories/')
      
      if (response.data) {
        categories.value = response.data
        saveToStorage('categories', response.data)
        return response.data
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return false
    } finally {
      isLoading.value = false
      return true
    }
  }

  async function fetchLocations() {
    const storedLocations = loadFromStorage('locations')
    if (storedLocations) {
      locations.value = storedLocations
      return storedLocations
    }

    isLoading.value = true
    error.value = null
    try {
      const response = await useCustomFetch<{ data: Location[] }>('api/locations/')
      
      if (response.data) {
        locations.value = response.data
        saveToStorage('locations', response.data)
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred'
      return false
    } finally {
      isLoading.value = false
      return locations.value
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