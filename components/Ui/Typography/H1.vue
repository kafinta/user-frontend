<template>
  <h1 :class="color==='primary' ? 'text-primary' : color==='white' ? text-white :'text-secondary'" class="text-4xl md:text-5xl xl:text-6xl font-bold"><slot/></h1>
</template>
<script>
  export default {
    props: {
      color: String
    }
  }
</script>