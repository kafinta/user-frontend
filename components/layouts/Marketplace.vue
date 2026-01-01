<template>
  <div class="bg-white">
    <NavigationNavBar
      :keep_button_hovered="search_button_hovered"
      @toggleSearchBox="toggleSearch()"
      :showCart="true"
      :showMarketplaceLink="false"
    />
    <Search @toggleSearchBox="toggleSearch()" :searchBoxState="searchBox" />
    <div class="mt-16 mb-8 py-6 min-h-screen">
      <slot/>
    </div>
    <NavigationFooter/>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const searchBox = ref(false)
const search_button_hovered = ref(false)

function toggleSearch() {
  searchBox.value = !searchBox.value
  search_button_hovered.value = !search_button_hovered.value
}
</script>
