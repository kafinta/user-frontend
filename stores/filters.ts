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

export interface AttributeValue {
  id: number
  name: string
}

export interface Attribute {
  id: number
  name: string
  values: AttributeValue[]
}

export interface Subcategory {
  id: number
  name: string
  category_id?: number
  location_id?: number
  image_path?: string | null
  attributes?: Attribute[]
}

export const useFiltersStore = defineStore('filters', () => {
  // State
  const categories = ref<Category[]>([])
  const locations = ref<Location[]>([])
  const subcategories = ref<Subcategory[]>([])
  const selectedSubcategory = ref<Subcategory | null>(null)
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
    isLoading.value = true
    error.value = null

    const storedCategories = loadFromStorage('categories')
    if (storedCategories) {
      categories.value = storedCategories
      isLoading.value = false
      return storedCategories
    }

    try {
      const response = await useCustomFetch<{ data: Category[] }>('api/categories/')

      if (response.data) {
        categories.value = response.data
        saveToStorage('categories', response.data)
        return response.data
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

    const storedLocations = loadFromStorage('locations')
    if (storedLocations) {
      locations.value = storedLocations
      isLoading.value = false
      return storedLocations
    }

    try {
      const response = await useCustomFetch<{ data: Location[] }>('api/locations/')

      if (response.data) {
        locations.value = response.data
        saveToStorage('locations', response.data)
        return response.data
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
        `api/subcategories/?category_id=${category_id}&location_id=${location_id}`
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

  async function fetchSubcategoryDetails(subcategory_id: number) {
    isLoading.value = true
    error.value = null

    try {
      const response = await useCustomFetch<{
        status: string,
        status_code: number,
        message: string,
        data: {
          subcategory: Subcategory
        }
      }>(`api/subcategories/${subcategory_id}`)

      if (response.data?.subcategory) {
        selectedSubcategory.value = response.data.subcategory
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
    selectedSubcategory,
    isLoading,
    error,

    // Actions
    fetchCategories,
    fetchLocations,
    fetchSubcategories,
    fetchSubcategoryDetails
  }
})