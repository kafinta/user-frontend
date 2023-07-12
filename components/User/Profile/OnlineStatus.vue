<template>
  <div :class="is_online ? 'bg-green-500' : 'bg-slate-400'" class="h-2.5 w-2.5 rounded-full border-white border block absolute"></div>
</template>

<script>
export default {
  props: {
    is_online: Boolean,
  }
}
</script>