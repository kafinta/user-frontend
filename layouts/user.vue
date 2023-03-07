<template>
  <div>
    <NavigationNavBarUserSearch :messages="true" :notifications="true" :signedIn="true" :earning="99" class="border-b border-accent-100">
      <div class="relative">
        <UserProfilePicture artisan="Quadri" />
        <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="online_presence" :is_displayed="true"/>
      </div>
    </NavigationNavBarUserSearch>
      <div class="px-6 md:px-8 lg:px-10 py-6 max-w-7xl mx-auto mt-20 lg:mt-24">
        <Nuxt/>
        <slot />
      </div>
    <NavigationFooter />
  </div>
</template>

<script>
export default {
  data() {
    return {
      online_presence: true
    }
  },
}
</script>

<style>

</style>