<template>
  <div class="mt-5 overflow-x-hidden px-0 relative">
    <carousel :autoplay="true" :nav="false" :dots="false" :loop="true" :center="true" :responsive="false" :autoWidth="true" :margin="10" :rewind="false" class="relative">
      <UiCardsSecondary v-for="item in projects" :key="item.id" :title="item.title" :backgroundImagePath="item.backgroundImagePath" :urlPath="item.urlPath" :artisan="item.username">
      <UserProfilePicture :username="item.username" :large_dimensions="false"  />
      </UiCardsSecondary>

      <template slot="prev">
        <button class="top-[7rem] left-3 absolute z-10 cursor-pointer h-10 w-10 rounded-full bg-secondary bg-opacity-40 hover:bg-primary duration-500 ease-in-out flex items-center justify-center">
          <img src="@/assets/images/icons/triangle.svg" class="h-5 w-5 -ml-0.5 rotate-90" alt="">
        </button>
      </template>

      <template slot="next">
        <button class="top-[7rem] right-3 absolute z-10 cursor-pointer h-10 w-10 rounded-full bg-secondary bg-opacity-40 hover:bg-primary duration-500 ease-in-out flex items-center justify-center">
          <img src="@/assets/images/icons/triangle.svg" class="h-5 w-5 -ml-0.5 -rotate-90" alt="">
        </button>
      </template>
    </carousel>
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
}
</script>