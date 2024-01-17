<template>
  <div>
    <div :class="large_dimensions ? 'h-10 aspect-square' : custom_dimensions ? 'aspect-square h-full w-full' : 'w-8 h-8'" v-if="profileImagePath" class="bg-center bg-cover h-8 w-8 rounded-full transform ease-in-out duration-500" :style="{ background:`url(${profileImagePath})`}"></div>
    <div :class="large_dimensions ? 'h-10 aspect-square' : custom_dimensions ? 'aspect-square h-full w-full text-xl' : 'w-8 h-8'" v-if="!profileImagePath" class="rounded-full text-white text-center font-bold bg-accent-200 flex items-center justify-center">
      {{ first_letter }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: String,
    custom_dimensions: Boolean,
    large_dimensions: Boolean,
    profileImagePath: String
  },

  data() {
    return {
      first_letter: ''
    }
  },

  mounted(){
    setTimeout(() => {
      this.first_letter = this.username.charAt(0)
    }, 200);
  }
}
</script>

<style>

</style>