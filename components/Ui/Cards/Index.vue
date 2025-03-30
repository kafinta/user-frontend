<template>
  <button @click="$emit('clicked')" class="cursor-pointer group rounded-xl p-3 h-full bg-secondary w-full">
    <UiTypographyH3 color="white" class="text-left h-[2lh] mb-5">{{ title }}</UiTypographyH3>
      <NuxtImg v-if="imageLoaded"
        :src="image_path" 
        class="aspect-[4/3] w-full rounded-md" 
        :alt="alt"
        @error="imageLoaded = false"
        @load="imageLoaded = true"
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
const config = useRuntimeConfig();

const props = defineProps({
  image_path: {
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

const imageSrc = computed(() => {
  return props.image_path.replace('http://localhost/', config.public.base_url)
})
const imageLoaded = ref(null)
</script>