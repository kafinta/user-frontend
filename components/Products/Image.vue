<template>
  <div v-if="imagePath" :style="{background:`url(${imagePath})`}" class="w-full product background"></div>
  <div v-else class="bg-accent-100 product w-full"></div>
</template>
<script>
  export default{
    props: {
      imagePath: String
    }
  }
</script>