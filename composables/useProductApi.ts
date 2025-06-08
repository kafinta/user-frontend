// Types for API responses - using basic objects instead of interfaces

export function useProductApi() {
  const toast = useAppToast();

  return {
    // Step 1: Create/Update Basic Information
    createBasicInfo: async (productData) => {
      try {
        const response = await useCustomFetch('/api/products/basic-info', {
          method: 'POST',
          body: productData
        });

        // Don't show toast here - let the calling component handle user feedback
        return response;
      } catch (error) {
        // Don't show toast here - let the calling component handle errors
        // This prevents duplicate error messages
        throw error;
      }
    },

    updateBasicInfo: async (productId, productData) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}/basic-info`, {
          method: 'PUT',
          body: productData
        });

        // Don't show toast here - let the calling component handle user feedback
        return response;
      } catch (error) {
        // Don't show toast here - let the calling component handle errors
        throw error;
      }
    },

    // Step 2: Set/Update Product Attributes
    setAttributes: async (productId, attributeValues) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}/attributes`, {
          method: 'PUT',
          body: { attribute_values: attributeValues }
        });

        // Don't show toast here - let the calling component handle user feedback
        return response;
      } catch (error) {
        // Don't show toast here - let the calling component handle errors
        throw error;
      }
    },

    // Step 3: Upload Product Images
    uploadImages: async (productId, images) => {
      try {
        const formData = new FormData();
        images.forEach(image => {
          formData.append('images[]', image);
        });

        const response = await useCustomFetch(`/api/products/${productId}/images`, {
          method: 'POST',
          body: formData
        });

        // Don't show toast here - let the calling component handle user feedback
        return response;
      } catch (error) {
        // Don't show toast here - let the calling component handle errors
        throw error;
      }
    },

    // Step 4: Publish Product
    publishProduct: async (productId) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}/publish`, {
          method: 'POST'
        });

        if (response.status === 'success') {
          toast.success(response.message || 'Product published successfully');
        }

        return response;
      } catch (error) {
        const errorMessage = error.data?.message || 'Failed to publish product';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Product Status Management
    updateProductStatus: async (productId, status, reason) => {
      try {
        const body = { status };
        if (reason) {
          body.reason = reason;
        }

        const response = await useCustomFetch(`/api/products/${productId}/status`, {
          method: 'PATCH',
          body
        });

        if (response.status === 'success') {
          toast.success(response.message || 'Product status updated successfully');
        }

        return response;
      } catch (error) {
        const errorMessage = error.data?.message || 'Failed to update product status';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Delete Product Image
    deleteImage: async (imageId) => {
      try {
        const response = await useCustomFetch(`/api/images/${imageId}`, {
          method: 'DELETE'
        });

        if (response.status === 'success') {
          toast.success(response.message || 'Image deleted successfully');
        }

        return response;
      } catch (error) {
        const errorMessage = error.data?.message || 'Failed to delete image';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Get Seller's Products
    getMyProducts: async () => {
      try {
        const response = await useCustomFetch('/api/products', {
          method: 'GET'
        });

        return response;
      } catch (error) {
        const errorMessage = error.data?.message || 'Failed to fetch products';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Get Single Product
    getProduct: async (productId) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}`, {
          method: 'GET'
        });

        return response;
      } catch (error) {
        const errorMessage = error.data?.message || 'Failed to fetch product';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Delete Product
    deleteProduct: async (productId) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });

        if (response.status === 'success') {
          toast.success(response.message || 'Product deleted successfully');
        }

        return response;
      } catch (error) {
        const errorMessage = error.data?.message || 'Failed to delete product';
        toast.error(errorMessage);
        throw error;
      }
    }
  };
}
