<template>
  <div :style="{background:`url(${imagePath})`}" class="w-full aspect-video bg-accent-100 background"></div>
</template>
<script>
  export default{
    props: {
      imagePath: String
    }
  }
</script>