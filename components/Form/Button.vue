<template>
  <button
    type="submit"
    :disabled="loading || disabled"
    :class="buttonClasses"
    class="py-2 px-5 flex w-full text-white font-medium text-base 2xl:text-lg justify-center rounded-md focus:bg-primary"
    :style="(loading || disabled) ? '' : 'transition: background-color 500ms ease-in-out;'"
  >

    <div class="flex items-center justify-center capitalize">
      <div v-if="loading"  >
        <div class="justify-center flex">
          <UiIconsLoading class="w-7"></UiIconsLoading>
        </div>
      </div>
      <div v-if="!loading" class="flex items-center gap-5">
        <slot />
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: "LoadingButton",
  props: {
      loading: Boolean,
      disabled: Boolean,
      loadingText: {
          default: "Authenticating",
          type: String
      },
  },

  computed: {
    buttonClasses() {
      if (this.loading || this.disabled) {
        return [
          // Disabled/loading state - no transitions, no hover effects
          this.loading ? 'bg-primary cursor-wait' : 'bg-accent-300 text-accent-500 cursor-not-allowed'
        ].join(' ')
      }

      return [
        // Normal state with hover effects
        'bg-secondary hover:bg-primary'
      ].join(' ')
    }
  }
}
</script>

<style>
</style>