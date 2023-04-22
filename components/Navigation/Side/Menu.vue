<template>
  <div @click="$emit('clicked')" :class="is_active ? 'bg-white' : 'hover:bg-accent-500 duration-500 ease-in-out'" class="group flex items-center px-8 w-full py-3 gap-3">

    <div :class="is_active ? 'text-primary' : 'text-[#909090] group-hover:text-accent-300' " class="w-7 h-7 2xl:w-8 2xl:h-8 duration-500 ease-in-out">
      <slot />
    </div>

    <div :class="is_active ? 'font-medium text-secondary' : 'font-normal text-[#909090] group-hover:text-accent-300' " class="text-base 2xl:text-lg duration-500 ease-in-out">{{menu_text}}{{ checkPath }}</div>
  </div>
</template>

<script>
export default {
  props :{
    menu_text: String,
    is_active: false,
  },

  computed: {
    checkPath(){
      const pathName = window.location.pathname.substring(1)
      const splitPathName = pathName.split('/')
      return splitPathName.includes('orders')
    }

  },

}
</script>

<style>

</style>