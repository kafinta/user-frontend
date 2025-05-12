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
    percentage() {
      // Ensure we have valid numbers and handle edge cases
      const val = Number(this.value) || 0;
      const maximum = Number(this.max) || 100;
      return (val / maximum) * 100;
    },
    formattedValue() {
      // Ensure we have a valid number
      const val = Number(this.value) || 0;
      return this.decimals > 0 ? val.toFixed(this.decimals) : Math.round(val);
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