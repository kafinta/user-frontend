// Types for API responses - using basic objects instead of interfaces

export function useProductApi() {
  const toast = useAppToast();

  return {
    // Step 1: Create/Update Basic Information
    createBasicInfo: async (productData: any) => {
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

    updateBasicInfo: async (productId: any, productData: any) => {
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
    setAttributes: async (productId: any, attributeValues: any) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}/attributes`, {
          method: 'POST',
          body: { attributes: attributeValues }
        });

        // Don't show toast here - let the calling component handle user feedback
        return response;
      } catch (error) {
        // Don't show toast here - let the calling component handle errors
        throw error;
      }
    },

    // Step 3: Upload Product Images
    uploadImages: async (productId: any, images: any) => {
      try {
        const formData = new FormData();
        images.forEach((image: any) => {
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
    publishProduct: async (productId: any) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}/publish`, {
          method: 'POST'
        });

        if ((response as any).status === 'success') {
          toast.success((response as any).message || 'Product published successfully');
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.data?.message || 'Failed to publish product';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Product Status Management
    updateProductStatus: async (productId: any, status: any, reason?: any) => {
      try {
        const body: any = { status };
        if (reason) {
          (body as any).reason = reason;
        }

        const response = await useCustomFetch(`/api/products/${productId}/status`, {
          method: 'PATCH',
          body
        });

        if ((response as any).status === 'success') {
          toast.success((response as any).message || 'Product status updated successfully');
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.data?.message || 'Failed to update product status';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Delete Product Image
    deleteImage: async (imageId: any) => {
      try {
        const response = await useCustomFetch(`/api/images/${imageId}`, {
          method: 'DELETE'
        });

        if ((response as any).status === 'success') {
          toast.success((response as any).message || 'Image deleted successfully');
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.data?.message || 'Failed to delete image';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Get Single Product
    getProduct: async (productId: any) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}`, {
          method: 'GET'
        });

        return response;
      } catch (error: any) {
        const errorMessage = error.data?.message || 'Failed to fetch product';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Delete Product
    deleteProduct: async (productId: any) => {
      try {
        const response = await useCustomFetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });

        if ((response as any).status === 'success') {
          toast.success((response as any).message || 'Product deleted successfully');
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.data?.message || 'Failed to delete product';
        toast.error(errorMessage);
        throw error;
      }
    },

    // Get Single Product by Slug
    getProductBySlug: async (slug: any) => {
      try {
        const response = await useCustomFetch(`/api/products/slug/${slug}`, {
          method: 'GET'
        });
        return response;
      } catch (error) {
        throw error;
      }
    },
  };
}