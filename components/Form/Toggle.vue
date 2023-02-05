<template>
  <div>
    <!-- Reveal -->
    <button @click="revealPassword" :class="is_hidden ? 'block' : 'hidden' ">
      <svg class="text-accent1-600 w-4 hover:text-accent2-700 duration-500 ease-in-out" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
        <g>
          <path d="M27,7.5l221,221l-19.6,19.6l-45.4-45.4c-16.8,9-35.2,13.5-55.2,13.5c-26.2,0-50.3-8-72.4-23.9
          c-22.5-16-40.9-37.4-55.2-64.5c6.1-11,13.9-22.1,23.3-33.1c9-11.5,17.6-20.1,25.8-25.8L7.4,27.1L27,7.5z M186.6,127.8
          c0-16.4-5.7-30.3-17.2-41.7C158,74.6,144,68.9,127.7,68.9l-26.4-26.4c10.2-2,19-3.1,26.4-3.1c26.6,0,51.2,8.2,73.7,24.6
          c22.1,16.4,40.1,37.6,54,63.8c-2.5,5.3-6.3,11.9-11.7,19.6c-5.3,7.8-10.8,14.7-16.6,20.9L186.6,127.8z M127.7,186.7
          c11,0,21.3-2.9,30.7-8.6l-17.8-17.8c-4.1,1.2-8.4,1.8-12.9,1.8c-9.4,0-17.4-3.3-23.9-9.8c-7-7-10.4-15.1-10.4-24.6
          c0-3.7,0.8-7.8,2.5-12.3L77.3,97.1c-5.7,9.4-8.6,19.6-8.6,30.7c0,16.4,5.7,30.3,17.2,41.7C97.4,181,111.3,186.7,127.7,186.7z"/>
        </g>
      </svg>
    </button>

    <button @click="hidePassword" :class="is_hidden ? 'hidden' : 'block' " >
      <svg class="text-accent1-600 w-4 hover:text-accent2-700 duration-500 ease-in-out" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
        <path d="M49.2,74.2c-18.1,13.3-33.1,31-44.7,50.2c-1.4,2.4-2.9,4.9-3,7.7c-0.2,3.4,1.6,6.6,3.3,9.5c14,23.3,32.4,44.3,55.2,59 s50.3,22.9,77.4,20.5c32.3-2.9,61.8-20.7,85-43.3c10.2-9.9,19.4-20.9,27.4-32.6c2.1-3.1,4.3-6.5,4.3-10.3c0-3.2-1.5-6.3-3.1-9.1 c-17.1-30.8-43.5-57.1-76-70.7s-71.3-13.5-102.2,3.5 M127.9,192.2c-3.5,0-6.9-0.3-10.3-0.9c-10.2-1.6-19.2-5.8-27.2-12.5 c-6-4.9-11-11-14.7-17.8c0-0.1-0.1-0.1-0.1-0.2c-4.5-8.3-7-17.9-7-28c0-32.8,26.6-59.4,59.4-59.4c32.8,0,59.4,26.6,59.4,59.4 S160.7,192.2,127.9,192.2z"/>
        <circle cx="127.8" cy="133.1" r="30.3"/>
      </svg>
    </button>

  </div>
</template>

<script>
export default {
  data(){
    return{
      is_hidden: true
    }
  },

  methods: {
    revealPassword(){
      this.is_hidden = false
      this.$emit("revealPassword")
    },

    hidePassword(){
      this.is_hidden = true
      this.$emit("hidePassword")
    }
  }
}
</script>

<style>

</style>