<template>
  <div
    :style="skeletonStyles"
    class="bg-gray-200 animate-pulse"
    :class="[
      shape === 'circle' ? 'rounded-full' : 'rounded',
      $attrs.class
    ]"
  />
</template>

<script>
export default {
  name: "Skeleton",
  inheritAttrs: false,
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '1rem'
    },
    shape: {
      type: String,
      default: 'rectangle',
      validator: (value) => ['rectangle', 'circle'].includes(value)
    }
  },

  computed: {
    skeletonStyles() {
      const styles = {}

      // Width
      if (typeof this.width === 'number') {
        styles.width = `${this.width}px`
      } else {
        styles.width = this.width
      }

      // Height
      if (typeof this.height === 'number') {
        styles.height = `${this.height}px`
      } else {
        styles.height = this.height
      }

      // For circle, ensure width and height are equal
      if (this.shape === 'circle') {
        const size = styles.height || styles.width
        styles.width = size
        styles.height = size
      }

      return styles
    }
  }
}
</script>
