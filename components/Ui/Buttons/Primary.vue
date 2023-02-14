<template>
  <button
    type="submit"
    class="py-2 px-5 bg-secondary hover:bg-primary text-white font-medium text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md active:bg-primary focus:bg-primary" 
    :disabled="loading || disabled" :class="flexdisplay ? 'flex w-full' : 'block w-fit'">
    <div class="flex items-center justify-center uppercase">
      <div v-if="loading"  class="flex items-center">
        <div class=" mr-2">
          <svg class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            style="
              margin: auto; 
              display: block;
              shape-rendering: auto;"
              width="244px"
              height="244px"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid">

            <circle 
              cx="50" 
              cy="50" 
              fill="none"
              stroke="#ffffff" 
              stroke-width="5" 
              r="38" 
              stroke-dasharray="179.0707812546182 61.690260418206066">
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                repeatCount="indefinite" 
                dur="1.2048192771084336s" 
                values="0 50 50;360 50 50" 
                keyTimes="0;1">
              </animateTransform>
            </circle>
          </svg>
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