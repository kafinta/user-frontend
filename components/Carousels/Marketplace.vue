<template>
  <ssr-carousel :peek-gutter="false" class="mt-5 overflow-x-hidden px-0 relative">
    <div v-for="item in marketplace" :key="item.id">
      <UiCards :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" class="flex items-center gap-5"/>
    </div>
  </ssr-carousel>
</template>

<script>
import SsrCarousel from 'vue-ssr-carousel'
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

  methods: {
    calculateNoOfCards(cardWidth, extraSpacing){
      // Get the width of the carousel container
      const carouselContainer = document.querySelector(".carousel");
      const carouselWidth = carouselContainer.offsetWidth;

      // Calculate the available width for cards considering extra spacing
      const availableWidth = carouselWidth - extraSpacing;

      // Calculate the number of cards that can fit without exceeding the available width
      const numCardsFit = Math.floor(availableWidth / (cardWidth + extraSpacing));

      return numCardsFit;
    },

    updateCarousel(){
      const cardWidth = 224; // Replace this with the actual width of your cards in pixels
      const extraSpacing = 24; // Replace this with the desired extra horizontal spacing in pixels

    }
  },

  mounted() {
    window.addEventListener("resize", this.updateCarousel());
  },

  components: {
    SsrCarousel
  },
}
</script>