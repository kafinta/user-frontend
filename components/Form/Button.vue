<template>
  <button
    type="submit"
    class="py-2 px-5  hover:bg-primary text-white font-medium w-full text-base 2xl:text-xl justify-center duration-500 ease-in-out rounded-md active:bg-primary focus:bg-primary" 
    :disabled="loading || disabled" :class="loading ? 'bg-primary' : 'bg-secondary'">

    <div class="flex items-center justify-center uppercase">
      <div v-if="loading"  >
        <div class="justify-center flex">
          <Loading class="w-7"></Loading>
        </div>
      </div>
      <div v-if="!loading">
        <slot />
      </div>
    </div>
  </button>
</template>

<script>
import Loading from '@/components/Ui/Icons/Loading.vue'
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
    components: { Loading }
}
</script>

<style>
</style>