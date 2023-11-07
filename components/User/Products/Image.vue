<template>
  <div :style="{background:`url(${imagePath})`}" class="h-full w-20 bg-accent-100 background"></div>
</template>
<script>
  export default{
    props: {
      imagePath: String
    }
  }
</script>