<template>
  <button 
    @click="$emit('clicked')"
    class="py-2 px-5 text-secondary font-medium text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md active:text-secondary border hover:text-primary hover:border-primary focus:border-primary focus:text-primary outline-none" 
    :disabled="loading || disabled" :class="[flexdisplay ? 'flex w-full' : 'block w-fit']">
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