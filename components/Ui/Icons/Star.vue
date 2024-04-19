<template>
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 64 64" style="enable-background:new 0 0 64 64;" xml:space="preserve" fill="currentColor" :opacity="opacity">
    <g>
      <polygon points="32,1.6 41.9,21.6 64,24.8 48,40.4 51.8,62.4 32,52 12.2,62.4 16,40.4 0,24.8 22.1,21.6 	"/>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    opacity: {
      type: Number,
      default: 1
    }    
  },
};
</script>
