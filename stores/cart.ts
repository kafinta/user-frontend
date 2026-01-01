import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: number
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

export interface Cart {
  items: CartItem[]
  total: number
  item_count: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isGuestMode = ref(false)

  // Computed
  const itemCount = computed(() => items.value.length)

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((sum, item) => {
      // Ensure subtotal is always a number, calculate if missing
      const itemSubtotal = item.subtotal || (item.quantity * item.product.price)
      return sum + (Number(itemSubtotal) || 0)
    }, 0)
  })

  const total = computed(() => subtotal.value)

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const setItems = (newItems: CartItem[]) => {
    items.value = Array.isArray(newItems) ? newItems : []
  }

  const addItem = (item: CartItem) => {
    const existingItem = items.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += item.quantity
      existingItem.subtotal = existingItem.quantity * existingItem.product.price
    } else {
      items.value.push(item)
    }
  }

  const removeItem = (itemId: number) => {
    const index = items.value.findIndex(i => i.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  const updateItemQuantity = (itemId: number, quantity: number) => {
    const item = items.value.find(i => i.id === itemId)
    if (item) {
      item.quantity = quantity
      item.subtotal = quantity * item.product.price
    }
  }

  const clearCart = () => {
    items.value = []
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const setGuestMode = (isGuest: boolean) => {
    isGuestMode.value = isGuest
  }

  return {
    // State
    items,
    isLoading,
    error,
    isGuestMode,

    // Computed
    itemCount,
    totalItems,
    subtotal,
    total,
    isEmpty,

    // Actions
    setItems,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    setLoading,
    setError,
    setGuestMode
  }
})

