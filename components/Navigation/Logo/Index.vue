<template>
  <div @click="emitClicked()" class="cursor-pointer select-none">
    <img src="@/assets/images/logos/full_logo.svg" alt="" class="w-full">
  </div>
</template>

<script>
export default {
  methods: {
    emitClicked(){
      this.$emit('logoClicked')
    }
  }
}
</script>

<style>
</style>