<template>
  <h2 :class="color==='primary' ? 'text-primary' : color==='white' ? text-white :'text-secondary'" class="text-2xl md:text-3xl 2xl:text-4xl font-medium"><slot/></h2>
</template>
<script>
  export default {
    props: {
      color: String
    }
  }
</script>