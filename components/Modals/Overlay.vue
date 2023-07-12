<template>
  <div>
    <transition name="slide-fade">
      <div @click="emitCloseDialogEvent()" v-show="openOverlay" class="h-screen cursor-pointer filter w-full bg-secondary bg-opacity-80 backdrop-blur-sm fixed z-140 inset-0">
      </div>
    </transition>
    
    <transition name="slide-fade">
      <div v-show="openOverlay" class="fixed h-auto w-full sm:w-2/3 lg:w-3/5 xl:w-1/3 bg-white z-150 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div class="relative">
          <div class="flex justify-between items-center border-b border-accent1-100 py-3 sm:py-4 sm:px-2 select-none">
            <p class="uppercase font-bold px-4 select-none"><slot name="title" /></p>
            <button @click="emitCloseDialogEvent()" class="block outline-none border-none p-1 cursor-pointer hover:bg-primary hover:text-white text-secondary bg-accent-100 transition duration-300">
              <UiIconsClose class="h-5 w-5 " />
            </button>
          </div>
          
          <div class="p-4 md:p-6" :class="(scrollable ? 'overflow-y-scroll' : 'overflow-hidden')">
            <slot />
          </div>
          
          <div v-show="footerButtons" class="absolute bottom-0 w-full select-none">
            <div class="w-full flex justify-between">
              <button @click="emitCloseDialogEvent()" class="uppercase font-medium border-t border-r border-gray-400 shadow rounded-bl-xl w-1/2 block px-2 py-3 text-center cursor-pointer bg-white hover:bg-gray-200 transition duration-500">
                {{cancelText}}
              </button>
              <button @click="emitOkEvent()" class="uppercase font-medium border-t border-accent1-300 shadow rounded-br-xl w-1/2 block px-2 py-3 text-center cursor-pointer bg-accent1-100 hover:bg-accent1-200 transition duration-500">
                {{okText}}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </transition>
    
  </div>
</template>

<script>
export default {
  name: "Side",
  props: {
    openOverlay: Boolean,
    footerButtons: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    okText: {
      type: String,
      default: 'Ok'
    }
  },

  methods: {
    emitCloseDialogEvent(){
      this.$emit('closeOverlay')
    },
    emitOkEvent(){
      this.$emit('continueAction')
    }
  }

}
</script>
<style>
.change {
  transform: translate(-50%, -50%);
}
</style>
