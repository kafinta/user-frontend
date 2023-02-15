<template>
  <h1 :class="is_white ? 'text-white' : 'text-secondary'" class="text-4xl md:text-5xl xl:text-6xl font-bold"><slot/></h1>
</template>
<script>
  export default {
    props: {
      is_white: Boolean
    }
  }
</script>