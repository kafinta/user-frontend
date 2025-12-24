import { ref } from 'vue'
import { useProductsApi } from '~/composables/useProductsApi'

export interface CarouselProduct {
  id: number
  slug: string
  name: string
  price: string
  image: string
  rating: number
  reviewCount: number
  salesCount: number
}

export interface UseProductsCarouselOptions {
  endpoint: '/api/products/top' | '/api/products/featured'
}

export function useProductsCarousel(options: UseProductsCarouselOptions) {
  const productsApi = useProductsApi()
  const products = ref<CarouselProduct[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Get customized error message based on error type
   */
  function getErrorMessage(err: any): string {
    if (!err) {
      return 'Unable to connect. Please check your internet connection.'
    }

    const statusCode = err.response?.status || err.status_code

    if (statusCode === 404) {
      return 'No products available at the moment.'
    }

    if (statusCode === 401) {
      return 'Please log in to view products.'
    }

    if (statusCode === 403) {
      return 'You don\'t have access to these products.'
    }

    if (statusCode === 500) {
      return 'Something went wrong. Please try again in a moment.'
    }

    if (statusCode === 503) {
      return 'Service temporarily unavailable. Please try again soon.'
    }

    if (statusCode >= 400 && statusCode < 500) {
      return err.data?.message || 'Something went wrong. Please try again.'
    }

    if (statusCode >= 500) {
      return 'Something went wrong. Please try again in a moment.'
    }

    if (err.data?.message) {
      return err.data.message
    }

    if (err.message) {
      return err.message
    }

    return 'Unable to load products. Please try again.'
  }

  /**
   * Fetch products from the specified endpoint
   */
  async function fetchProducts() {
    isLoading.value = true
    error.value = null

    try {
      const response = await productsApi.fetchCarouselProducts(options.endpoint)

      if (response && response.status === 'success') {
        const apiProducts = response.data?.products || []

        if (!apiProducts || apiProducts.length === 0) {
          error.value = 'No products available at the moment. Check back soon!'
          return
        }

        products.value = apiProducts.map((product: any) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || '',
          rating: product.average_rating || 0,
          reviewCount: product.review_count || 0,
          salesCount: product.sales_count || 0
        }))
      } else {
        error.value = response?.message || 'Failed to load products. Please try again.'
      }
    } catch (err: any) {
      error.value = getErrorMessage(err)
      console.error(`Error fetching products from ${options.endpoint}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    getErrorMessage
  }
}

