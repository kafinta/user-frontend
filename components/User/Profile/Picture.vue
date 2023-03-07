<template>
  <div>
    <div :class="custom_dimensions ? 'h-full w-full' : 'w-8 h-8'" v-if="profileImagePath" class="bg-center bg-cover h-8 w-8 rounded-full transform ease-in-out duration-500" :style="{ background:`url(${profileImagePath})`}"></div>
    <div :class="custom_dimensions ? 'h-full w-full text-xl' : 'w-8 h-8'" v-if="!profileImagePath" class="rounded-full text-white text-center font-bold bg-accent-200 flex items-center justify-center">
      {{ first_letter }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artisan: String,
    custom_dimensions: Boolean,
    profileImagePath: String
  },

  data() {
    return {
      first_letter: ''
    }
  },

  methods: {
    getFirstLetter(){
      this.first_letter = this.artisan.slice(0,1)
    }
  },

  created(){
    // if(window.process){
      this.getFirstLetter()
    // }
  }
}
</script>

<style>

</style>