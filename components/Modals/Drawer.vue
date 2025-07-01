<template>
  <aside>
    <!-- Backdrop -->
    <transition name="slide-fade">
      <div @click="emitCloseDialogEvent()" v-show="openDialog" class="fixed inset-0 h-screen w-full bg-secondary bg-opacity-80 backdrop-blur-sm z-140 cursor-pointer"></div>
    </transition>
    <!-- Drawer Panel -->
    <transition name="slide-in-right">
      <div v-show="openDialog" class="fixed top-0 right-0 h-full w-3/5 md:w-1/3 xl:w-1/4 bg-white z-150 shadow-lg border border-accent-200 flex flex-col">
        <div class="flex justify-between items-center border-b border-accent-200 py-3 pl-6 pr-3">
          <UiTypographyP class="uppercase"><strong><slot name="title" /></strong></UiTypographyP>
          <button
            @click="emitCloseDialogEvent()"
            class="block outline-none border-none p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-secondary bg-accent-100 transition duration-300 focus:ring-2 focus:ring-primary"
            aria-label="Close dialog"
            type="button"
          >
            <UiIconsClose class="h-5 w-5" />
          </button>
        </div>
        <div class="p-6 grid gap-6 flex-1 overflow-y-auto">
          <slot />
        </div>
        <div v-show="footerButtons" class="border-t border-accent-200 p-4 flex gap-4">
          <button @click="emitCloseDialogEvent()" class="uppercase font-medium flex-1 px-2 py-3 text-center cursor-pointer bg-white hover:bg-accent-400 hover:text-white transition duration-500 rounded-md border border-accent-200">
            {{cancelText}}
          </button>
          <button @click="emitOkEvent()" class="uppercase text-white font-medium flex-1 px-2 py-3 text-center cursor-pointer bg-secondary hover:bg-primary transition duration-500 rounded-md">
            {{okText}}
          </button>
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

<style scoped>
.slide-in-right-enter-active, .slide-in-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-in-right-enter-from, .slide-in-right-leave-to {
  transform: translateX(100%);
}
</style>
