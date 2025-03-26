<template>
  <Container>
    <div>
      <div class="flex items-center justify-between">
        <div>
          <UiTypographyH2>Trending Products</UiTypographyH2>
          <UiTypographyP>Our top selling products in the last month.</UiTypographyP>
        </div>
      </div>

      <Carousel 
        v-if="professionals.length"
        :value="professionals" 
        :numVisible="numVisibleItems" 
        :numScroll="1" 
        :responsiveOptions="responsiveOptions" 
        :showIndicators="false"
        circular
        containerClass="mt-5"
      >
        <template #item="slotProps">
          <div class="mx-2 list-none">
            <ProductsCard class=""
              :title="slotProps.data.title" 
              :image="slotProps.data.backgroundImagePath" 
              :urlPath="slotProps.data.urlPath" 
            />
          </div>
        </template>
      </Carousel>
      <div v-else class="mt-5">
        <UiTypographyP>No professionals found</UiTypographyP>
      </div>
    </div>
  </Container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const responsiveOptions = [
  {
    breakpoint: '1280px',
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: '1024px',
    numVisible: 2,
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
  const currentWidth = width.value
  
  for (let i = responsiveOptions.length - 1; i >= 0; i--) {
    if (currentWidth <= parseInt(responsiveOptions[i].breakpoint)) {
      return responsiveOptions[i].numVisible
    }
  }
  
  return responsiveOptions[0].numVisible
})

const professionals = [
  {
      id: 1,
      title: 'Architects and Building Designers',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243546/kafinta/professionals/architecture_pfqxd1.jpg',
      urlPath: 'architects'
  },
  {
      id: 2,
      title: 'General Contractors',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243547/kafinta/professionals/contractors_lh7l0e.jpg',
      urlPath: 'contractors'
  },
  {
      id: 3,
      title: 'Interior Designers & Decorators',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674493506/kafinta/professionals/interior_design_pqrjoi.jpg',
      urlPath: 'interior'
  },
  {
      id: 4,
      title: 'Landscape Contractors',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243718/kafinta/professionals/landscape_hu1kew.jpg',
      urlPath: 'landscape'
  },
  {
      id: 5,
      title: 'Stone, Paver & Concrete',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674494156/kafinta/professionals/concrete_2_m4mxvu.jpg',
      urlPath: 'concrete'
  },
  {
      id: 6,
      title: 'Swimming Pool Builders',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243925/kafinta/professionals/swimming_pool_kzttut.jpg',
      urlPath: 'pool'
  },
  {
      id: 7,
      title: 'Home Remodeling',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674244002/kafinta/professionals/remodeling_fizg3u.jpg',
      urlPath: 'remodeling'
  },
  {
      id: 8,
      title: 'Accessory Dwelling Units',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674244070/kafinta/professionals/dwelling_units_b7fsmx.jpg',
      urlPath: 'dwelling'
  },
];
</script>