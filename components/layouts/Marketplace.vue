<template>
  <div class="bg-white">
    <NavigationNavBarUserSearch @cartClicked="toggleCart"/>
    <div class="mt-16 px-6 mb-8 py-6 min-h-screen">
      <slot/>
    </div>
    <ModalsDrawer :openDialog="openCart" @closeDialog="toggleCart()" :footerButtons="true" :scrollable="true" okText="Checkout">
      <template #title>My Cart</template>
      <ul class="grid gap-5">
        <li class="p-5 border border-accent-100 rounded-md bg-accent-100 h-48" v-for="item in 5">

        </li>
      </ul>
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
