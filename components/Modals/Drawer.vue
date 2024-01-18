<template>
  <aside>
    <transition name="slide-fade">
      <div @click="emitCloseDialogEvent()" v-show="openDialog" class="h-screen cursor-pointer filter w-full bg-secondary bg-opacity-80 backdrop-blur-sm fixed z-140 inset-0">
      </div>
    </transition>
    
    <transition name="slide-in-left">
      <div v-show="openDialog" class="fixed w-4/5 md:w-1/2 lg:w-3/5 xl:w-1/3 right-0 bg-white h-full z-150 top-0">
        <div class="relative h-full">
          <div class="flex justify-between items-center border-b border-accent1-100 py-3 sm:py-4 sm:px-2 select-none">
            <UiTypographyP class="uppercase px-4 select-none"><span class="font-bold"><slot name="title" /></span></UiTypographyP>
            <button @click="emitCloseDialogEvent()" class="block outline-none border-none p-2 cursor-pointer hover:bg-primary hover:text-white text-secondary bg-accent-100 transition duration-300">
              <UiIconsClose class="h-5 w-5" />
            </button>
          </div>
          
          <div class="px-4 md:px-6 py-5 " :class="(footerButtons ? 'h-screen-80' : 'h-screen-85') + ' ' + (scrollable ? 'overflow-y-scroll' : 'overflow-hidden')">
            <slot />
          </div>
          
          <div v-show="footerButtons" class="absolute bottom-0 w-full select-none border-t border-accent-100">
            <div class="w-full flex justify-between">
              <button @click="emitCloseDialogEvent()" class="uppercase font-medium w-1/2 block px-2 py-3 text-center cursor-pointer bg-white hover:bg-accent-400 hover:text-white transition duration-500">
                {{cancelText}}
              </button>
              <button @click="emitOkEvent()" class="uppercase text-white font-medium w-1/2 block px-2 py-3 text-center cursor-pointer bg-secondary hover:bg-primary transition duration-500">
                {{okText}}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </transition>
    
  </aside>
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
