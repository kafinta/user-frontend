<template>
  <div class="mt-5 overflow-x-hidden px-0 glide">
    <div data-glide-el="track" class="glide__track">
      <div class="glide__slides">
        <UiCards v-for="professional in professionals" :key="professional.id" :title="professional.title" :backgroundImagePath="professional.backgroundImagePath" :urlPath="professional.urlPath" class="glide__slide flex items-center gap-5" />
      </div>

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
    }
  },

  mounted() {
    new Glide('.glide', {
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