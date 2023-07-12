<template>
  <button 
    @click="$emit('clicked')"
    class="py-2 px-5 text-white font-medium text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md active:bg-primary outline-none" 
    :disabled="loading || disabled" :class="[flexdisplay ? 'flex w-full' : 'block w-fit', standout ? 'bg-primary hover:bg-opacity-80 focus:bg-opacity-80': 'bg-secondary hover:bg-primary focus:bg-primary']">
    <div class="flex items-center justify-center">
      <div v-if="loading"  class="flex items-center">
        <div class=" mr-2">
          <Loading class="w-7"></Loading>
        </div>
        {{ loadingText }}
      </div>
      <div v-if="!loading">
        <slot />
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    flexdisplay: {
      default: false,
      type: Boolean
    },
    standout: {
      default: false,
      type: Boolean
    },
    loading: Boolean,
    color: String,
    disabled: Boolean,
    loadingText: {
      default: "Loading",
      type: String
    },
  },
}
</script>

<style>
</style>