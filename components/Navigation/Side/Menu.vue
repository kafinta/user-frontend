<template>
  <div :class="is_active ? 'dark:bg-accent1-800 bg-accent2-700' : 'dark:hover:bg-transparent hover:bg-accent2-300 duration-700 ease-in-out'" class="group flex items-center px-10 md:px-8 lg:px-6 2xl:px-8 w-full py-3 ">

    <div :class="is_active ? 'dark:text-accent2-700 text-accent1-50 duration-700 ease-in-out' : 'duration-700 ease-in-out dark:text-accent1-400 text-accent2-700 group-hover:text-accent1-700 dark:group-hover:text-accent1-50' " class="w-7 2xl:w-8">
      <slot />
    </div>

    <div :class="is_active ? 'font-medium text-accent1-50 dark:text-white duration-700 ease-in-out' : 'font-normal text-accent1-700 dark:text-accent1-400 group-hover:text-accent1-700 dark:group-hover:text-accent1-50 duration-700 ease-in-out' " class="mx-4 text-lg 2xl:text-xl">{{menu_text}}</div>
  </div>
</template>

<script>
export default {
  props :{
    is_active: Boolean,
    menu_text: String
  }
}
</script>

<style>

</style>