<template>
  <div :style="{background:`url(${imagePath})`}" class="w-full aspect-video background"></div>
</template>
<script>
  export default{
    props: {
      imagePath: String
    }
  }
</script>