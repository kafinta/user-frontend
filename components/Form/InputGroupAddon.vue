<template>
  <div :class="addonClasses" class="flex items-center justify-center px-3 transition-all duration-300 ease-out">
    <slot />
  </div>
</template>

<script>
export default {
  name: "InputGroupAddon",
  props: {
    position: {
      type: String,
      default: 'auto',
      validator: (value) => ['left', 'right', 'auto'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },

  inject: {
    inputGroup: {
      default: () => ({
        size: 'normal',
        error: false,
        disabled: false
      })
    }
  },

  computed: {
    addonClasses() {
      const sizeClasses = {
        small: 'py-2 text-sm',
        normal: 'py-3 text-base',
        large: 'py-4 text-lg'
      }

      return [
        // Base styling
        'border-r border-l border-accent-200',

        // Size
        sizeClasses[this.inputGroup.size],

        // Background
        'bg-accent-50',

        // Text color
        this.inputGroup.error ? 'text-red-600' : 'text-secondary',

        // Clickable states
        this.clickable && !this.inputGroup.disabled ? 'cursor-pointer hover:bg-accent-100 hover:text-primary' : '',

        // Disabled state
        this.inputGroup.disabled ? 'opacity-50 cursor-not-allowed' : '',

        // First/last child styling (remove unnecessary borders)
        'first:border-l-0 last:border-r-0'
      ].filter(Boolean).join(' ')
    }
  },

  methods: {
    handleClick(event) {
      if (this.clickable && !this.inputGroup.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>
