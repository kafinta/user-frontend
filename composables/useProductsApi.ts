import { ref } from 'vue'
import { useCustomFetch } from '@/composables/useCustomFetch'
import { useAppToast } from '~/utils/toastify'

// Singleton instance so multiple callers share state (products page + filter sidebar)
let productsApiSingleton: any = null
let inFlightFetchKey: string | null = null
let lastFetchKey: string | null = null

/**
 * Consolidated composable for all product operations
 * Handles both seller product management and marketplace product fetching
 * Combines CRUD operations, attributes, images, status, stats, and single product fetching
 * Standardized error handling and return types
 * Includes caching to reduce redundant API calls
 */
export function useProductsApi() {
  if (productsApiSingleton) return productsApiSingleton
  const toast = useAppToast()

  // State
  const products = ref<any[]>([])
  const stats = ref<any>(null)
  const filters = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<any>(null)
  /**
   * Pagination object (current_page, total, per_page, last_page, etc.)
   * Populated after fetchMyProducts or fetchProducts
   */
  const pagination = ref<any>(null)

  // Cache for single products (by slug and ID)
  const productCache = new Map<string, any>()
  const productCacheTimestamp = new Map<string, number>()
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

  /**
   * Check if cached data is still valid
   */
  function isCacheValid(key: string): boolean {
    const timestamp = productCacheTimestamp.get(key)
    if (!timestamp) return false
    return Date.now() - timestamp < CACHE_DURATION
  }

  /**
   * Invalidate cache for a specific product
   */
  function invalidateProductCache(slug?: string, id?: string): void {
    if (slug) productCache.delete(`slug:${slug}`)
    if (id) productCache.delete(`id:${id}`)
    if (slug) productCacheTimestamp.delete(`slug:${slug}`)
    if (id) productCacheTimestamp.delete(`id:${id}`)
  }

  /**
   * Invalidate all product cache
   */
  function invalidateAllProductCache(): void {
    productCache.clear()
    productCacheTimestamp.clear()
  }

  /**
   * Fetch the seller's products (with optional filters/pagination)
   * @param {object} params - Query params (e.g., page, per_page, filters)
   */
  async function fetchMyProducts(params: any = {}): Promise<any> {
    isLoading.value = true
    error.value = null
    const data: any = await useCustomFetch<any>('/api/products/my-products', { params })
    products.value = data?.data?.products || []
    pagination.value = data?.data?.pagination || null
    isLoading.value = false
  }

  async function fetchProductsFromEndpoint(endpoint: string, params: any = {}): Promise<any> {
    const fetchKey = `${endpoint}:${JSON.stringify(params || {})}`

    if (inFlightFetchKey === fetchKey) {
      return { status: 'success', data: { products: products.value, pagination: pagination.value, filters: filters.value } }
    }

    if (lastFetchKey === fetchKey && products.value.length > 0) {
      return { status: 'success', data: { products: products.value, pagination: pagination.value, filters: filters.value } }
    }

    isLoading.value = true
    error.value = null

    inFlightFetchKey = fetchKey
    try {
      const response: any = await useCustomFetch<any>(endpoint, { params })
      products.value = response?.data?.products || []
      pagination.value = response?.data?.pagination || null
      filters.value = response?.data?.filters || null
      lastFetchKey = fetchKey
      return response
    } finally {
      isLoading.value = false
      inFlightFetchKey = null
    }
  }

  async function fetchProducts(params: any = {}): Promise<any> {
    return fetchProductsFromEndpoint('/api/products', params)
  }

  /**
   * Fetch seller product statistics
   */
  async function fetchMyStats(): Promise<any> {
    isLoading.value = true
    error.value = null
    const { data, error: fetchError }: any = await useCustomFetch<any>('/api/products/my-stats')
    if (fetchError?.value) error.value = fetchError.value
    else stats.value = data?.value?.data || null
    isLoading.value = false
  }

  /**
   * Create a new product (basic info)
   * @param {object} payload - Product info (name, description, price, subcategory_id, location_id, manage_stock, stock_quantity)
   */
  async function createProduct(payload: any): Promise<any> {
    isLoading.value = true
    error.value = null
    const data: any = await useCustomFetch<any>('/api/products/basic-info', {
      method: 'POST',
      body: payload
    })
    isLoading.value = false
    return data
  }

  /**
   * Update an existing product's basic info
   * @param {number} productId
   * @param {object} payload
   */
  async function updateProduct(productId: any, payload: any): Promise<any> {
    isLoading.value = true
    error.value = null
    const data: any = await useCustomFetch<any>(`/api/products/${productId}/basic-info`, {
      method: 'PUT',
      body: payload
    })
    isLoading.value = false
    // Invalidate cache for this product
    invalidateProductCache(undefined, productId)
    return data
  }

  /**
   * Delete a product
   * @param {number} productId
   */
  async function deleteProduct(productId: any): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { data, error: fetchError }: any = await useCustomFetch<any>(`/api/products/${productId}`, {
      method: 'DELETE'
    })
    isLoading.value = false
    if (fetchError?.value) {
      error.value = fetchError.value
      return false
    }
    // Invalidate cache for this product
    invalidateProductCache(undefined, productId)
    return true
  }

  /**
   * Add or update product attributes
   * @param {number} productId
   * @param {Array} attributes - [{ attribute_id, value_id }]
   */
  async function updateAttributes(productId: any, attributes: any): Promise<any> {
    isLoading.value = true
    error.value = null
    const data: any = await useCustomFetch<any>(`/api/products/${productId}/attributes`, {
      method: 'POST',
      body: { attributes }
    })
    isLoading.value = false
    // Invalidate cache for this product
    invalidateProductCache(undefined, productId)
    return data?.data || null
  }

  /**
   * Upload images for a product
   * @param {number} productId
   * @param {File[]} images
   */
  async function uploadImages(productId: any, images: File[]): Promise<any> {
    isLoading.value = true
    error.value = null
    const formData = new FormData()
    images.forEach((img: File) => formData.append('images[]', img))
    const data: any = await useCustomFetch<any>(`/api/products/${productId}/images`, {
      method: 'POST',
      body: formData
    })
    isLoading.value = false
    // Invalidate cache for this product
    invalidateProductCache(undefined, productId)
    return data?.data || null
  }

  /**
   * Publish a product
   * @param {number} productId
   */
  async function publishProduct(productId: any): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { data, error: fetchError }: any = await useCustomFetch<any>(`/api/products/${productId}/publish`, {
      method: 'POST'
    })
    isLoading.value = false
    if (fetchError?.value) {
      error.value = fetchError.value
      return false
    }
    // Invalidate cache for this product
    invalidateProductCache(undefined, productId)
    return true
  }

  /**
   * Update product status
   * @param {number} productId
   * @param {string} status
   * @param {string} [reason]
   */
  async function updateStatus(productId: any, status: any, reason: any = undefined): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { data, error: fetchError }: any = await useCustomFetch<any>(`/api/products/${productId}/status`, {
      method: 'PATCH',
      body: { status, reason }
    })
    isLoading.value = false
    if (fetchError?.value) {
      error.value = fetchError.value
      return false
    }
    // Invalidate cache for this product
    invalidateProductCache(undefined, productId)
    return true
  }

  /**
   * Bulk update product status
   * @param {number[]} productIds
   * @param {string} status
   */
  async function bulkUpdateStatus(productIds: any, status: any): Promise<boolean> {
    isLoading.value = true
    error.value = null
    const { data, error: fetchError }: any = await useCustomFetch<any>('/api/products/bulk-status', {
      method: 'PATCH',
      body: { product_ids: productIds, status }
    })
    isLoading.value = false
    if (fetchError?.value) {
      error.value = fetchError.value
      return false
    }
    return true
  }

  /**
   * Get single product by ID (with caching)
   * @param {number} productId
   * @param {boolean} forceRefresh - Force fetch from API, bypassing cache
   */
  async function getProduct(productId: any, forceRefresh: boolean = false): Promise<any> {
    try {
      const cacheKey = `id:${productId}`

      // Check cache first
      if (!forceRefresh && isCacheValid(cacheKey)) {
        return { status: 'success', data: productCache.get(cacheKey) }
      }

      const response = await useCustomFetch(`/api/products/${productId}`, {
        method: 'GET'
      })

      // Cache the result
      if (response.status === 'success' && response.data) {
        productCache.set(cacheKey, response.data)
        productCacheTimestamp.set(cacheKey, Date.now())
      }

      return response
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to fetch product'
      toast.error(errorMessage)
      throw error
    }
  }

  /**
   * Get single product by slug (with caching)
   * @param {string} slug
   * @param {boolean} forceRefresh - Force fetch from API, bypassing cache
   */
  async function getProductBySlug(slug: any, forceRefresh: boolean = false): Promise<any> {
    try {
      const cacheKey = `slug:${slug}`

      // Check cache first
      if (!forceRefresh && isCacheValid(cacheKey)) {
        return { status: 'success', data: productCache.get(cacheKey) }
      }

      const response = await useCustomFetch(`/api/products/slug/${slug}`, {
        method: 'GET'
      })

      // Cache the result
      if (response.status === 'success' && response.data) {
        productCache.set(cacheKey, response.data)
        productCacheTimestamp.set(cacheKey, Date.now())
      }

      return response
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to fetch product'
      toast.error(errorMessage)
      throw error
    }
  }

  /**
   * Delete product image
   * @param {number} imageId
   */
  async function deleteImage(imageId: any): Promise<any> {
    try {
      const response = await useCustomFetch(`/api/images/${imageId}`, {
        method: 'DELETE'
      })

      if ((response as any).status === 'success') {
        toast.success((response as any).message || 'Image deleted successfully')
      }

      return response
    } catch (error: any) {
      const errorMessage = error.data?.message || 'Failed to delete image'
      toast.error(errorMessage)
      throw error
    }
  }

  /**
   * Alias for createProduct - matches useProductApi naming
   * @param {object} productData
   */
  async function createBasicInfo(productData: any): Promise<any> {
    return createProduct(productData)
  }

  /**
   * Alias for updateProduct - matches useProductApi naming
   * @param {number} productId
   * @param {object} productData
   */
  async function updateBasicInfo(productId: any, productData: any): Promise<any> {
    return updateProduct(productId, productData)
  }

  /**
   * Alias for updateAttributes - matches useProductApi naming
   * @param {number} productId
   * @param {Array} attributeValues
   */
  async function setAttributes(productId: any, attributeValues: any): Promise<any> {
    return updateAttributes(productId, attributeValues)
  }

  /**
   * Fetch top/trending products for carousel
   * @param {string} endpoint - '/api/products/top' or '/api/products/featured'
   */
  async function fetchCarouselProducts(endpoint: '/api/products/top' | '/api/products/featured'): Promise<any> {
    try {
      const response = await useCustomFetch(endpoint, {
        method: 'GET'
      })
      return response
    } catch (error: any) {
      console.error(`Error fetching carousel products from ${endpoint}:`, error)
      throw error
    }
  }

  const api = {
    // State
    products,
    stats,
    filters,
    isLoading,
    error,
    pagination,
    // Listing & Stats
    fetchMyProducts,
    fetchProducts,
    fetchProductsFromEndpoint,
    fetchMyStats,
    // Product CRUD
    createProduct,
    createBasicInfo, // Alias for createProduct
    updateProduct,
    updateBasicInfo, // Alias for updateProduct
    deleteProduct,
    getProduct,
    getProductBySlug,
    // Attributes
    updateAttributes,
    setAttributes, // Alias for updateAttributes
    // Images
    uploadImages,
    deleteImage,
    // Publishing & Status
    publishProduct,
    updateStatus,
    bulkUpdateStatus,
    // Carousel
    fetchCarouselProducts,
    // Cache management
    invalidateProductCache,
    invalidateAllProductCache
  }

  productsApiSingleton = api
  return productsApiSingleton
}