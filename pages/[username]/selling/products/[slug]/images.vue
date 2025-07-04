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
      <div v-if="isInitialLoad" class="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 w-full">
        <UiSkeleton height="15rem" v-for="i in 4" :key="i" class="rounded-md" />
      </div>
      <div v-else-if="!product" class="text-center py-12 flex flex-col items-center justify-center">
        <div class="rounded-full p-4 flex items-center justify-center mb-4 bg-red-200 w-20 h-20">
          <UiIconsError class="w-16 h-16 text-red-600" />
        </div>
        <UiTypographyP class="text-red-600 mb-2">Product not found.</UiTypographyP>
        <UiButtonsPrimary :url="{ name: 'username-selling-products', params: { username: route.params.username } }" class="mt-2">
          Go to My Products
        </UiButtonsPrimary>
      </div>
      <div v-else class="w-full space-y-6">
        <!-- Image Slots Grid -->
        <div class="grid grid-cols-2 gap-6 w-full">
          <ImageUpload
            v-for="(slot, idx) in imageSlots"
            :key="slot.key"
            :previewUrl="getSlotPreviewUrl(slot)"
            :disabled="isUploading"
            :inputId="'image-slot-input-' + slot.key"
            @file-selected="file => handleSlotFileChangeDirect(file, idx)"
            @remove="() => removeSlotImage(idx)"
          />
          <!-- Add Slot: Only show if not at max images -->
          <div v-if="imageSlots.length < maxImages" class="relative group w-full h-52 rounded-lg border-2 border-dashed border-accent-200 bg-accent-100 hover:bg-accent-200 duration-300 ease-in-out flex items-center justify-center overflow-hidden cursor-pointer" @click="addImageSlot">
            <div class="flex flex-col items-center justify-center w-full h-full z-0">
              <div class="w-16 h-16 rounded-full bg-accent-200 flex items-center justify-center mb-2">
                <svg class="w-10 h-10 text-accent-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              </div>
              <UiTypographyP class="text-accent-400">Add Image Slot</UiTypographyP>
            </div>
          </div>
        </div>
        <!-- Action Button -->
        <div class="flex justify-center pt-6">
          <FormButton
            @click="saveImagesAndContinue"
            :loading="isLoading"
            :disabled="isLoading || isUploading || imageSlots.every(slot => !slot.file && !slot.previewUrl)"
            class="px-8"
          >
            Save & Continue
          </FormButton>
        </div>
      </div>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { useAppToast } from '~/utils/toastify'
import ImageUpload from '~/components/Form/ImageUpload.vue'

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

const productSlug = computed(() => route.params.slug)
const product = ref(null)
const isLoadingProduct = ref(true)
const isInitialLoad = ref(true)
const isLoading = ref(false)
const isUploading = ref(false)
const isDeletingImage = ref(false)
const hasUploadedImages = ref(false)
const originalImages = ref([])

const maxImages = 10
const initialSlots = 3
const imageSlots = ref([])

// Helper to create a slot object
function createSlot(file = null, previewUrl = '', key = null) {
  return {
    file, // File object (if new upload)
    previewUrl, // Data URL or existing image URL
    key: key || Math.random().toString(36).substr(2, 9),
    // Optionally, you can add an id for existing images
    id: null,
    // If the slot is for an existing image, store its id
  }
}

// Load product data on mount
onMounted(async () => {
  isInitialLoad.value = true
  try {
    const response = await productApi.getProductBySlug(productSlug.value)
    if (response.status === 'success' && response.data) {
      product.value = response.data
      originalImages.value = Array.isArray(product.value.images) ? [...product.value.images] : []
      const slots = []
      const existingImages = product.value.images || []
      if (existingImages.length > 0) {
        for (let i = 0; i < Math.max(initialSlots, existingImages.length); i++) {
          if (existingImages[i]) {
            slots.push(createSlot(null, getImageUrl(existingImages[i].path), existingImages[i].id))
            slots[slots.length - 1].id = existingImages[i].id
          } else {
            slots.push(createSlot())
          }
        }
      } else {
        for (let i = 0; i < initialSlots; i++) {
          slots.push(createSlot())
        }
      }
      imageSlots.value = slots
    } else {
      router.push({ name: 'username-selling-products-new' })
    }
  } catch (error) {
    console.error('Error loading product:', error)
    router.push({ name: 'username-selling-products-new' })
  } finally {
    isLoadingProduct.value = false
    isInitialLoad.value = false
  }
})

// Add more image slots
function addImageSlot() {
  if (imageSlots.value.length < maxImages) {
    imageSlots.value.push(createSlot())
  }
}

// Add a direct handler for the new component
function handleSlotFileChangeDirect(file, idx) {
  if (!file) return
  // Validate file size
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    toast.error('File is too large. Maximum size is 2MB.')
    return
  }
  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
    toast.error('Invalid file type.')
    return
  }
  // Create preview URL
  const reader = new FileReader()
  reader.onload = e => {
    imageSlots.value[idx].file = file
    imageSlots.value[idx].previewUrl = e.target.result
    imageSlots.value[idx].id = null // Mark as new image
  }
  reader.readAsDataURL(file)
}

// Remove image from a slot
function removeSlotImage(idx) {
  const slot = imageSlots.value[idx]
  // If the slot has an id, it's an existing backend image
  if (slot.id) {
    isDeletingImage.value = true
    productApi.deleteImage(slot.id)
      .then(response => {
        if (response.status === 'success') {
          // Remove from product images
          if (product.value?.images) {
            product.value.images = product.value.images.filter(img => img.id !== slot.id)
          }
          // Remove the slot
          imageSlots.value.splice(idx, 1)
        } else {
          toast.error('Failed to delete image.')
        }
        // Ensure at least three slots
        while (imageSlots.value.length < initialSlots) {
          imageSlots.value.push(createSlot())
        }
      })
      .catch(() => {
        toast.error('Failed to delete image.')
      })
      .finally(() => {
        isDeletingImage.value = false
      })
  } else {
    // Just remove the slot locally for new images
    imageSlots.value.splice(idx, 1)
    // Ensure at least three slots
    while (imageSlots.value.length < initialSlots) {
      imageSlots.value.push(createSlot())
    }
  }
}

// Helper to get image URL
function getImageUrl(path) {
  if (path.startsWith('/')) {
    if (process.client) {
      return `${window.location.origin}${path}`
    }
    return path
  }
  return path
}

// Helper to get slot preview URL (handles both new uploads and existing images)
function getSlotPreviewUrl(slot) {
  if (slot.previewUrl) return slot.previewUrl
  if (slot.id && product.value?.images) {
    const img = product.value.images.find(i => i.id === slot.id)
    if (img) return getImageUrl(img.path)
  }
  return ''
}

// Save images and redirect to publish step (do not publish here)
const saveImagesAndContinue = async () => {
  try {
    isLoading.value = true
    // Gather new files to upload
    const filesToUpload = imageSlots.value.filter(slot => slot.file).map(slot => slot.file)
    // Gather IDs of images to keep
    const keepImageIds = imageSlots.value.filter(slot => slot.id).map(slot => slot.id)
    // Gather IDs of images to delete
    const originalIds = originalImages.value.map(img => img.id)
    const toDeleteIds = originalIds.filter(id => !keepImageIds.includes(id))

    // Upload new images if any
    if (filesToUpload.length > 0) {
      const response = await productApi.uploadImages(product.value.id, filesToUpload)
      if (response.status === 'success' && response.data) {
        product.value = response.data.product || response.data
      }
    }
    // Redirect to publish step (do not publish here)
    router.push({
      path: `/${route.params.username}/selling/products/${productSlug.value}/publish`
    })
  } catch (error) {
    console.error('Error saving images:', error)
  } finally {
    isLoading.value = false
  }
}
</script>