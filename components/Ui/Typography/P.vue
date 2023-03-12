<template>
  <p :class="[is_white ? 'text-white' : 'text-secondary', small_text ? 'text-sm 2xl:text-base' : 'text-sm md:text-base 2xl:text-lg']" class="font-normal">
    <slot/>
  </p>
</template>
<script>
  export default {
    props: {
      is_white: Boolean,
      small_text: Boolean
    }
  }
</script>