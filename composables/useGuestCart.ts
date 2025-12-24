import { ref, computed } from 'vue'

export interface GuestCartItem {
  id: string // Unique identifier for guest cart item
  product_id: number
  product: {
    id: number
    name: string
    price: number
    slug: string
    images?: Array<{ path: string; url: string }>
  }
  quantity: number
  subtotal: number
}

const GUEST_CART_STORAGE_KEY = 'kafinta_guest_cart'

export function useGuestCart() {
  const items = ref<GuestCartItem[]>([])

  /**
   * Load cart from localStorage
   */
  function loadCart() {
    if (process.client) {
      const stored = localStorage.getItem(GUEST_CART_STORAGE_KEY)
      if (stored) {
        try {
          items.value = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse guest cart from localStorage:', e)
          items.value = []
        }
      }
    }
  }

  /**
   * Save cart to localStorage
   */
  function saveCart() {
    if (process.client) {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items.value))
    }
  }

  /**
   * Add item to guest cart
   */
  function addItem(product: any, quantity: number = 1) {
    const existingItem = items.value.find(i => i.product_id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.subtotal = existingItem.quantity * existingItem.product.price
    } else {
      const id = `guest_${product.id}_${Date.now()}`
      items.value.push({
        id,
        product_id: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          slug: product.slug,
          images: product.images
        },
        quantity,
        subtotal: quantity * product.price
      })
    }
    
    saveCart()
  }

  /**
   * Remove item from guest cart
   */
  function removeItem(productId: number) {
    const index = items.value.findIndex(i => i.product_id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCart()
    }
  }

  /**
   * Update item quantity
   */
  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(i => i.product_id === productId)
    if (item) {
      item.quantity = quantity
      item.subtotal = quantity * item.product.price
      saveCart()
    }
  }

  /**
   * Clear entire cart
   */
  function clearCart() {
    items.value = []
    if (process.client) {
      localStorage.removeItem(GUEST_CART_STORAGE_KEY)
    }
  }

  /**
   * Get cart totals
   */
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => sum + item.subtotal, 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  return {
    items,
    totalItems,
    subtotal,
    isEmpty,
    loadCart,
    saveCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
}

