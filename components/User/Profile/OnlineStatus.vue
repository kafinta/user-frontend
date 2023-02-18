<template>
  <div :class="[is_online ? 'bg-green-600' : 'bg-slate-400', is_displayed ? 'block' : 'hidden']" class="h-2.5 w-2.5 rounded-full border-white border bottom-0 right-0 absolute"></div>
</template>

<script>
export default {
  props: {
    is_online: Boolean,
    is_displayed: Boolean,
  }
}
</script>

<style>

</style>