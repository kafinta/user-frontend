<template>
  <button :disabled="disabled" :class="disabled ? '' : is_active ? 'bg-white' : 'hover:bg-accent-500 duration-500 ease-in-out'" class="group flex items-center px-8 w-full py-3 gap-3">
    <div :class="disabled ? 'text-accent-400' : is_active ? 'text-primary' : 'text-[#909090] group-hover:text-accent-300' " class="w-7 h-7 2xl:w-8 2xl:h-8 duration-500 ease-in-out">
      <slot />
    </div>

    <div :class="disabled ? 'text-accent-400 ' : is_active ? 'font-medium text-secondary' : 'font-normal text-[#909090] group-hover:text-accent-300' " class="text-base 2xl:text-lg duration-500 ease-in-out">{{menu_text}}</div>
  </button>
</template>

<script>
export default {
  props :{
    menu_text: String,
    is_active: Boolean,
    isSeller: {
      type: Boolean,
      default: true
    }
  },

  data(){
    return {
      disabled: false
    }
  },

  mounted(){
    this.disabled = !this.isSeller
  }
}
</script>