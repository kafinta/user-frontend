<template>
  <div class="flex items-center justify-center">
    <div :style="gradientStyle" class="h-20 w-20 rounded-full p-1.5 radial bg-primary">
      <div class="bg-white rounded-full h-full w-full grid place-items-center">
        <UiTypographyP>{{value}}{{ percent }}</UiTypographyP>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      percentage: this.value/this.max * 100,
      percent: '%'
    }
  },
  props: {
    max: {
      default: 100,
      type: Number
    },
    value: {
      default: 50,
      type: Number
    },
    isPercent: Boolean
  },
  computed: {
    gradientStyle() {
      return {
        background: `conic-gradient(#C9B14F ${this.percentage}%, #eaeaea 0%)`
      };
    }
  },
  mounted(){
    this.isPercent ? this.percent = '%' : this.percent = '';
  }
}
</script>
<style>
</style>