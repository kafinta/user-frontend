<template>
  <LayoutsDashboard mode="seller" pageTitle="Edit Product Images">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full">
      <!-- Progress Steps -->
      <div class="flex items-center">
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-primary w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-primary w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Edit Product Images</UiTypographyH3>

      <!-- Loading State -->
      <div v-if="isLoadingProduct" class="flex justify-center py-8">
        <UiLoadingSpinner />
      </div>

      <!-- Success State -->
      <div v-else-if="showSuccess" class="text-center py-12">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UiIconsSuccess class="w-10 h-10 text-green-600" />
        </div>
        <UiTypographyH3 class="text-green-600 mb-2">Product Updated Successfully!</UiTypographyH3>
        <UiTypographyP class="text-secondary">Your product has been updated and is now live.</UiTypographyP>
      </div>

      <!-- Images Management -->
      <div v-else class="w-full">
        <!-- Current Images Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <!-- Existing Images -->
          <div 
            v-for="image in productImages" 
            :key="image.id" 
            class="relative aspect-square border border-accent-200 rounded-lg overflow-hidden group"
          >
            <img 
              :src="getImageUrl(image.url)" 
              :alt="product?.name || 'Product Image'" 
              class="w-full h-full object-cover"
            >
            <button
              @click="deleteImage(image)"
              :disabled="isDeletingImage"
              class="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              <UiIconsDelete class="w-4 h-4" />
            </button>
          </div>

          <!-- Upload New Image -->
          <div class="relative aspect-square border-2 border-dashed border-accent-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
            <input
              @change="uploadImage"
              type="file"
              id="productImageInput"
              class="hidden"
              accept="image/*"
              multiple
              :disabled="isUploading"
            >
            <label 
              for="productImageInput" 
              class="cursor-pointer text-center p-4"
              :class="{ 'pointer-events-none': isUploading }"
            >
              <div v-if="isUploading" class="flex flex-col items-center">
                <UiLoadingSpinner class="mb-2" />
                <UiTypographyP class="text-secondary">Uploading...</UiTypographyP>
              </div>
              <div v-else class="flex flex-col items-center">
                <div class="w-12 h-12 bg-accent-200 rounded-full flex items-center justify-center mb-2">
                  <UiIconsCamera class="w-6 h-6 text-secondary" />
                </div>
                <UiTypographyP class="text-secondary">Add Images</UiTypographyP>
                <UiTypographySmall class="text-secondary/70">Max 2MB each</UiTypographySmall>
              </div>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 pt-6">
          <UiButtonsSecondary
            @clicked="finishEditing"
            :disabled="isLoading"
          >
            Finish Editing
          </UiButtonsSecondary>

          <FormButton
            @click="updateAndPublish"
            :loading="isLoading"
            :disabled="isLoading"
            class="px-8"
          >
            Update & Publish
          </FormButton>
        </div>
      </div>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { useAppToast } from '~/utils/toastify'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true,
  requiresSeller: true
});

useHead({
  title: 'Edit Product Images | Kafinta',
  meta: [
    { name: 'description', content: 'Edit images for your product' }
  ]
});

const router = useRouter()
const route = useRoute()
const productApi = useProductApi()
const toast = useAppToast()

// Get product slug from route params
const productSlug = computed(() => route.params.slug)

// State
const product = ref(null)
const isLoadingProduct = ref(true)
const isLoading = ref(false)
const isUploading = ref(false)
const isDeletingImage = ref(false)
const showSuccess = ref(false)

// Computed properties
const productImages = computed(() => {
  return product.value?.images || []
})

// Helper functions
const getImageUrl = (url) => {
  // Handle relative URLs from backend
  if (url.startsWith('/')) {
    if (process.client) {
      return `${window.location.origin}${url}`
    }
    // For SSR, return the relative URL as-is
    return url
  }
  return url
}

// Load existing product data
const loadProduct = async () => {
  try {
    // First try to find product by slug in the seller's products
    const myProductsResponse = await productApi.getMyProducts()
    
    if (myProductsResponse.status === 'success' && myProductsResponse.data?.data) {
      const foundProduct = myProductsResponse.data.data.find(p => 
        p.slug === productSlug.value
      )

      if (!foundProduct) {
        toast.error('Product not found')
        router.push({ name: 'username-selling-products' })
        return
      }

      // Get full product details
      const response = await productApi.getProduct(foundProduct.id)

      if (response.status === 'success' && response.data?.product) {
        product.value = response.data.product
      }
    }
  } catch (error) {
    console.error('Error loading product:', error)
    toast.error('Failed to load product data')
    router.push({ name: 'username-selling-products' })
  }
}

const uploadImage = async (event) => {
  const target = event.target
  const files = target.files

  if (!files || files.length === 0) return

  try {
    isUploading.value = true

    // Convert FileList to Array
    const imageFiles = Array.from(files)

    // Validate file sizes (2MB max each)
    const maxSize = 2 * 1024 * 1024 // 2MB
    const oversizedFiles = imageFiles.filter(file => file.size > maxSize)

    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large. Maximum size is 2MB per file.`)
      return
    }

    const response = await productApi.uploadImages(product.value.id, imageFiles)

    if (response.status === 'success' && response.data?.product) {
      // Update product with new images
      product.value = response.data.product

      // Clear the input
      target.value = ''
    }
  } catch (error) {
    console.error('Error uploading images:', error)
  } finally {
    isUploading.value = false
  }
}

const deleteImage = async (image) => {
  try {
    isDeletingImage.value = true

    const response = await productApi.deleteImage(image.id)

    if (response.status === 'success') {
      // Remove image from product
      if (product.value?.images) {
        product.value.images = product.value.images.filter(img => img.id !== image.id)
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  } finally {
    isDeletingImage.value = false
  }
}

const finishEditing = () => {
  // Navigate back to products list
  router.push({ name: 'username-selling-products' })
}

const updateAndPublish = async () => {
  try {
    isLoading.value = true

    // Update product status to active if it's not already
    if (product.value.status !== 'active') {
      const response = await productApi.publishProduct(product.value.id)

      if (response.status === 'success') {
        // Show success state briefly before redirecting
        showSuccessState()
      }
    } else {
      // Product is already active, just show success
      showSuccessState()
    }
  } catch (error) {
    console.error('Error updating product:', error)
  } finally {
    isLoading.value = false
  }
}

const showSuccessState = () => {
  // Show success state similar to creation flow
  showSuccess.value = true

  // Navigate to products list after a brief delay
  setTimeout(() => {
    router.push({ name: 'username-selling-products' })
  }, 2000)
}

// Initialize data on mount
onMounted(async () => {
  await loadProduct()
  isLoadingProduct.value = false
})
</script>
