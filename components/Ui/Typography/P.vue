<template>
  <p :class="is_white ? 'text-white' : 'text-secondary'" class="text-sm md:text-base 2xl:text-lg">
    <slot/>
  </p>
</template>
<script>
  export default {
    props: {
      is_white: Boolean
    }
  }
</script>