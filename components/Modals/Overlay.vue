<template>
  <div>
    <transition name="slide-fade">
      <div @click="emitCloseDialogEvent()" v-show="openOverlay" class="h-screen cursor-pointer filter w-full bg-secondary bg-opacity-80 backdrop-blur-sm fixed z-140 inset-0">
      </div>
    </transition>
    
    <transition name="slide-fade">
      <div v-show="openOverlay" class="fixed h-auto w-full sm:w-2/3 lg:w-3/5 xl:w-1/3 bg-white z-150 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-md">
        <div class="relative">
          <div class="flex justify-between items-center border-b border-accent1-100 py-3 sm:py-4 px-4 select-none">
            <p class="uppercase font-bold select-none"><slot name="title" /></p>
            <button @click="emitCloseDialogEvent()" class="block outline-none border-none p-1 cursor-pointer hover:bg-primary hover:text-white text-secondary bg-accent-100 transition duration-300">
              <UiIconsClose class="h-5 w-5 "/>
            </button>
          </div>
          
          <div class="p-4 md:p-6 grid gap-6 text-center place-items-center">
            <slot />
          </div>
        </div>

      </div>
    </transition>
    
  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    openOverlay: Boolean,
  },

  methods: {
    emitCloseDialogEvent(){
      this.$emit('closeOverlay')
    },
  }

}
</script>
<style>
.change {
  transform: translate(-50%, -50%);
}
</style>
