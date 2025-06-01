<template>
  <NuxtLink :to="url" v-if="url"
    :class="linkClasses"
    class="py-2 px-5 text-white font-medium text-base 2xl:text-lg justify-center rounded-md active:bg-primary outline-none"
    :style="(loading || disabled) ? '' : 'transition: background-color 500ms ease-in-out, opacity 500ms ease-in-out;'"
    :disabled="loading || disabled"
  >
    <slot />
  </NuxtLink>
  <button v-else
    @click="!(loading || disabled) && $emit('clicked')"
    :class="buttonClasses"
    class="py-2 px-5 text-white font-medium text-base 2xl:text-lg justify-center rounded-md active:bg-primary outline-none"
    :style="(loading || disabled) ? '' : 'transition: background-color 500ms ease-in-out, opacity 500ms ease-in-out;'"
    :disabled="loading || disabled"
  >
    <div class="flex items-center justify-center">
      <div v-if="loading"  class="flex items-center">
        <div class=" mr-2">
          <UiIconsLoading class="w-7"></UiIconsLoading>
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
    url: {
      type: Object,
      default: null
    }
  },

  computed: {
    baseClasses() {
      return [
        // Layout
        this.flexdisplay ? 'flex w-full items-center gap-3' : 'block w-fit'
      ].filter(Boolean).join(' ')
    },

    buttonClasses() {
      if (this.loading || this.disabled) {
        return [
          this.baseClasses,
          // Disabled/loading state - no transitions, no hover effects
          this.loading ? 'bg-primary cursor-wait' : 'bg-accent-300 text-accent-500 cursor-not-allowed'
        ].filter(Boolean).join(' ')
      }

      return [
        this.baseClasses,
        // Normal state with hover effects
        this.standout ? 'bg-primary hover:bg-opacity-80 focus:bg-opacity-80' : 'bg-secondary hover:bg-primary focus:bg-primary'
      ].filter(Boolean).join(' ')
    },

    linkClasses() {
      if (this.loading || this.disabled) {
        return [
          this.baseClasses,
          // Disabled/loading state - no transitions, no hover effects
          this.loading ? 'bg-primary cursor-wait' : 'bg-accent-300 text-accent-500 cursor-not-allowed pointer-events-none'
        ].filter(Boolean).join(' ')
      }

      return [
        this.baseClasses,
        // Normal state with hover effects
        this.standout ? 'bg-primary hover:bg-opacity-80 focus:bg-opacity-80' : 'bg-secondary hover:bg-primary focus:bg-primary'
      ].filter(Boolean).join(' ')
    }
  }
}
</script>

<style>
</style>