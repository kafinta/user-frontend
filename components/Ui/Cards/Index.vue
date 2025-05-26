<template>
  <button @click="$emit('clicked')" class="cursor-pointer group rounded-xl p-3 h-full bg-secondary w-full">
    <UiTypographyH3 color="white" class="text-left h-[2lh] mb-5">{{ title }}</UiTypographyH3>
      <img v-if="imageLoaded !== false"
        :src="src"
        class="aspect-[4/3] w-full rounded-md object-cover"
        :alt="alt"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    <div
      v-else
      class="aspect-[4/3] w-full rounded-md bg-gray-300 flex items-center justify-center"
    >
      <span class="text-gray-600">{{ alt || 'Image not available' }}</span>
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue'

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