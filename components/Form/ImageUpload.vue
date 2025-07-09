<template>
  <div>
    <div :class="['relative group w-full h-52 rounded-lg border-2 border-dashed', error ? 'border-red-600' : 'border-accent-200', 'bg-accent-100 hover:bg-accent-200 duration-300 ease-in-out flex items-center justify-center overflow-hidden', { 'cursor-not-allowed': disabled || loading, 'cursor-pointer': !disabled && !loading }]">
      <!-- Loading overlay -->
      <div v-if="progress > 0 && progress < 100" class="absolute inset-0 bg-white bg-opacity-70 z-30 flex items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="w-10 h-10" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" stroke-width="4" />
            <circle cx="18" cy="18" r="16" fill="none" :stroke="'#C9B14F'" stroke-width="4" :stroke-dasharray="100" :stroke-dashoffset="100 - progress" stroke-linecap="round" />
          </svg>
          <span class="text-primary font-bold mt-2">{{ Math.round(progress) }}%</span>
        </div>
      </div>
      <input
        type="file"
        :id="inputId"
        class="hidden"
        :accept="accept"
        @change="onFileChange"
        :disabled="disabled || loading"
      >
      <label
        :for="inputId"
        class="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
        :class="(disabled || loading) ? 'bg-accent-100 cursor-not-allowed' : 'hover:bg-accent-200 cursor-pointer'"
      >
        <template v-if="previewUrl">
          <img :src="previewUrl" alt="Preview" class="absolute inset-0 w-full h-full object-cover rounded-lg z-10" />
          <button v-if="!disabled && !loading" type="button" class="absolute top-2 right-2 bg-red-600 p-1 w-8 h-8 flex items-center justify-center text-white opacity-80 hover:opacity-100 z-20 border border-white shadow-sm" style="border-radius: 0.3rem;" @click.stop.prevent="onRemove">
            <UiIconsDelete class="w-4 h-4" />
          </button>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center w-full h-full z-0">
            <UiIconsCamera class="w-16 h-16 mb-2 opacity-70 text-white" />
            <UiTypographyP class="text-accent-400">Click to add image</UiTypographyP>
            <p class="text-xs text-accent-400 mt-1">JPEG, PNG, JPG, GIF (max 2MB)</p>
          </div>
        </template>
      </label>
    </div>
    <p v-if="typeof error === 'string' && error" class="text-red-600 text-xs mt-2">{{ error }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import UiIconsCamera from '~/components/Ui/Icons/Camera.vue'
import UiIconsDelete from '~/components/Ui/Icons/Delete.vue'
import UiTypographyP from '~/components/Ui/Typography/P.vue'
import UiIconsLoading from '~/components/Ui/Icons/Loading.vue'

const props = defineProps({
  previewUrl: String,
  disabled: Boolean,
  accept: {
    type: String,
    default: 'image/jpeg,image/png,image/jpg,image/gif'
  },
  inputId: {
    type: String,
    default: () => `image-upload-slot-${Math.random().toString(36).substr(2, 9)}`
  },
  error: {
    type: [Boolean, String],
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['file-selected', 'remove'])

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    emit('file-selected', file)
  }
}

function onRemove() {
  emit('remove')
}
</script> 