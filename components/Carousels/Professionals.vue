<template>
  <div class="glide_slider professionals mt-5">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides">
        <UiCards v-for="professional in professionals" :key="professional.id" :title="professional.title" :backgroundImagePath="professional.backgroundImagePath" :urlPath="professional.urlPath" class="glide__slide" />
      </div>
    </div>
  </div>
</template>

<script>
import Glide from '@glidejs/glide'
export default {
  data() {
    return {
      professionals: [
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
      ],
      numCards: ''
    }
  },

  methods: {
    calculateVisibleCards() {
      const viewportWidth = window.innerWidth;
      const cardWidth = 16 * 16; // 16rem * 16px (CSS rem = 16px)
      const gapWidth = 10; // 24px gap between cards

      // Calculate the number of cards that can fit onscreen
      const numCards = (viewportWidth) / (cardWidth + gapWidth);
      this.numCards = numCards
    }
  },

  mounted() {
    this.calculateVisibleCards()
    const sliders = document.querySelectorAll(`.professionals`)

    sliders.forEach((slider) => {
      new Glide(slider, {
        type: 'carousel',
        perView: this.numCards,
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
  },
}
</script>