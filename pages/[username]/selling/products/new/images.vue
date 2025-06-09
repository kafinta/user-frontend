<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full relative">
      <!-- Progress Steps -->
      <div class="flex items-center">
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Product Images</UiTypographyH3>

      <!-- Loading State -->
      <div v-if="isLoadingProduct" class="flex justify-center items-center py-12">
        <UiIconsLoading class="w-8 h-8" />
        <span class="ml-2 text-secondary">Loading product details...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="!product" class="text-center py-12">
        <UiTypographyP class="text-red-600">Product not found. Please start from step 1.</UiTypographyP>
        <UiButtonsPrimary :url="{ name: 'username-selling-products-new' }" class="mt-4">
          Go to Step 1
        </UiButtonsPrimary>
      </div>

      <!-- Success State -->
      <div v-else-if="showSuccess" class="text-center py-12">
        <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
          <UiIconsSuccess class="w-16 h-16 text-green-600" />
        </div>

        <div class="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <UiTypographyH3 class="text-green-700">Product Published Successfully!</UiTypographyH3>
          <UiTypographyP class="text-green-600 mt-2">Your product is now live and available for customers to purchase.</UiTypographyP>
        </div>

        <UiTypographyP class="text-accent-500">Redirecting to your products...</UiTypographyP>
      </div>

      <!-- Main Content -->
      <div v-else class="w-full space-y-6">
        <!-- Images Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <!-- Existing Images -->
          <div
            v-for="image in productImages"
            :key="image.id"
            class="relative product w-full border border-accent-200 rounded-md group"
          >
            <img
              :src="getImageUrl(image.url)"
              alt="Product Image"
              class="product object-cover rounded-md w-full h-full"
            >
            <button
              @click="deleteImage(image)"
              :disabled="isDeletingImage"
              class="bg-red-600 p-2 rounded-md text-white absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
            >
              <UiIconsDelete class="w-4 h-4" />
            </button>
          </div>

          <!-- Upload New Image -->
          <div class="w-full product relative flex items-center justify-center border-2 border-dashed border-accent-200 rounded-md">
            <input
              @change="uploadImage($event)"
              type="file"
              id="productImageInput"
              class="hidden"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              multiple
              :disabled="isUploading"
            >
            <label
              for="productImageInput"
              :class="[
                'product w-full rounded-md grid place-items-center cursor-pointer',
                isUploading ? 'bg-accent-100 cursor-not-allowed' : 'bg-accent-50 hover:bg-accent-100'
              ]"
            >
              <div class="text-center p-8">
                <div v-if="isUploading" class="flex flex-col items-center">
                  <UiIconsLoading class="w-8 h-8 mb-4" />
                  <UiTypographyP>Uploading images...</UiTypographyP>
                </div>
                <div v-else>
                  <div class="w-16 h-16 rounded-full bg-accent-200 flex items-center justify-center mx-auto mb-4">
                    <div class="w-1 h-6 bg-white"></div>
                    <div class="w-1 h-6 bg-white rotate-90 absolute"></div>
                  </div>
                  <UiTypographyP>Click to add images</UiTypographyP>
                  <p class="text-xs text-accent-400 mt-2">JPEG, PNG, JPG, GIF (max 2MB each)</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 pt-6">
          <UiButtonsSecondary
            @clicked="skipImages"
            :disabled="isLoading"
          >
            Skip Images
          </UiButtonsSecondary>

          <FormButton
            @click="publishProduct"
            :loading="isLoading"
            :disabled="isLoading || (productImages.length === 0 && !hasUploadedImages)"
            class="px-8"
          >
            Publish Product
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
  title: 'Product Images | Kafinta',
  meta: [
    { name: 'description', content: 'Upload images for your product' }
  ]
});

const router = useRouter()
const route = useRoute()
const productApi = useProductApi()
const toast = useAppToast()

// Get product ID from query params
const productId = computed(() => {
  const id = route.query.productId
  return id ? parseInt(id) : null
})

// State
const product = ref(null)
const isLoadingProduct = ref(true)
const isLoading = ref(false)
const isUploading = ref(false)
const isDeletingImage = ref(false)
const hasUploadedImages = ref(false)
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

    const response = await productApi.uploadImages(productId.value, imageFiles)

    if (response.status === 'success' && response.data?.product) {
      // Update product with new images
      product.value = response.data.product
      hasUploadedImages.value = true

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

const skipImages = () => {
  publishProduct()
}

const publishProduct = async () => {
  try {
    isLoading.value = true

    const response = await productApi.publishProduct(productId.value)

    if (response.status === 'success') {
      // Show success state briefly before redirecting
      showSuccessState()
    }
  } catch (error) {
    console.error('Error publishing product:', error)
  } finally {
    isLoading.value = false
  }
}

const showSuccessState = () => {
  // Show success state similar to onboarding
  showSuccess.value = true

  // Navigate to products list after a brief delay
  setTimeout(() => {
    router.push({ name: 'username-selling-products' })
  }, 2000)
}

// Load product data on mount
onMounted(async () => {
  if (!productId.value) {
    // Redirect to step 1 if no product ID
    router.push({ name: 'username-selling-products-new' })
    return
  }

  try {
    const response = await productApi.getProduct(productId.value)

    if (response.status === 'success' && response.data?.product) {
      product.value = response.data.product
    } else {
      // Product not found, redirect to step 1
      router.push({ name: 'username-selling-products-new' })
    }
  } catch (error) {
    console.error('Error loading product:', error)
    // Redirect to step 1 on error
    router.push({ name: 'username-selling-products-new' })
  } finally {
    isLoadingProduct.value = false
  }
})
</script>