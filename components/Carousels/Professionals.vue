<template>
  <div :pauseAutoplayOnHover="true" :snapAlign="'center'" :itemsToShow="1" :wrapAround="true" :autoplay="1000" :breakpoints="breakpoints" class="mt-5 lg:mt-8 overflow-x-hidden px-0">
    <div v-for="professional in professionals" :key="professional.id">
      <UiCards :pauseAutoplayOnHover="true" :title="professional.title" :backgroundImagePath="professional.backgroundImagePath" :urlPath="professional.urlPath" />
    </div>
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

      breakpoints: {
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