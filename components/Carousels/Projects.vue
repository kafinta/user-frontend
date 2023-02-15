<template>
  <div class="mt-5 overflow-x-hidden px-0">
    <VueSlickCarousel v-bind="settings" >
      <UiCardsSecondary v-for="item in projects" :key="item.id" :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" :artisan="item.artisan">
        <UserProfilePicture :artisan="item.artisan" :large_dimensions="false"  />
      </UiCardsSecondary>
      <template #prevArrow>
        <div class="top-[7rem] left-3 absolute z-10 cursor-pointer h-10 w-10 rounded-full bg-secondary bg-opacity-40 hover:bg-primary duration-500 ease-in-out flex items-center justify-center">
          <img src="@/assets/images/icons/triangle.svg" class="h-5 w-5 -ml-0.5 rotate-90" alt="">
        </div>
      </template>

      <template #nextArrow	>
        <div class="top-[7rem] right-3 absolute z-10 cursor-pointer h-10 w-10 rounded-full bg-secondary bg-opacity-40 hover:bg-primary duration-500 ease-in-out flex items-center justify-center">
          <img src="@/assets/images/icons/triangle.svg" class="h-5 w-5 -ml-0.5 -rotate-90" alt="">
        </div>
      </template>
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
          artisan: '1 User'
        },
        
        {
          id: 2,
          title: 'Living Room',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/living-room_jqoixn.jpg',
          urlPath: 'living-room',
          artisan: 'Stupid User'
        },

        {
          id: 3,
          title: 'Kitchen & Dining',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/kitchen_irvdft.jpg',
          urlPath: 'kitchen',
          artisan: 'Example'
        },

        {
          id: 4,
          title: 'Bedroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909453/kafinta/marketplace/bedroom_q5m7cb.png',
          urlPath: 'bedroom',
          artisan: 'User User'
        },

        {
          id: 5,
          title: 'Bathroom',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909092/kafinta/marketplace/bathroom_qufzyi.jpg',
          urlPath: 'bathroom',
          artisan: 'Added User'
        },

        {
          id: 6,
          title: 'Storage & Organization',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/closet_phsws6.jpg',
          urlPath: 'storage',
          artisan: 'User'
        },

        {
          id: 7,
          title: 'Lighting',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/lighting_zzdqfm.jpg',
          urlPath: 'lighting',
          artisan: 'Long Name User'
        },

        {
          id: 8,
          title: 'Outdoors',
          backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674909090/kafinta/marketplace/outdoors_jejx1j.jpg',
          urlPath: 'outdoors',
          artisan: 'User'
        },
      ],

      settings :{
        "arrows": true,
        "infinite": true,
        "slidesToShow": 1,
        "slidesToScroll": 1,
        "autoplay": false,
        "speed": 300,
        "centerMode": true,
        "cssEase": "linear",
        "responsive": [
          {
            "breakpoint": 2560,
            "settings": {
              "slidesToShow": 3.6,
            }
          },
          {
            "breakpoint": 1250,
            "settings": {
              "slidesToShow": 3.5,
            }
          },
          {
            "breakpoint": 1180,
            "settings": {
              "slidesToShow": 2.9,
            }
          },
          {
            "breakpoint": 1024,
            "settings": {
              "slidesToShow": 2.1,
            }
          },
          {
            "breakpoint": 768,
            "settings": {
              "slidesToShow": 2,
            }
          },
          {
            "breakpoint": 600,
            "settings": {
              "slidesToShow": 1.15,
            }
          },          
          {
            "breakpoint": 480,
            "settings": {
              "slidesToShow": 0.7,
            }
          },
          {
            "breakpoint": 375,
            "settings": {
              "slidesToShow": 0.7,
            }
          },
          {
            "breakpoint": 320,
            "settings": {
              "slidesToShow": 0.5,
              "centerMode": true,
            }
          }, 
        ]
      }
    }
  },
}
</script>