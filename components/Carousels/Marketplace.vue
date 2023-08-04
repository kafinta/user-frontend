<template>
  <div class="glide_slides marketplace mt-5 relative flex items-center">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides">
        <UiCards v-for="item in marketplace" :key="item.id" :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" class="glide__slide"/>
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

<script setup>
import Glide from '@glidejs/glide'

import { onMounted } from 'vue';
function calculateVisibleCards() {
  const viewportWidth = window.innerWidth;
  const cardWidth = 16 * 16; // 16rem * 16px (CSS rem = 16px)
  const gapWidth = 10; // 24px gap between cards

  // Calculate the number of cards that can fit onscreen
  const numCards = (viewportWidth) / (cardWidth + gapWidth);
  return numCards;
}

const marketplace= [
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
]

onMounted(() =>{
  window.addEventListener('resize', function () {
    calculateVisibleCards();

    const numCards = calculateVisibleCards()

    const sliders = document.querySelectorAll(`.marketplace`)
    sliders.forEach((slider) => {
      new Glide(slider, {
        type: 'carousel',
        perView: numCards,
        focusAt: 'center',
        autoplay: true,
        animationDuration: 2000,
        // gap: 30,
      }).mount()
    })
  });

  const numCards = calculateVisibleCards()

  const sliders = document.querySelectorAll(`.glide_slides`)
  sliders.forEach((slider) => {
    new Glide(slider, {
      type: 'carousel',
      perView: numCards,
      focusAt: 'center',
      autoplay: true,
      animationDuration: 2000,
      breakpoint: {
        400: {
          perView: 1
        },
        800: {
          perView: 3
        },
        1024: {
          perView: 4
        },
        1366: {
          perView: 5
        }
      }
    }).mount()
  })
})


</script>