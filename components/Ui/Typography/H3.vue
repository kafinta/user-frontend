<template>
  <h3 :class="[color==='primary' ? 'text-primary' : color==='white' ? 'text-white' :'text-secondary', size==='default' ? 'text-xl' : 'text-xl md:text-2xl 2xl:text-3xl']" class="font-medium "><slot/></h3>
</template>
<script>
  export default {
    props: {
      color: String,
      size: {
        type: String,
        default: 'default'
      }
    }
  }
</script>