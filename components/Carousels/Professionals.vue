<template>
  <div class="mt-5 overflow-x-hidden px-0 relative">
    <carousel :autoplay="true" :nav="false" :dots="false" :loop="true" :center="true" :autoplaySpeed="2000" :autoplayTimeout="2000" :autoplayHoverPause="true" :responsive="false" :autoWidth="true" :margin="10" :rewind="false">
      <UiCards v-for="professional in professionals" :key="professional.id" :title="professional.title" :backgroundImagePath="professional.backgroundImagePath" :urlPath="professional.urlPath" class="flex items-center gap-5" />

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
}
</script>

<style>
@import '@glidejs/glide/dist/css/glide.core.min.css';
</style>