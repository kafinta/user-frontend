<template>
  <div>
    <div class="border p-4">
      <div class="flex relative w-fit">
        <div>
          <div class="h-36 w-36 bg-slate-200 rounded-full mx-auto"></div>
        </div>
        <UserProfileOnlineStatus :is_online="true" class="absolute right-8 bottom-0"/>
      </div>
      <UiTypographyH3 class="text-center mt-4">Username</UiTypographyH3>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'seller',
}
</script>

<style>

</style>