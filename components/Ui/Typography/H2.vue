<template>
  <h2 :class="is_white ? 'text-white' : 'text-secondary'" class="text-2xl md:text-3xl 2xl:text-4xl font-medium"><slot/></h2>
</template>
<script>
  export default {
    props: {
      is_white: Boolean
    }
  }
</script>