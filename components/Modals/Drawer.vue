<template>
  <div>
    <transition name="slide-fade">
      <div @click="emitCloseDialogEvent()" v-show="openDialog" class="h-screen cursor-pointer filter w-full bg-secondary bg-opacity-80 backdrop-blur-sm fixed z-140 inset-0">
      </div>
    </transition>
    
    <transition name="slide-in-left">
      <div v-show="openDialog" class="fixed w-full sm:w-2/3 lg:w-3/5 xl:w-1/3 right-0 bg-white h-full z-150 top-0">
        <div class="relative h-full">
          <div class="flex justify-between items-center border-b border-accent1-100 py-3 sm:py-4 sm:px-2 select-none">
            <p class="uppercase font-bold px-4 select-none"><slot name="title" /></p>
            <button @click="emitCloseDialogEvent()" class="block outline-none border-none p-1 cursor-pointer hover:bg-primary hover:text-white text-secondary bg-accent-100 transition duration-300">
              <UiIconsClose class="h-5 w-5 " />
            </button>
          </div>
          
          <div class="px-4 md:px-6 py-5 " :class="(footerButtons ? 'h-screen-80' : 'h-screen-85') + ' ' + (scrollable ? 'custom-scroll-y' : 'overflow-hidden')">
            <slot />
          </div>
          
          <div v-show="footerButtons" class="absolute bottom-0 w-full select-none">
            <div class="w-full flex justify-between">
              <a @click="emitCloseDialogEvent()" class="uppercase font-medium border-t border-r border-gray-400 shadow rounded-bl-xl w-1/2 block px-2 py-3 text-center cursor-pointer bg-white hover:bg-gray-200 transition duration-500">
                {{cancelText}}
              </a>
              <a @click="emitOkEvent()" class="uppercase font-medium border-t border-accent1-300 shadow rounded-br-xl w-1/2 block px-2 py-3 text-center cursor-pointer bg-accent1-100 hover:bg-accent1-200 transition duration-500">
                {{okText}}
              </a>
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
    openDialog: Boolean,
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
      this.$emit('closeDialog')
    },
    emitOkEvent(){
      this.$emit('continueAction')
    }
  }

}
</script>
