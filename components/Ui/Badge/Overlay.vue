<template>
  <div class="relative inline-block">
    <!-- Main content -->
    <slot />
    
    <!-- Badge overlay -->
    <FormBadge
      v-if="visible"
      :value="value"
      :severity="severity"
      :size="size"
      :class="badgePositionClasses"
      class="absolute"
    >
      <slot name="badge">{{ value }}</slot>
    </FormBadge>
  </div>
</template>

<script>
export default {
  name: "BadgeOverlay",
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
    },
    position: {
      type: String,
      default: 'top-right',
      validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
    }
  },

  computed: {
    visible() {
      return this.value != null || this.$slots.badge
    },

    badgePositionClasses() {
      const positions = {
        'top-left': '-top-2 -left-2',
        'top-right': '-top-2 -right-2',
        'bottom-left': '-bottom-2 -left-2',
        'bottom-right': '-bottom-2 -right-2'
      }

      return positions[this.position] || positions['top-right']
    }
  }
}
</script>
