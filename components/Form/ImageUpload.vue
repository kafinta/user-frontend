<template>
  <div :class="['relative group w-full h-52 rounded-lg border-2 border-dashed border-accent-200 bg-accent-100 hover:bg-accent-200 duration-300 ease-in-out flex items-center justify-center overflow-hidden', { 'cursor-not-allowed': disabled, 'cursor-pointer': !disabled }]">
    <input
      type="file"
      :id="inputId"
      class="hidden"
      :accept="accept"
      @change="onFileChange"
      :disabled="disabled"
    >
    <label
      :for="inputId"
      class="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
      :class="disabled ? 'bg-accent-100 cursor-not-allowed' : 'hover:bg-accent-200 cursor-pointer'"
    >
      <template v-if="previewUrl">
        <img :src="previewUrl" alt="Preview" class="absolute inset-0 w-full h-full object-cover rounded-lg z-10" />
        <button v-if="!disabled" type="button" class="absolute top-2 right-2 bg-red-600 p-1 w-8 h-8 flex items-center justify-center text-white opacity-80 hover:opacity-100 z-20 border border-white shadow-sm" style="border-radius: 0.3rem;" @click.stop.prevent="onRemove">
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
</template>
<script setup>
import { ref } from 'vue'
import UiIconsCamera from '~/components/Ui/Icons/Camera.vue'
import UiIconsDelete from '~/components/Ui/Icons/Delete.vue'
import UiTypographyP from '~/components/Ui/Typography/P.vue'

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