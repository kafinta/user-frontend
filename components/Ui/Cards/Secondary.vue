<template>
  <nuxt-link to="" class="cursor-pointer group">
    <div class="">
      <div class="background rounded-t-2xl transform ease-in-out duration-500" :style="{ background:`url(${backgroundImagePath})`}"></div>

      <div class="p-2 px-5 bg-secondary bg-opacity-5 rounded-b-2xl h-14 flex gap-3 items-center">
        <div v-if="profileImagePath" class="profile_background rounded-full transform ease-in-out duration-500" :style="{ background:`url(${profileImagePath})`}"></div>
        <div v-if="!profileImagePath" class="w-8 h-8 rounded-full text-white text-center font-bold bg-secondary bg-opacity-20 transform ease-in-out duration-500 flex items-center justify-center">
          {{ first_letter }}
        </div>
    
        <div>
          <h3 class="text-secondary text-sm font-medium text-left mb-1">{{title}}</h3>
          <p class="text-secondary text-opacity-50 text-xs font-normal text-left" v-if="artisan">by {{ artisan }}</p>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    backgroundImagePath: String,
    title: String,
    urlPath: String,
    artisan: String,
    profileImagePath: String
  },

  data() {
    return {
      first_letter: '',
    }
  },

  methods: {
    getFirstLetter(){
      setTimeout(() => {
        if (this.artisan !== undefined && this.artisan !== '') {
          this.first_letter = this.artisan.slice(0,1)
      } else {
        console.log("error")
      }
      }, 2000);
    }
  },

  created(){
    this.getFirstLetter()
  }
}
</script>

<style>
  .background {
    height: 12rem !important;
    width: 14rem;
    background-position: center center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }

  .profile_background {
    height: 2rem;
    width: 2rem;
    background-position: center center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
  }
</style>