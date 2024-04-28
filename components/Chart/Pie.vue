<template>
  <div class="flex items-center justify-center">
    <div class="h-20 w-20 rounded-full p-1.5 radial bg-primary">
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
      percentage: 0,
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
  mounted(){
    this.isPercent ? this.percent = '%' : this.percent = '';
    this.percentage = this.value/this.max * 100;
    document.documentElement.style.setProperty('--percent', `${this.percentage}%`);
  }
}
</script>
<style>
.radial {
  background: conic-gradient(#C9B14F var(--percent), #eaeaea 0deg);
}
</style>