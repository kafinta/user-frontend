<template>
  <div class="glide_slider projects mt-5 relative flex items-center">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides">
        <UiCardsSecondary v-for="item in projects" :key="item.id" :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath">
        <UserProfilePicture username="Kafinta" :large_dimensions="false"  />
        </UiCardsSecondary>
      </div>
    </div>

    <div class="glide__arrows h-fit" data-glide-el="controls">
      <button class="glide__arrow glide__arrow--left absolute left-3" data-glide-dir="<">
        <div class="bg-secondary aspect-square rounded-full p-3 hover:bg-primary duration-300 bg-opacity-75">
          <UiIconsAccordion class="w-5 h-5 -rotate-90 text-white" />
        </div>
      </button>
      <button class="glide__arrow glide__arrow--right absolute right-3" data-glide-dir=">">
        <div class="bg-secondary aspect-square rounded-full p-3 hover:bg-primary duration-300 bg-opacity-75">
          <UiIconsAccordion class="w-5 h-5 rotate-90 text-white" />
        </div>
      </button>
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
    }
  },

  mounted() {
    const projectSlider = document.querySelectorAll(`.projects`)

    projectSlider.forEach((project) => {
      new Glide(project, {
        type: 'carousel',
        focusAt: 'center',
        gap: 20,
        peek: 30,
        breakpoints: {
          600: {
            perView: 1
          },
          1024: {
            perView: 2
          },
          1440: {
            perView: 3,
          },
          2560: {
            perView: 4,
          },
          12000: {
            perView: 5,
          }
        }
      }).mount()
    })
  },
}
</script>