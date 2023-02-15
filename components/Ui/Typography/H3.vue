<template>
  <h3 :class="is_white ? 'text-white' : 'text-secondary'" class="font-medium text-lg"><slot/></h3>
</template>
<script>
  export default {
    props: {
      is_white: Boolean
    }
  }
</script>