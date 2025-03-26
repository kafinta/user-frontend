<template>
  <button @click="$emit('clicked')" class="cursor-pointer group rounded-xl border border-accent-300 p-3 h-full bg-secondary">
    <UiTypographyH3 color="white" class="text-left h-[2lh] mb-5">{{ title }}</UiTypographyH3>
    <NuxtImg 
      :src="imageSrc" 
      class="aspect-[4/3] w-full rounded-md" 
      :alt="alt" 
    />
  </button>
</template>

<script setup>
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

onMounted(()=> {
  console.log('base url' + config.public.base_url);
  
})
</script>