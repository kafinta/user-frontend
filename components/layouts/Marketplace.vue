<template>
  <div class="bg-white">
    <NavigationNavBarUserSearch :keep_button_hovered="search_button_hovered" @toggleSearchBox="toggleSearch()" @cartClicked="toggleCart" :signedIn="loggedIn" :isSeller="seller"/>
    <Search @toggleSearchBox="toggleSearch()" :searchBoxState="searchBox" />
    <div class="mt-16 mb-8 py-6 min-h-screen">
      <slot/>
    </div>
    <ModalsDrawer :openDialog="openCart" @closeDialog="toggleCart()" :footerButtons="true" :scrollable="true" okText="Checkout">
      <template #title>My Cart</template>
      <ul class="grid gap-5">
        <li class="p-5 border border-accent-200 rounded-md bg-accent-100 h-48" v-for="item in 5">

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
      searchBox: false,
      search_button_hovered: false,
      openCart: false,
      loggedIn: true,
      seller: true,
    }
  },

  methods: {
    toggleCart(){
      this.openCart = !this.openCart
    },

    toggleSearch (){
      this.searchBox = !this.searchBox;
      this.search_button_hovered = !this.search_button_hovered;
    }
  }
}
</script>
