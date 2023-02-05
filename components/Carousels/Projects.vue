<template>
  <div :pauseAutoplayOnHover="true" :snapAlign="'center'" :itemsToShow="1" :wrapAround="true" :breakpoints="project_breakpoints" class="mt-5 lg:mt-8 overflow-x-hidden px-0">
    <div v-for="item in projects" :key="item.id">
      <UiCardsSecondary :title="item.title" :artisan="item.artisan" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" />
    </div>
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

      project_breakpoints: {
        425: {
          itemsToShow: 1.6,
          snapAlign: 'center',
        },

        480: {
          itemsToShow: 1.8,
          snapAlign: 'center',
        },

        525: {
          itemsToShow: 2,
          snapAlign: 'center',
        },

        625: {
          itemsToShow: 2.3,
          snapAlign: 'center',
        },

        768: {
          itemsToShow: 3,
          snapAlign: 'center',
        },

        820: {
          itemsToShow: 3.5,
          snapAlign: 'center',
        },

        1024: {
          itemsToShow: 4,
          snapAlign: 'center',
        },

        1150: {
          itemsToShow: 5,
          snapAlign: 'center',
        },
      },
    }
  },

  components: {
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