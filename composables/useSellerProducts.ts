import { ref } from 'vue'
import { useCustomFetch } from '@/composables/useCustomFetch'

/**
 * Composable for seller product management (CRUD, attributes, images, status, stats)
 */
export function useSellerProducts() {
  // State
  const products = ref<any[]>([])
  const stats = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<any>(null)
  /**
   * Pagination object (current_page, total, per_page, last_page, etc.)
   * Populated after fetchMyProducts
   */
  const pagination = ref<any>(null)

  /**
   * Fetch the seller's products (with optional filters/pagination)
   * @param {object} params - Query params (e.g., page, per_page, filters)
   */
  async function fetchMyProducts(params: any = {}): Promise<any> {
    isLoading.value = true
    error.value = null
    const data: any = await useCustomFetch<any>('/api/products/my-products', { params })
    products.value = data?.data?.products || []
    pagination.value = data?.data || null
    isLoading.value = false
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
    return data?.data || null
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
    return data?.data || null
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

  return {
    products,
    stats,
    isLoading,
    error,
    pagination,
    fetchMyProducts,
    fetchMyStats,
    createProduct,
    updateProduct,
    deleteProduct,
    updateAttributes,
    uploadImages,
    publishProduct,
    updateStatus,
    bulkUpdateStatus
  }
} 