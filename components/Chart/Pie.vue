<template>
  <div class="flex items-center justify-center">
    <div :style="gradientStyle" class="h-20 w-20 rounded-full p-1.5 radial bg-primary">
      <div class="bg-white rounded-full h-full w-full grid place-items-center">
        <UiTypographyP>{{ displayValue }}</UiTypographyP>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    max: {
      default: 100,
      type: Number
    },
    value: {
      default: 50,
      type: Number
    },
    isPercent: {
      type: Boolean,
      default: false
    },
    decimals: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // Get the actual value, handling both primitive values and ref objects
    actualValue() {
      // Check if value is a ref object with a value property
      if (this.value && typeof this.value === 'object' && 'value' in this.value) {
        return Number(this.value.value) || 0;
      }
      // Otherwise treat as a primitive
      return Number(this.value) || 0;
    },
    percentage() {
      // Use actualValue to calculate percentage
      const maximum = Number(this.max) || 100;
      return (this.actualValue / maximum) * 100;
    },
    formattedValue() {
      // Use actualValue for formatting
      return this.decimals > 0 ? this.actualValue.toFixed(this.decimals) : Math.round(this.actualValue);
    },
    displayValue() {
      return `${this.formattedValue}${this.isPercent ? '%' : ''}`;
    },
    gradientStyle() {
      return {
        background: `conic-gradient(#C9B14F ${this.percentage}%, #eaeaea 0%)`
      };
    }
  }
}
</script>
<style>
.radial {
  background-clip: content-box;
}
</style>