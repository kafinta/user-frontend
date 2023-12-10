<template>
  <h3 :class="color==='primary' ? 'text-primary' : color==='white' ? 'text-white' :'text-secondary'" class="font-medium text-xl md:text-2xl 2xl:text-3xl"><slot/></h3>
</template>
<script>
  export default {
    props: {
      color: String
    }
  }
</script>