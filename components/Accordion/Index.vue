<template>
  <ul class="accordion" role="list" aria-roledescription="accordion">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  props: {
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    firstItemActive: {
      type: Boolean,
      default:false,
    }
  },
  data() {
    return {
      Items: [],
    };
  },

  provide() {
    return { 
      Items: this.Items,
      allowMultiple: this.allowMultiple,
    };
  },

};
</script>

<style>
.accordion {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>