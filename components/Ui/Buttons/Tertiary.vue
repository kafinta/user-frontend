<template>
  <button 
    @click="$emit('clicked')"
    class="py-2 px-5 text-secondary font-medium text-sm lg:text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md active:text-secondary border hover:text-primary hover:border-primary focus:border-primary focus:text-primary outline-none" 
    :class="[flexdisplay ? 'flex w-full text-center gap-3 items-center' : 'w-fit text-left']">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'UiIconsLoadingButton',
  props: {
    flexdisplay: {
      default: false,
      type: Boolean
    },
  },
}
</script>