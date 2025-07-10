<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <UiStepper
      :steps="stepperSteps"
      :currentStep="2"
      :isEnabled="isStepEnabled"
      @step-click="handleStepClick"
    />
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full relative">
      <!-- Go Back Button -->
      <div class="w-full flex justify-start mb-2">
        <FormButton @click="goBack" type="button" class="flex items-center gap-2 px-4 py-2">
          <UiIconsArrow class="w-4 h-4 -ml-1" />
          Go Back
        </FormButton>
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
            :error="typeof errors[idx] === 'string' && errors[idx] ? errors[idx] : false"
            :loading="!!loadings[idx]"
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
        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4 pt-6 w-full">
          <UiButtonsTertiary @click="goBack" type="button" class="flex items-center gap-2 px-4 py-2 justify-center w-full">
            <UiIconsArrow class="w-4 h-4 -ml-1" />
            Go Back
          </UiButtonsTertiary>
          <FormButton
            @click="saveImagesAndContinue"
            :loading="isLoading"
            :disabled="isLoading || isUploading || imageSlots.every(slot => !slot.file && !slot.previewUrl)"
            class="px-8 w-1/2 justify-center"
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
import UiIconsArrow from '~/components/Ui/Icons/Arrow.vue'
import FormButton from '~/components/Form/Button.vue'
import UiStepper from '~/components/Ui/Stepper.vue'
import UiButtonsTertiary from '~/components/Ui/Buttons/Tertiary.vue'

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
const errors = ref({})
const uploadingIndex = ref(null)
const progresses = ref({})
const loadings = ref({})

const stepperSteps = [
  { label: 'Details', route: () => `/${route.params.username}/selling/products/${productSlug.value}/edit` },
  { label: 'Specifications', route: () => `/${route.params.username}/selling/products/${productSlug.value}/specifications` },
  { label: 'Images', route: () => `/${route.params.username}/selling/products/${productSlug.value}/images` },
  { label: 'Publish', route: () => `/${route.params.username}/selling/products/${productSlug.value}/publish` }
]

function isStepComplete(idx) {
  if (!product.value) return false;
  switch (idx) {
    case 0:
      // Details: name, description, price, category, location, subcategory
      return !!(product.value.name && product.value.description && product.value.price && product.value.category?.id && product.value.location?.id && product.value.subcategory?.id);
    case 1:
      // Specifications: attributes (assume attributes or specifications field or similar)
      return Array.isArray(product.value.attributes) ? product.value.attributes.length > 0 : false;
    case 2:
      // Images: images array
      return Array.isArray(product.value.images) ? product.value.images.length > 0 : false;
    case 3:
      // Publish: allow if all previous steps are complete
      return isStepComplete(0) && isStepComplete(1) && isStepComplete(2);
    default:
      return false;
  }
}

function isStepEnabled(idx) {
  // If product is active, allow all steps
  if (product.value?.status === 'active') return true;
  // Allow navigation to a step only if all previous steps are complete
  for (let i = 0; i < idx; i++) {
    if (!isStepComplete(i)) return false;
  }
  return true;
}

function handleStepClick(idx) {
  if (isStepEnabled(idx)) {
    const routeFn = stepperSteps[idx].route
    if (routeFn) router.push(routeFn())
  }
}

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
    errors.value[idx] = 'File is too large. Maximum size is 2MB.'
    return
  }
  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)) {
    errors.value[idx] = 'Invalid file type. Only JPEG, PNG, JPG, and GIF are allowed.'
    return
  }
  errors.value[idx] = '' // Clear error if valid
  // Show loading spinner for this slot
  loadings.value[idx] = true
  // Create preview URL
  const reader = new FileReader()
  reader.onload = e => {
    imageSlots.value[idx].file = file
    imageSlots.value[idx].previewUrl = e.target.result
    imageSlots.value[idx].id = null // Mark as new image
    loadings.value[idx] = false
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
    // Prevent submission if any slot has an error
    const hasSlotError = Object.values(errors.value).some(msg => typeof msg === 'string' && msg)
    if (hasSlotError) {
      toast.error('Please fix the image errors before continuing.')
      return
    }
    // Gather new files to upload
    const filesToUpload = imageSlots.value.filter(slot => slot.file).map(slot => slot.file)
    // Gather IDs of images to keep
    const keepImageIds = imageSlots.value.filter(slot => slot.id).map(slot => slot.id)
    // Gather IDs of images to delete
    const originalIds = originalImages.value.map(img => img.id)
    const toDeleteIds = originalIds.filter(id => !keepImageIds.includes(id))

    // Upload new images if any
    if (filesToUpload.length > 0) {
      uploadingIndex.value = 0
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        const idx = i
        const progress = ref(0)
        progresses.value[idx] = progress
        const reader = new FileReader()
        reader.onload = e => {
          imageSlots.value[idx].file = file
          imageSlots.value[idx].previewUrl = e.target.result
          imageSlots.value[idx].id = null // Mark as new image
          progress.value = 100
        }
        reader.readAsDataURL(file)
      }
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
    uploadingIndex.value = null
    progresses.value = {}
  }
}

// Go Back handler
function goBack() {
  router.back()
}
</script>