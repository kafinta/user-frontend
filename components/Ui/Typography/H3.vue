<template>
  <h3 :class="color==='primary' ? 'text-primary' : color==='white' ? text-white :'text-secondary'" class="font-medium text-lg"><slot/></h3>
</template>
<script>
  export default {
    props: {
      color: String
    }
  }
</script>