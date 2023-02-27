<template>
  <nav :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="z-100 w-full fixed h-screen left-0 top-[65.5px] duration-500 ease-in-out bg-white md:hidden">
    
  </nav>
</template>

<script>
export default {
  props: {
    menu_revealed: false
  }
}
</script>

<style>

</style>