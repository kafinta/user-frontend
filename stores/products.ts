import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Subcategory, Location } from './filters'

export interface ProductImage {
  id: number
  url: string
  path?: string
}

export interface ProductAttribute {
  id: number
  name: string
  value: {
    id: number
    name: string
    representation?: string
  }
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  status: 'draft' | 'active' | 'paused' | 'denied' | 'out_of_stock'
  is_featured: boolean
  manage_stock: boolean
  stock_quantity: number
  subcategory_id: number
  location_id?: number
  user_id: number
  denial_reason?: string | null
  subcategory?: Subcategory
  location?: Location
  attributes?: ProductAttribute[]
  images?: ProductImage[]
  created_at?: string
  updated_at?: string
}

export interface ProductStats {
  total_products: number
  active_products: number
  draft_products: number
  paused_products: number
  denied_products: number
  out_of_stock_products: number
  products_with_stock: number
  low_stock_products: number
  zero_stock_products: number
  avg_stock_quantity: number
  total_stock_quantity: number
  completion_rate: number
  stock_health: number
}

export const useProductsStore = defineStore('products', () => {
  // State
  const myProducts = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const productStats = ref<ProductStats | null>(null)
  const isLoading = ref(false)
  const isLoadingStats = ref(false)

  // Computed
  const totalProducts = computed(() => myProducts.value.length)
  
  const productsByStatus = computed(() => {
    const grouped = {
      draft: [],
      active: [],
      paused: [],
      denied: [],
      out_of_stock: []
    }
    
    myProducts.value.forEach(product => {
      if (grouped[product.status]) {
        grouped[product.status].push(product)
      }
    })
    
    return grouped
  })

  const activeProducts = computed(() => productsByStatus.value.active)
  const draftProducts = computed(() => productsByStatus.value.draft)
  const pausedProducts = computed(() => productsByStatus.value.paused)
  const deniedProducts = computed(() => productsByStatus.value.denied)
  const outOfStockProducts = computed(() => productsByStatus.value.out_of_stock)

  const lowStockProducts = computed(() => {
    return myProducts.value.filter(product => 
      product.manage_stock && 
      product.stock_quantity > 0 && 
      product.stock_quantity <= 5
    )
  })

  const zeroStockProducts = computed(() => {
    return myProducts.value.filter(product => 
      product.manage_stock && 
      product.stock_quantity === 0
    )
  })

  // Actions
  const setMyProducts = (products: Product[]) => {
    myProducts.value = Array.isArray(products) ? products : []
  }

  const addProduct = (product: Product) => {
    if (product && product.id) {
      // Check if product already exists
      const existingIndex = myProducts.value.findIndex(p => p.id === product.id)
      if (existingIndex === -1) {
        myProducts.value.push(product)
      }
    }
  }

  const updateProduct = (updatedProduct: Partial<Product> & { id: number }) => {
    if (updatedProduct && updatedProduct.id) {
      const index = myProducts.value.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) {
        myProducts.value[index] = { ...myProducts.value[index], ...updatedProduct }
      }

      // Update current product if it's the same one
      if (currentProduct.value?.id === updatedProduct.id) {
        currentProduct.value = { ...currentProduct.value, ...updatedProduct }
      }
    }
  }

  const removeProduct = (productId: number) => {
    myProducts.value = myProducts.value.filter(p => p.id !== productId)

    // Clear current product if it was the removed one
    if (currentProduct.value?.id === productId) {
      currentProduct.value = null
    }
  }

  const setCurrentProduct = (product: Product | null) => {
    currentProduct.value = product
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  const setProductStats = (stats: ProductStats | null) => {
    productStats.value = stats
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setLoadingStats = (loading: boolean) => {
    isLoadingStats.value = loading
  }

  // Bulk operations
  const updateMultipleProducts = (productIds: number[], updates: Partial<Product>) => {
    productIds.forEach(id => {
      const index = myProducts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        myProducts.value[index] = { ...myProducts.value[index], ...updates }
      }
    })
  }

  const bulkUpdateStatus = (productIds: number[], status: Product['status']) => {
    updateMultipleProducts(productIds, { status })
  }

  // Search and filter helpers
  const findProductById = (id: number): Product | undefined => {
    return myProducts.value.find(p => p.id === id)
  }

  const findProductBySlug = (slug: string): Product | undefined => {
    return myProducts.value.find(p => p.slug === slug)
  }

  const getProductsByStatus = (status: Product['status']): Product[] => {
    return myProducts.value.filter(p => p.status === status)
  }

  const getProductsByStockStatus = (stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock'): Product[] => {
    switch (stockStatus) {
      case 'in_stock':
        return myProducts.value.filter(p =>
          !p.manage_stock || (p.manage_stock && p.stock_quantity > 0)
        )
      case 'out_of_stock':
        return myProducts.value.filter(p =>
          p.manage_stock && p.stock_quantity === 0
        )
      case 'low_stock':
        return lowStockProducts.value
      default:
        return myProducts.value
    }
  }

  // Reset store
  const $reset = () => {
    myProducts.value = []
    currentProduct.value = null
    productStats.value = null
    isLoading.value = false
    isLoadingStats.value = false
  }

  return {
    // State
    myProducts,
    currentProduct,
    productStats,
    isLoading,
    isLoadingStats,

    // Computed
    totalProducts,
    productsByStatus,
    activeProducts,
    draftProducts,
    pausedProducts,
    deniedProducts,
    outOfStockProducts,
    lowStockProducts,
    zeroStockProducts,

    // Actions
    setMyProducts,
    addProduct,
    updateProduct,
    removeProduct,
    setCurrentProduct,
    clearCurrentProduct,
    setProductStats,
    setLoading,
    setLoadingStats,
    updateMultipleProducts,
    bulkUpdateStatus,

    // Helpers
    findProductById,
    findProductBySlug,
    getProductsByStatus,
    getProductsByStockStatus,

    // Reset
    $reset
  }
})
