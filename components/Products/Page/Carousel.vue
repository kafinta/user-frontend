<template>
  <div class="w-full">
    <template v-if="isLoading">
      <UiSkeleton class="w-full mb-4 rounded-xl" height="25rem" />
      <div class="flex gap-2 mt-3 justify-center">
        <UiSkeleton v-for="i in 4" :key="i" class="rounded-md" height="4rem" width="5rem" />
      </div>
    </template>
    <template v-else>
      <Splide
        ref="mainSplide"
        :options="carouselOptions"
        aria-label="Product images carousel"
        class="mb-3"
        @moved="onMainMoved"
      >
        <SplideSlide v-for="(img, idx) in images" :key="img.id || idx">
          <img :src="img.path || img.url || img" :alt="`Product image ${idx + 1}`" class="rounded-xl border border-accent-200 w-full object-cover aspect-[4/3]" />
        </SplideSlide>
        <template #arrows="{ splide }">
          <div class="splide__arrows">
            <button class="splide__arrow splide__arrow--prev" @click="splide.go('<')">
              <UiIconsChevron class="w-7 h-7 -rotate-90 text-white" />
            </button>
            <button class="splide__arrow splide__arrow--next" @click="splide.go('>')">
              <UiIconsChevron class="w-7 h-7 rotate-90 text-white" />
            </button>
          </div>
        </template>
      </Splide>
      <!-- Gallery Thumbnails -->
      <div class="flex gap-2 mt-3 justify-center">
        <button
          v-for="(img, idx) in images"
          :key="img.id || idx"
          @click="goToSlide(idx)"
          :class="[
            'rounded-md border',
            idx === currentSlide ? 'border-primary ring-2 ring-primary' : 'border-accent-200',
            'overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary',
            'transition duration-200'
          ]"
          style="width:5rem;height:4rem"
        >
          <img :src="img.path || img.url || img" :alt="`Thumbnail ${idx + 1}`" class="object-cover w-full h-full" />
        </button>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';
import UiSkeleton from '~/components/Ui/Skeleton/Index.vue';
import UiIconsChevron from '~/components/Ui/Icons/Chevron.vue';

const props = defineProps({
  product: Object,
  isLoading: Boolean
});

const mainSplide = ref(null);
const currentSlide = ref(0);

const images = computed(() => {
  if (props.product?.images && props.product.images.length > 0) {
    return props.product.images;
  }
  // Fallback: show 4 placeholders
  return [
    { id: 1, path: '/images/hero-bg.jpg' },
    { id: 2, path: '/images/login.jpg' },
    { id: 3, path: '/images/register.jpg' },
    { id: 4, path: '/images/signup.jpg' },
  ];
});

const carouselOptions = {
  type: 'loop',
  perPage: 1,
  perMove: 1,
  gap: '1rem',
  lazyLoad: 'nearby',
  arrows: true,
  pagination: true,
  autoplay: false,
  focus: 0,
  rewind: true,
  speed: 400,
  waitForTransition: false,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  padding: { right: 0, left: 0 },
  breakpoints: {
    640: {
      perPage: 1,
      fixedWidth: '100%',
      focus: 'center',
      padding: { right: 0, left: 0 },
    },
    1024: {
      perPage: 1,
      fixedWidth: false,
      focus: 0,
      padding: { right: 0, left: 0 },
    },
  },
};

function goToSlide(idx) {
  currentSlide.value = idx;
  mainSplide.value?.go(idx);
}

function onMainMoved(newIdx) {
  currentSlide.value = newIdx;
}
</script>
<style scoped>
.splide__slide img {
  user-select: none;
}
</style>