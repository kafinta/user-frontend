<template>
  <carousel :per-page="1" 
  :autoplay="true" 
  :paginationEnabled="false"
  :perPageCustom="[[425, 1.6], [480, 1.8], [525, 2], [625, 2.3], [768, 3], [820, 3.5], [1030, 4], [1150, 5]]"
  :navigation-enabled="true"
  navigation-next-label="nextLabel"
  navigation-prev-label="prevLabel"
  :loop="true" :centerMode="true" class="mt-5 lg:mt-8 overflow-x-hidden px-0">
    <slide v-for="item in marketplace" :key="item.id" class="flex gap-5">
      <UiCards :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" />
    </slide>
  </carousel>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';
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
    }
  },

  components: {
    Carousel,
    Slide
  }
}
</script>

<style>

</style>