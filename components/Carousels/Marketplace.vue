<template>
  <carousel :pauseAutoplayOnHover="true" :snapAlign="'center'" :itemsToShow="1" :wrapAround="true" :autoplay="1000" :breakpoints="breakpoints" class="mt-5 lg:mt-8 overflow-x-hidden px-0">
    <slide v-for="item in marketplace" :key="item.id">
      <UiCards  :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" />
    </slide>

    <template #addons>
      <Navigation />
    </template>
  </carousel>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
export default {
  data() {
    return {
      marketplace: [
        {
          id: 1,
          title: 'Furniture',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/furniture_r9hcwn.jpg',
          urlPath: 'furniture'
        },
        
        {
          id: 2,
          title: 'Living Room',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/living-room_jqoixn.jpg',
          urlPath: 'living-room'
        },

        {
          id: 3,
          title: 'Kitchen and Dining',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/kitchen_irvdft.jpg',
          urlPath: 'kitchen'
        },

        {
          id: 4,
          title: 'Bedroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909453/kafinta/marketplace/bedroom_q5m7cb.png',
          urlPath: 'bedroom'
        },

        {
          id: 5,
          title: 'Bathroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909092/kafinta/marketplace/bathroom_qufzyi.jpg',
          urlPath: 'bathroom'
        },

        {
          id: 6,
          title: 'Storage and Organization',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/closet_phsws6.jpg',
          urlPath: 'storage'
        },

        {
          id: 7,
          title: 'Lighting',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/lighting_zzdqfm.jpg',
          urlPath: 'lighting'
        },

        {
          id: 8,
          title: 'Outdoors',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/outdoors_jejx1j.jpg',
          urlPath: 'outdoors'
        },
      ],

      breakpoints: {
        425: {
          itemsToShow: 1.6,
          snapAlign: 'center',
        },

        480: {
          itemsToShow: 1.8,
          snapAlign: 'center',
        },

        525: {
          itemsToShow: 2,
          snapAlign: 'center',
        },

        625: {
          itemsToShow: 2.3,
          snapAlign: 'center',
        },

        768: {
          itemsToShow: 3,
          snapAlign: 'center',
        },

        820: {
          itemsToShow: 3.5,
          snapAlign: 'center',
        },

        1024: {
          itemsToShow: 4,
          snapAlign: 'center',
        },

        1150: {
          itemsToShow: 5,
          snapAlign: 'center',
        },
      },
    }
  },

  components: {
    Carousel,
    Slide,
    Navigation,
  },
}
</script>

<style>
.carousel__prev,
.carousel__next {
	background-color: white;
  color: #333333;
  border-radius: 100%;
}
</style>