<template>
  <div class="mt-5 lg:mt-8 overflow-x-hidden px-0">
    <VueSlickCarousel v-bind="settings">
      <UiCards v-for="professional in professionals" :key="professional.id" :title="professional.title" :backgroundImagePath="professional.backgroundImagePath" :urlPath="professional.urlPath" class="flex items-center gap-5" />
    </VueSlickCarousel>
  </div>
</template>

<script>
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

      settings :{
        "arrows": true,
        "infinite": true,
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "autoplay": true,
        "speed": 300,
        "autoplaySpeed": 2000,
        "centerMode": true,
        "cssEase": "linear",
        "responsive": [
          {
            "breakpoint": 2560,
            "settings": {
              "slidesToShow": 4.5,
            }
          },
          {
            "breakpoint": 1250,
            "settings": {
              "slidesToShow": 4,
            }
          },
          {
            "breakpoint": 1180,
            "settings": {
              "slidesToShow": 4,
            }
          },
          {
            "breakpoint": 1024,
            "settings": {
              "slidesToShow": 3,
            }
          },
          {
            "breakpoint": 820,
            "settings": {
              "slidesToShow": 2.5,
            }
          },
          {
            "breakpoint": 768,
            "settings": {
              "slidesToShow": 2.5,
            }
          },
          {
            "breakpoint": 670,
            "settings": {
              "slidesToShow": 1.8,
            }
          }, 
          {
            "breakpoint": 600,
            "settings": {
              "slidesToShow": 1.4,
            }
          },          
          {
            "breakpoint": 480,
            "settings": {
              "slidesToShow": 1.1,
            }
          },
          {
            "breakpoint": 375,
            "settings": {
              "slidesToShow": 0.9,
            }
          },
          {
            "breakpoint": 320,
            "settings": {
              "slidesToShow": 0.7,
              "centerMode": true,
            }
          }, 
        ]
      }
    }
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