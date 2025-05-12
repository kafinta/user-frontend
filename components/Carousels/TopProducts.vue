<template>
  <Container>
    <div>
      <div class="flex items-center justify-between">
        <div>
          <UiTypographyH2>Trending Products</UiTypographyH2>
          <UiTypographyP>Our top selling products in the last month.</UiTypographyP>
        </div>
      </div>

      <!-- Splide Carousel -->
      <div v-if="professionals.length" class="mt-5">
        <Splide
          :options="splideOptions"
          :aria-label="'Trending Products carousel'"
        >
          <SplideSlide v-for="professional in professionals" :key="professional.id">
            <div class="carousel-item-wrapper">
              <ProductsCard
                :title="professional.title"
                :image="professional.backgroundImagePath"
                :urlPath="professional.urlPath"
              />
            </div>
          </SplideSlide>

          <!-- Custom arrows using slots -->
          <template #arrows="{ splide }">
            <div class="splide__arrows">
              <button
                class="splide__arrow splide__arrow--prev"
                @click="splide.go('<')"
              >
                <UiIconsArrow class="w-4 h-4 rotate-180" />
              </button>
              <button
                class="splide__arrow splide__arrow--next"
                @click="splide.go('>')"
              >
                <UiIconsArrow class="w-4 h-4" />
              </button>
            </div>
          </template>
        </Splide>
      </div>

      <div v-if="!professionals.length" class="mt-5">
        <UiTypographyP>No professionals found</UiTypographyP>
      </div>
    </div>
  </Container>
</template>

<script setup>
import { Splide, SplideSlide } from '@splidejs/vue-splide'
// Import Splide CSS
import '@splidejs/vue-splide/css'

// Define Splide options
const splideOptions = {
  type: 'loop',
  perPage: 3, // 3 slides on large screens
  perMove: 1,
  gap: '1rem',
  lazyLoad: 'nearby',
  arrows: true,
  pagination: false, // No pagination dots
  autoplay: false,
  focus: 0, // Focus on first slide
  fixedWidth: false, // Use percentage-based sizing for larger screens
  rewind: true, // Allow rewinding from last to first slide
  padding: { right: 0, left: 0 }, // No padding for larger screens (no peek)
  speed: 400, // Animation speed

  // IMPORTANT: In Splide, breakpoints define the max-width where settings apply
  // So 1024 means "apply these settings when width <= 1024px"
  breakpoints: {
    1280: { // For screens <= 1280px
      perPage: 3, // Still 3 slides but with explicit settings
      fixedWidth: false,
      focus: 0,
      padding: { right: 0, left: 0 },
    },
    1024: { // For screens <= 1024px (desktop)
      perPage: 2, // 2 slides on desktop (medium screens)
      fixedWidth: false, // Use percentage-based sizing
      focus: 0, // Focus on first slide
      padding: { right: 0, left: 0 }, // No padding (no peek)
    },
    768: { // For screens <= 768px (tablet)
      perPage: 1,
      fixedWidth: '70%', // 70% width on tablet as requested
      focus: 'center', // Center focus for even peek on both sides
      padding: { right: '15%', left: '15%' }, // Even padding on both sides for peek effect
    },
    640: { // For screens <= 640px (mobile)
      perPage: 1,
      fixedWidth: '90%', // 90% width on mobile as requested
      focus: 'center', // Center focus for even peek on both sides
      padding: { right: '5%', left: '5%' }, // Small padding for peek effect on mobile
    },
  },
}

// No skeleton loading needed for this component as we're not showing skeletons

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

<style scoped>
/* Splide styles */
.carousel-item-wrapper {
  padding: 0 8px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Custom Splide styles */
:deep(.splide__arrow) {
  background: black;
  width: 2.5rem;
  height: 2.5rem;
  opacity: .8;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  z-index: 10;
}

:deep(.splide__arrow:hover) {
  background: var(--primary-500, #C9B14F);
}

:deep(.splide__arrow svg) {
  fill: white;
  width: 1.2em;
  height: 1.2em;
}

/* Make sure the carousel takes full width */
:deep(.splide) {
  width: 100%;
  position: relative;
}

/* Position arrows inside the padding area */
:deep(.splide__arrows) {
  position: absolute;
  width: calc(100% - 2rem);
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

:deep(.splide__arrow) {
  position: relative;
  transform: none;
  top: auto;
  left: auto;
  right: auto;
  pointer-events: auto;
}

/* Remove negative margins that cause overflow */
:deep(.splide__list) {
  margin: 0 !important;
}
</style>