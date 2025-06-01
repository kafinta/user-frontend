<template>
  <NuxtLink v-if="url"
    :to="url"
    :class="linkClasses"
    class="py-2 px-5 font-medium text-sm lg:text-base 2xl:text-lg justify-center rounded-md border outline-none"
    :style="disabled ? '' : 'transition: color 500ms ease-in-out, border-color 500ms ease-in-out;'"
  >
    <slot />
  </NuxtLink>
  <button v-else
    @click="!disabled && $emit('clicked')"
    :class="buttonClasses"
    class="py-2 px-5 font-medium text-sm lg:text-base 2xl:text-lg justify-center rounded-md border outline-none"
    :style="disabled ? '' : 'transition: color 500ms ease-in-out, border-color 500ms ease-in-out;'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    flexdisplay: {
      default: false,
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
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
        this.flexdisplay ? 'flex w-full text-center gap-3 items-center' : 'w-fit text-left'
      ].filter(Boolean).join(' ')
    },

    buttonClasses() {
      if (this.disabled) {
        return [
          this.baseClasses,
          // Disabled state - no transitions, no hover effects
          'text-accent-400 border-accent-200 cursor-not-allowed'
        ].filter(Boolean).join(' ')
      }

      return [
        this.baseClasses,
        // Normal state with hover effects
        'text-secondary border-secondary hover:text-primary hover:border-primary focus:border-primary focus:text-primary active:text-secondary'
      ].filter(Boolean).join(' ')
    },

    linkClasses() {
      if (this.disabled) {
        return [
          this.baseClasses,
          // Disabled state - no transitions, no hover effects
          'text-accent-400 border-accent-200 cursor-not-allowed pointer-events-none'
        ].filter(Boolean).join(' ')
      }

      return [
        this.baseClasses,
        // Normal state with hover effects
        'text-secondary border-secondary hover:text-primary hover:border-primary focus:border-primary focus:text-primary active:text-secondary'
      ].filter(Boolean).join(' ')
    }
  }
}
</script>