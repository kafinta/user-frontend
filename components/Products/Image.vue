<template>
  <div :style="{background:`url(${imagePath})`}" class="w-full product background"></div>
</template>
<script>
  export default{
    props: {
      imagePath: String
    }
  }
</script>