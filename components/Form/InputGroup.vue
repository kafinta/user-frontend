<template>
  <div :class="containerClasses" class="flex w-full" :style="disabled ? '' : 'transition: all 300ms ease-out;'">
    <slot />
  </div>
</template>

<script>
export default {
  name: "InputGroup",
  props: {
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    },
    fluid: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    containerClasses() {
      const sizeClasses = {
        small: 'text-sm',
        normal: 'text-base',
        large: 'text-lg'
      }

      if (this.disabled) {
        return [
          // Base styling
          'relative overflow-hidden rounded-md border',

          // Size
          sizeClasses[this.size],

          // Width
          this.fluid ? 'w-full' : 'w-auto',

          // Disabled state - no transitions, no hover effects
          'border-accent-200 bg-accent-50 cursor-not-allowed',

          // Error state for disabled
          this.error ? 'border-red-300' : ''
        ].filter(Boolean).join(' ')
      }

      return [
        // Base styling
        'relative overflow-hidden rounded-md border',

        // Size
        sizeClasses[this.size],

        // Width
        this.fluid ? 'w-full' : 'w-auto',

        // Border states
        this.error ? 'border-red-600' : 'border-secondary border-opacity-20',

        // Focus-within states
        !this.error ? 'focus-within:border-primary focus-within:border-opacity-100' : '',

        // Background
        'bg-white'
      ].filter(Boolean).join(' ')
    }
  },

  provide() {
    return {
      inputGroup: {
        size: this.size,
        error: this.error,
        disabled: this.disabled
      }
    }
  }
}
</script>

<style scoped>
/* Remove borders from child inputs to create seamless appearance */
:deep(input) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* Ensure proper focus states are handled by the container */
:deep(input:focus) {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
</style>
