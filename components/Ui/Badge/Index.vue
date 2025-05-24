<template>
  <span 
    v-if="visible"
    :class="badgeClasses"
    class="inline-flex items-center justify-center font-medium text-center"
  >
    <slot>{{ value }}</slot>
  </span>
</template>

<script>
export default {
  name: "Badge",
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'contrast'].includes(value)
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    }
  },

  computed: {
    visible() {
      return this.value != null || this.$slots.default
    },

    badgeClasses() {
      const severityClasses = {
        primary: 'bg-primary text-white',
        secondary: 'bg-secondary text-white',
        success: 'bg-green-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white',
        danger: 'bg-red-500 text-white',
        contrast: 'bg-gray-900 text-white'
      }

      const sizeClasses = {
        small: 'text-xs px-1.5 py-0.5 min-w-[1rem] h-4',
        normal: 'text-xs px-2 py-1 min-w-[1.25rem] h-5',
        large: 'text-sm px-2.5 py-1 min-w-[1.5rem] h-6'
      }

      return [
        // Base styling
        'rounded-full',
        
        // Severity colors
        severityClasses[this.severity],
        
        // Size
        sizeClasses[this.size]
      ].filter(Boolean).join(' ')
    }
  }
}
</script>
