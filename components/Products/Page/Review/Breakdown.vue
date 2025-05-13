<template>
  <div class="grid grid-cols-2 gap-5">
    <div v-for="item in breakdown" :key="item.id">
      <ChartPie :value="item.value" :max="5" :decimals="hasDecimal(item.value) ? 1 : 0" />
      <UiTypographyP class="text-center mt-3">{{ item.title}}</UiTypographyP>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      breakdown: [
        {
          id: 1,
          value: 2,
          title: 'Value for Money'
        },
        {
          id: 2,
          value: 4,
          title: 'True to Description'
        },
        {
          id: 3,
          value: 4.5,
          title: 'Product Quality'
        },
        {
          id: 4,
          value: 1,
          title: 'Shipping'
        },
      ]
    }
  },
  methods: {
    hasDecimal(value) {
      return value % 1 !== 0;
    }
  }
}
</script>