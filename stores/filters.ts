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

  // Request tracking to prevent duplicates
  const activeRequests = ref<Map<string, Promise<any>>>(new Map())
  const failedRequests = ref<Set<string>>(new Set())

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
    const requestKey = 'categories'

    // Return existing data if available
    if (categories.value.length > 0) {
      return categories.value
    }

    // Check for cached data first
    const storedCategories = loadFromStorage('categories')
    if (storedCategories) {
      categories.value = storedCategories
      return storedCategories
    }

    // Return existing request if already in progress
    if (activeRequests.value.has(requestKey)) {
      return activeRequests.value.get(requestKey)
    }

    // Don't retry failed requests immediately
    if (failedRequests.value.has(requestKey)) {
      return false
    }

    isLoading.value = true
    error.value = null

    const requestPromise = (async () => {
      try {
        const response = await useCustomFetch<{ data: Category[] }>('api/categories/')

        if (response.data) {
          categories.value = response.data
          saveToStorage('categories', response.data)
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return response.data
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'An unknown error occurred'
        failedRequests.value.add(requestKey)
        return false
      } finally {
        isLoading.value = false
        activeRequests.value.delete(requestKey)
      }
    })()

    activeRequests.value.set(requestKey, requestPromise)
    return requestPromise
  }

  async function fetchLocations() {
    const requestKey = 'locations'

    // Return existing data if available
    if (locations.value.length > 0) {
      return locations.value
    }

    // Check for cached data first
    const storedLocations = loadFromStorage('locations')
    if (storedLocations) {
      locations.value = storedLocations
      return storedLocations
    }

    // Return existing request if already in progress
    if (activeRequests.value.has(requestKey)) {
      return activeRequests.value.get(requestKey)
    }

    // Don't retry failed requests immediately
    if (failedRequests.value.has(requestKey)) {
      return false
    }

    isLoading.value = true
    error.value = null

    const requestPromise = (async () => {
      try {
        const response = await useCustomFetch<{ data: Location[] }>('api/locations/')

        if (response.data) {
          locations.value = response.data
          saveToStorage('locations', response.data)
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return response.data
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'An unknown error occurred'
        failedRequests.value.add(requestKey)
        return false
      } finally {
        isLoading.value = false
        activeRequests.value.delete(requestKey)
      }
    })()

    activeRequests.value.set(requestKey, requestPromise)
    return requestPromise
  }

  async function fetchSubcategories(category_id: number, location_id: number) {
    const requestKey = `subcategories-${category_id}-${location_id}`

    // Return existing request if already in progress
    if (activeRequests.value.has(requestKey)) {
      return activeRequests.value.get(requestKey)
    }

    // Don't retry failed requests immediately
    if (failedRequests.value.has(requestKey)) {
      return false
    }

    isLoading.value = true
    error.value = null
    subcategories.value = []

    const requestPromise = (async () => {
      try {
        const response = await useCustomFetch<{ data: { subcategories: Subcategory[] } }>(
          `api/subcategories/?category_id=${category_id}&location_id=${location_id}`
        )

        if (response.data?.subcategories) {
          subcategories.value = response.data.subcategories
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return true
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'An unknown error occurred'
        failedRequests.value.add(requestKey)
        return false
      } finally {
        isLoading.value = false
        activeRequests.value.delete(requestKey)
      }
    })()

    activeRequests.value.set(requestKey, requestPromise)
    return requestPromise
  }

  async function fetchSubcategoryDetails(subcategory_id: number) {
    const requestKey = `subcategory-details-${subcategory_id}`

    // Return existing request if already in progress
    if (activeRequests.value.has(requestKey)) {
      return activeRequests.value.get(requestKey)
    }

    // Don't retry failed requests immediately
    if (failedRequests.value.has(requestKey)) {
      return false
    }

    isLoading.value = true
    error.value = null

    const requestPromise = (async () => {
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
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return true
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'An unknown error occurred'
        failedRequests.value.add(requestKey)
        return false
      } finally {
        isLoading.value = false
        activeRequests.value.delete(requestKey)
      }
    })()

    activeRequests.value.set(requestKey, requestPromise)
    return requestPromise
  }

  // Method to clear failed requests (allows retry)
  function clearFailedRequests() {
    failedRequests.value.clear()
  }

  // Method to clear specific failed request
  function clearFailedRequest(requestKey: string) {
    failedRequests.value.delete(requestKey)
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
    fetchSubcategoryDetails,

    // Utility methods
    clearFailedRequests,
    clearFailedRequest
  }
})