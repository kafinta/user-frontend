<template>
  <div class="bg-white">
    <NavigationNavBarUserSearch @cartClicked="toggleCart"/>
    <div class="mt-16 px-6 mb-8 py-6 min-h-screen">
      <slot/>
    </div>
    <ModalsDrawer :openDialog="openCart" @closeDialog="toggleCart()">
    </ModalsDrawer>
    <NavigationFooter/>
  </div>
</template>
<script>
export default {
  data(){
    return {
      openCart: false,
    }
  },

  methods: {
    toggleCart(){
      this.openCart = !this.openCart
    }
  }
}
</script>
