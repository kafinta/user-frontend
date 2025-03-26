<template>
  <div v-if="loading" class="flex space-x-4 w-full mt-5">
    <Skeleton
      v-for="n in numVisibleItems" 
      :key="n" 
      class="mr-4"
      height="15rem"
    ></Skeleton>
  </div>

  <Carousel 
    v-else 
    :value="locations" 
    :numVisible="numVisibleItems" 
    :numScroll="1" 
    :responsiveOptions="responsiveOptions" 
    :showIndicators="false"
    circular
    containerClass="mt-5"

  >
    <template #item="slotProps" >
      <div class="mx-2">
        <UiCards
          :title="slotProps.data.name" 
          :image_path="slotProps.data.image_path" 
          :alt="slotProps.data.name"
        />
      </div>
    </template>
  </Carousel>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const loading = ref(true)
const locations = ref([])

const responsiveOptions = [
  {
    breakpoint: '1280px',
    numVisible: 5,
    numScroll: 1
  },
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '640px',
    numVisible: 1,
    numScroll: 1
  }
];

const numVisibleItems = computed(() => {
  // Use reactive width from useWindowSize
  const currentWidth = width.value

  // Find the appropriate responsive option
  const option = [...responsiveOptions].reverse().find(opt => 
    currentWidth <= parseInt(opt.breakpoint.replace('px', ''))
  )

  // Default to first option if no match
  return option ? option.numVisible : responsiveOptions[0].numVisible
})

const getLocations = async () => {
  loading.value = true;
  try {
    const response = await useCustomFetch('api/locations/', {
      method: 'GET',
      requireAuth: false,
    })
    locations.value = response.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  } finally {
    loading.value = false
  }
};

onMounted(() => {
  getLocations();
})
</script>