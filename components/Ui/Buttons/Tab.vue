<template>
  <button @click="changeState" :class="is_clicked ? 'bg-primary text-white' : 'bg-accent-50 hover:text-primary text-secondary ease-in-out hover:bg-accent-100 focus:bg-accent-100 focus:text-primary'" class="font-medium text-sm xl:text-base 2xl:text-lg duration-500 select-none py-2 outline-none px-5 rounded-md">
    <slot />
  </button>
</template>
<script>
export default {
  data() {
    return {
      is_clicked: false
    }
  },

  methods: {
    changeState(){
      this.$emit("clicked")
      this.is_clicked = !this.is_clicked
    }
  },
}
</script>