<template>
  <div class="mt-5 lg:mt-8 overflow-x-hidden px-0">
    <VueSlickCarousel v-bind="settings" >
      <UiCardsSecondary v-for="item in projects" :key="item.id" :title="item.title" :artisan="item.artisan" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" />
    </VueSlickCarousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: [
        {
          id: 1,
          title: 'Furniture',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/furniture_r9hcwn.jpg',
          urlPath: 'furniture',
          artisan: 'Test User'
        },
        
        {
          id: 2,
          title: 'Living Room',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/living-room_jqoixn.jpg',
          urlPath: 'living-room',
          artisan: 'Test User'
        },

        {
          id: 3,
          title: 'Kitchen and Dining',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/kitchen_irvdft.jpg',
          urlPath: 'kitchen',
          artisan: 'Test User'
        },

        {
          id: 4,
          title: 'Bedroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909453/kafinta/marketplace/bedroom_q5m7cb.png',
          urlPath: 'bedroom',
          artisan: 'Test User'
        },

        {
          id: 5,
          title: 'Bathroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909092/kafinta/marketplace/bathroom_qufzyi.jpg',
          urlPath: 'bathroom',
          artisan: 'Test User'
        },

        {
          id: 6,
          title: 'Storage and Organization',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/closet_phsws6.jpg',
          urlPath: 'storage',
          artisan: 'Test User'
        },

        {
          id: 7,
          title: 'Lighting',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/lighting_zzdqfm.jpg',
          urlPath: 'lighting',
          artisan: 'Test User'
        },

        {
          id: 8,
          title: 'Outdoors',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/outdoors_jejx1j.jpg',
          urlPath: 'outdoors',
          artisan: 'Test User'
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