<template>
  <div class="flex md:hidden" @click="revealMenuEvent">
    <div class="w-8">
      <div :class="(mobile_nav ? 'transition transform rotate-45 items-center w-8' : 'transition w-8') + ' ' + (BlockBackground ? 'bg-primary' : 'bg-primary')" class="block cursor-pointer" style="height: 3px;"></div>
      <div :class="(mobile_nav ? 'transition transform -rotate-45 item-center w-8 -mt-0.5' : 'transition w-8 mt-1.5') + ' ' + (BlockBackground ? 'bg-primary' : 'bg-primary')"  class="block cursor-pointer" style="height: 3px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    BlockBackground: Boolean
  },

  data(){
    return{
      mobile_nav: false,
    }
  },
  methods: {
    revealMenuEvent(){
      this.mobile_nav = !this.mobile_nav
      this.$emit("revealMenu")
    }
  }
}
</script>