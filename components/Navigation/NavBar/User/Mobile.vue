<template>
  <div :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="z-100 w-full overflow-y-scroll fixed h-screen left-0 top-[67px] duration-150 ease-in-out bg-white md:hidden px-6 py-5">
    <div class="py-3">
      <ul v-if="!signedIn" class="flex flex-col gap-3">
        <li>
          <UiButtonsSecondary>Sign In</UiButtonsSecondary>
        </li>
        <li>
          <UiButtonsPrimary>Sign Up</UiButtonsPrimary>
        </li>
      </ul>

      <ul v-if="signedIn" class="flex flex-col gap-3">
        <li v-if="isSeller">
          <UiButtonsTab @clicked="$router.push({name: 'username-selling', params: {username: 'username'}})" class="w-full text-left">Switch to Selling</UiButtonsTab>
        </li>
        <li>
          <UiButtonsTab class="flex gap-3 items-center justify-start w-full" :flexdisplay="true" @clicked="$emit('cartClicked')">
            Cart
          </UiButtonsTab>
        </li>
        <li>
          <UiButtonsTab :to="{name: 'username-buying-dashboard', params: {username: username}}" class="w-full text-left">Dashboard</UiButtonsTab>
        </li>
        <li>                  
          <UiButtonsTab :to="{name: 'username-profile', params: {username: username}}" class="w-full text-left">Profile</UiButtonsTab>
        </li>
        <li>                  
          <UiButtonsTab :to="{name: 'username-buying-dashboard', params: {username: username}}" class="w-full text-left">Orders</UiButtonsTab>
        </li>
        <li>
          <UiButtonsTab class="w-full text-left">Log out</UiButtonsTab>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    menu_revealed: false,
    signedIn: {
      type: Boolean,
      default: false
    },
    isSeller: {
      type: Boolean,
      default: false
    },
    username: {
      default: 'testing',
      type: String
    },
    profileImagePath: String
  },
}
</script>