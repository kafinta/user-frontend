<template>
  <div class="mt-5 overflow-x-hidden px-0 slide">
    <div data-glide-el="track" class="relative glide__track">
      <div class="glide__slides">
        <UiCards v-for="item in marketplace" :key="item.id" :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" class="flex items-center gap-5" />

        <div data-glide-el="controls" class="glide__arrows">
          <button data-glide-dir="<" class="glide__arrow glide__arrow--left top-[7rem] left-3 absolute z-10 cursor-pointer h-10 w-10 rounded-full bg-secondary bg-opacity-40 hover:bg-primary duration-500 ease-in-out flex items-center justify-center">
            <img src="@/assets/images/icons/triangle.svg" class="h-5 w-5 -ml-0.5 rotate-90" alt="">
          </button>

          <button data-glide-dir=">" class="glide__arrow glide__arrow--right top-[7rem] right-3 absolute z-10 cursor-pointer h-10 w-10 rounded-full bg-secondary bg-opacity-40 hover:bg-primary duration-500 ease-in-out flex items-center justify-center">
            <img src="@/assets/images/icons/triangle.svg" class="h-5 w-5 -ml-0.5 -rotate-90" alt="">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Glide from '@glidejs/glide'
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

  mounted() {
    new Glide('.slide', {
      type: 'carousel',
      autoplay: 2000,
      focusAt: 'center',
      hoverpause: false,
      keyboard: true,
      animationDuration: 1000,
      breakpoints: {
        2560:{
          perView: 5
        },
        1024: {
          perView: 4
        },
        950:{
          perView: 3.4,
        },
        875: {
          perView: 3.3,
        },
        768: {
          perView: 3,
        },
        600: {
          perView: 2.5,
          peek: {
            before: 0,
            after: 0
          }
        },
        525: {
          perView: 1.9,
          peek: {
            before: 15,
            after: 15
          }
        },
        425: {
          perView: 1.5,
          peek: {
            before: 10,
            after: 10
          }
        },
        375: {
          perView: 1.2,
          peek: {
            before: 20,
            after: 20
          }
        },
        320: {
          perView: 1,
          peek: {
            before: 20,
            after: 20
          }
        },
      }
    }).mount()
  },
}
</script>

<style>
@import '@glidejs/glide/dist/css/glide.core.min.css';
</style>