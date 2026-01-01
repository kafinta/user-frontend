import { useCustomFetch } from './useCustomFetch'
import { useCartStore } from '~/stores/cart'
import { useAppToast } from '~/utils/toastify'
import { useAuthStore } from '~/stores/auth'
import { useGuestCart } from './useGuestCart'

export const useCartApi = () => {
  const cartStore = useCartStore()
  const toast = useAppToast()
  const authStore = useAuthStore()
  const guestCart = useGuestCart()

  /**
   * Fetch the current cart
   */
  async function fetchCart(): Promise<any> {
    try {
      cartStore.setLoading(true)
      cartStore.setError(null)

      const response = await useCustomFetch('/api/cart', {
        method: 'GET'
      })

      if (response && response.status === 'success') {
        const cartData = response.data
        if (cartData && cartData.items) {
          cartStore.setItems(cartData.items)
        }
        return response
      } else {
        const errorMessage = response?.message || 'Failed to fetch cart'
        cartStore.setError(errorMessage)
        return response
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to fetch cart'
      cartStore.setError(errorMessage)
      console.error('Error fetching cart:', error)
      throw error
    } finally {
      cartStore.setLoading(false)
    }
  }

  /**
   * Add a product to cart
   * @param productId - The product ID to add
   * @param quantity - Quantity to add (default: 1)
   * @param variantId - Optional variant ID
   */
  async function addToCart(productId: number, quantity: number = 1, variantId?: number, product?: any): Promise<any> {
    try {
      cartStore.setLoading(true)
      cartStore.setError(null)

      // For guests, add to guest cart (localStorage)
      if (!authStore.isAuthenticated) {
        if (!product) {
          const errorMessage = 'Product data is required for guest cart'
          cartStore.setError(errorMessage)
          toast.error(errorMessage)
          throw new Error(errorMessage)
        }
        guestCart.addItem(product, quantity)
        cartStore.setGuestMode(true)
        cartStore.setItems(guestCart.items.value)
        toast.success('Product added to cart')
        return { status: 'success', message: 'Product added to cart' }
      }

      // For authenticated users, add to server cart
      const payload: any = {
        product_id: productId,
        quantity
      }

      if (variantId) {
        payload.variant_id = variantId
      }

      const response = await useCustomFetch('/api/cart/items', {
        method: 'POST',
        body: payload
      })

      if (response && response.status === 'success') {
        // Refresh cart to get updated items
        await fetchCart()
        toast.success('Product added to cart')
        return response
      } else {
        const errorMessage = response?.message || 'Failed to add product to cart'
        cartStore.setError(errorMessage)
        toast.error(errorMessage)
        return response
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to add product to cart'
      cartStore.setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      cartStore.setLoading(false)
    }
  }

  /**
   * Update cart item quantity
   * @param itemId - The cart item ID
   * @param quantity - New quantity
   */
  async function updateCartItem(itemId: number, quantity: number): Promise<any> {
    try {
      cartStore.setLoading(true)
      cartStore.setError(null)

      // For guests, update guest cart (localStorage)
      if (!authStore.isAuthenticated) {
        // Find the item by ID in guest cart
        const item = guestCart.items.value.find(i => i.id === itemId)
        if (item) {
          guestCart.updateQuantity(item.product_id, quantity)
          cartStore.setItems(guestCart.items.value)
          return { status: 'success', message: 'Item updated' }
        } else {
          const errorMessage = 'Item not found in cart'
          cartStore.setError(errorMessage)
          toast.error(errorMessage)
          return { status: 'error', message: errorMessage }
        }
      }

      // For authenticated users, update server cart
      const response = await useCustomFetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        body: { quantity }
      })

      if (response && response.status === 'success') {
        // Update local store
        cartStore.updateItemQuantity(itemId, quantity)
        return response
      } else {
        const errorMessage = response?.message || 'Failed to update cart item'
        cartStore.setError(errorMessage)
        toast.error(errorMessage)
        return response
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update cart item'
      cartStore.setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error updating cart item:', error)
      throw error
    } finally {
      cartStore.setLoading(false)
    }
  }

  /**
   * Remove item from cart
   * @param itemId - The cart item ID to remove
   */
  async function removeFromCart(itemId: number): Promise<any> {
    try {
      cartStore.setLoading(true)
      cartStore.setError(null)

      // For guests, remove from guest cart (localStorage)
      if (!authStore.isAuthenticated) {
        // Find the item by ID in guest cart
        const item = guestCart.items.value.find(i => i.id === itemId)
        if (item) {
          guestCart.removeItem(item.product_id)
          cartStore.setItems(guestCart.items.value)
          toast.success('Item removed from cart')
          return { status: 'success', message: 'Item removed' }
        } else {
          const errorMessage = 'Item not found in cart'
          cartStore.setError(errorMessage)
          toast.error(errorMessage)
          return { status: 'error', message: errorMessage }
        }
      }

      // For authenticated users, remove from server cart
      const response = await useCustomFetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE'
      })

      if (response && response.status === 'success') {
        // Update local store
        cartStore.removeItem(itemId)
        toast.success('Item removed from cart')
        return response
      } else {
        const errorMessage = response?.message || 'Failed to remove item from cart'
        cartStore.setError(errorMessage)
        toast.error(errorMessage)
        return response
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to remove item from cart'
      cartStore.setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error removing from cart:', error)
      throw error
    } finally {
      cartStore.setLoading(false)
    }
  }

  /**
   * Clear the entire cart
   */
  async function clearCart(): Promise<any> {
    try {
      cartStore.setLoading(true)
      cartStore.setError(null)

      const response = await useCustomFetch('/api/cart/clear', {
        method: 'DELETE'
      })

      if (response && response.status === 'success') {
        // Clear local store
        cartStore.clearCart()
        toast.success('Cart cleared')
        return response
      } else {
        const errorMessage = response?.message || 'Failed to clear cart'
        cartStore.setError(errorMessage)
        toast.error(errorMessage)
        return response
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to clear cart'
      cartStore.setError(errorMessage)
      toast.error(errorMessage)
      console.error('Error clearing cart:', error)
      throw error
    } finally {
      cartStore.setLoading(false)
    }
  }

  /**
   * Transfer guest cart items to authenticated user's cart
   * @param guestItems - Array of guest cart items to transfer
   */
  async function transferGuestCart(guestItems: any[]): Promise<any> {
    if (!guestItems || guestItems.length === 0) {
      return { status: 'success', message: 'No items to transfer' }
    }

    try {
      cartStore.setLoading(true)
      cartStore.setError(null)

      // Transfer each item to the authenticated cart
      for (const item of guestItems) {
        await addToCart(item.product_id, item.quantity)
      }

      return { status: 'success', message: 'Cart items transferred successfully' }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to transfer cart items'
      cartStore.setError(errorMessage)
      console.error('Error transferring guest cart:', error)
      throw error
    } finally {
      cartStore.setLoading(false)
    }
  }

  return {
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    transferGuestCart
  }
}

