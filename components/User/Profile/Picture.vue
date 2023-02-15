<template>
  <div>
    <div :class="large_dimensions ? 'h-10 w-10' : 'w-8 h-8'" v-if="profileImagePath" class="bg-center bg-cover h-8 w-8 rounded-full transform ease-in-out duration-500" :style="{ background:`url(${profileImagePath})`}"></div>
    <div :class="large_dimensions ? 'h-10 w-10 text-xl' : 'w-8 h-8'" v-if="!profileImagePath" class="rounded-full text-white text-center font-bold bg-slate-400 flex items-center justify-center">
      {{ first_letter }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artisan: String,
    large_dimensions: Boolean
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
    this.getFirstLetter()
  }
}
</script>

<style>

</style>