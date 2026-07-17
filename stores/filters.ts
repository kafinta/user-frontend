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
  slug?: string // Add slug for URL/query
}

export interface AttributeValue {
  id: number
  name: string
  representation?: string
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
  slug?: string // Add slug for URL/query
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

  /**
   * Convert API errors to user-friendly messages
   */
  function getErrorMessage(err: any): string {
    if (!err) {
      return 'Unable to connect. Please check your internet connection.'
    }

    const statusCode = err.response?.status || err.status_code

    if (statusCode === 404) {
      return 'No items available at the moment.'
    }

    if (statusCode === 401) {
      return 'Please log in to view items.'
    }

    if (statusCode === 403) {
      return 'You don\'t have access to these items.'
    }

    if (statusCode === 500) {
      return 'Something went wrong. Please try again in a moment.'
    }

    if (statusCode === 503) {
      return 'Service temporarily unavailable. Please try again soon.'
    }

    // Network errors
    if (err.message?.includes('fetch') || err.message?.includes('network')) {
      return 'Unable to connect. Please check your internet connection.'
    }

    // Default fallback
    return 'Unable to load items. Please try again.'
  }

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
      categories.value = storedCategories.map((category: Category) => ({
        ...category,
        slug: category.slug || normalizeSlug(category.name)
      }))
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
          categories.value = response.data.map(category => ({
            ...category,
            slug: category.slug || normalizeSlug(category.name)
          }))
          saveToStorage('categories', response.data)
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return response.data
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = getErrorMessage(err)
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
      locations.value = storedLocations.map((location: Location) => ({
        ...location,
        slug: location.slug || normalizeSlug(location.name)
      }))
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
          locations.value = response.data.map(location => ({
            ...location,
            slug: location.slug || normalizeSlug(location.name)
          }))
          saveToStorage('locations', response.data)
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return response.data
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = getErrorMessage(err)
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
          subcategories.value = response.data.subcategories.map(subcategory => ({
            ...subcategory,
            slug: subcategory.slug || normalizeSlug(subcategory.name)
          }))
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return true
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = getErrorMessage(err)
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
          selectedSubcategory.value = {
            ...response.data.subcategory,
            slug: response.data.subcategory.slug || normalizeSlug(response.data.subcategory.name)
          }
          failedRequests.value.delete(requestKey) // Clear failed status on success
          return true
        }

        failedRequests.value.add(requestKey)
        return false
      } catch (err) {
        error.value = getErrorMessage(err)
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