<template>
  <div class="glide_slider projects mt-5">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides">
        <UiCardsSecondary v-for="item in projects" :key="item.id" :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" :artisan="item.username">
        <UserProfilePicture :username="item.username" :large_dimensions="false"  />
        </UiCardsSecondary>
      </div>
    </div>
  </div>
</template>

<script>
import Glide from '@glidejs/glide'
export default {
  data() {
    return {
      projects: [
        {
          id: 1,
          title: 'Furniture',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/furniture_r9hcwn.jpg',
          urlPath: 'furniture',
          username: '1 User'
        },
        
        {
          id: 2,
          title: 'Living Room',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/living-room_jqoixn.jpg',
          urlPath: 'living-room',
          username: 'Stupid User'
        },

        {
          id: 3,
          title: 'Kitchen & Dining',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/kitchen_irvdft.jpg',
          urlPath: 'kitchen',
          username: 'Example'
        },

        {
          id: 4,
          title: 'Bedroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909453/kafinta/marketplace/bedroom_q5m7cb.png',
          urlPath: 'bedroom',
          username: 'User User'
        },

        {
          id: 5,
          title: 'Bathroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909092/kafinta/marketplace/bathroom_qufzyi.jpg',
          urlPath: 'bathroom',
          username: 'Added User'
        },

        {
          id: 6,
          title: 'Storage & Organization',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/closet_phsws6.jpg',
          urlPath: 'storage',
          username: 'User'
        },

        {
          id: 7,
          title: 'Lighting',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/lighting_zzdqfm.jpg',
          urlPath: 'lighting',
          username: 'Long Name User'
        },

        {
          id: 8,
          title: 'Outdoors',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/outdoors_jejx1j.jpg',
          urlPath: 'outdoors',
          username: 'User'
        },
      ],

      projects_count: ''
    }
  },


  methods: {
    calculateVisibleCards() {
      const viewportWidth = window.innerWidth;
      const cardWidth = 288; // 16rem * 16px (CSS rem = 16px)
      const gapWidth = 50; // 24px gap between cards

      // Calculate the number of cards that can fit onscreen
      const count = (viewportWidth) / (cardWidth + gapWidth);
      this.projects_count = count
    }
  },

  mounted() {
    this.calculateVisibleCards()
    console.log(this.projects_count)
    const sliders = document.querySelectorAll(`.projects`)

    sliders.forEach((slider) => {
      new Glide(slider, {
        type: 'carousel',
        perView: this.projects_count,
        focusAt: 'center',
        breakpoint: {
          400: {
            perView: 1
          },
          1024: {
            perView: 2
          },
          1366: {
            perView: 3,
            gap: 30
          }
        }
      }).mount()
    })
  },
}
</script>