<template>
  <button
    type="submit"
    class="py-2 px-5 flex w-full text-white font-medium text-base 2xl:text-lg justify-center duration-500 ease-in-out rounded-md focus:bg-primary " 
    :disabled="loading || disabled" :class="loading ? 'bg-primary': 'bg-secondary hover:bg-primary'">

    <div class="flex items-center justify-center uppercase">
      <div v-if="loading"  >
        <div class="justify-center flex">
          <UiIconsLoading class="w-7"></UiIconsLoading>
        </div>
      </div>
      <div v-if="!loading">
        <slot />
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: "LoadingButton",
  props: {
      loading: Boolean,
      disabled: Boolean,
      loadingText: {
          default: "Authenticating",
          type: String
      },
  },
}
</script>

<style>
</style>