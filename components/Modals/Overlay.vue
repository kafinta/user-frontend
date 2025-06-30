<template>
  <div>
    <!-- Backdrop -->
    <transition name="slide-fade">
      <div
        v-show="open"
        @click="emitCloseDialogEvent()"
        class="fixed inset-0 h-screen w-full bg-secondary bg-opacity-80 backdrop-blur-sm z-140 cursor-pointer"
      ></div>
    </transition>

    <!-- Modal -->
    <transition name="slide-fade">
      <div
        v-show="open"
        class="fixed top-1/2 left-1/2 w-full sm:w-2/3 lg:w-3/5 xl:w-1/3 bg-white z-150 rounded-xl -translate-x-1/2 -translate-y-1/2 shadow-lg border border-accent-200"
        role="dialog"
        aria-modal="true"
      >
        <div class="relative">
          <!-- Header -->
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

          <!-- Content -->
          <div class="p-6 grid gap-6 text-center place-items-center">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  open: Boolean
})
const emit = defineEmits(['closeOverlay'])
function emitCloseDialogEvent() {
  emit('closeOverlay')
}
</script>
