<template>
  <button @click="$emit('clicked')" class="cursor-pointer group rounded-xl p-3 h-full bg-secondary w-full">
    <UiTypographyH3 color="white" class="text-left h-[2lh] mb-5">{{ title }}</UiTypographyH3>
    <template v-if="src && imageLoaded !== false">
      <img
        :src="src"
        class="aspect-[4/3] w-full rounded-md object-cover"
        :alt="alt"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </template>
    <div
      v-else
      class="aspect-[4/3] w-full rounded-md bg-gray-300 flex flex-col items-center justify-center gap-2 text-center"
    >
      <UiIconsCamera class="w-10 h-10 text-gray-500" />
      <span class="text-gray-600">{{ alt || 'Image not available' }}</span>
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import UiIconsCamera from '~/components/Ui/Icons/Camera.vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  }
})

const imageLoaded = ref(null)

const handleImageError = () => {
  imageLoaded.value = false
}

const handleImageLoad = () => {
  imageLoaded.value = true
}
</script>