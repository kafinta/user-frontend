<template>
  <div class="w-full relative">
    <transition name="fade">
      <div @click="toggleSearchBox" v-show="searchBoxState" class="h-screen bg-secondary bg-opacity-50 fixed w-full z-120 cursor-pointer"></div>
    </transition>

    <transition>
      <div class="fixed w-full z-130 top-24 md:top-32">
        <form v-show="searchBoxState" class="max-w-3xl mx-auto">
          <div class="px-4 sm:px-6">
            <div
              class="w-full bg-white border border-primary dark:border-accent1-500 dark:bg-accent1-700 flex justify-center items-center px-3">
              <UiIconsSearch class="p-2 w-10 h-10" :class="gold_search_icon ? 'text-primary' : 'text-secondary'" />
              <input v-model="search_text" type="text" @focus="focus()"
                class="border text-sm outline-none border-none ring-0 focus:outline-none  rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out h-full w-full px-3 py-4 md:py-6" ref="input"
                placeholder="Search for products, artisans services..." />

              <div @click="toggleSearchBox" class="flex cursor-pointer text-sm items-center ">
                <UiIconsClose class="w-5 h-5 text-secondary" />
              </div>
            </div>

            <!-- <SearchSuggestionWrapper>

              <SearchSuggestionLabel location='Categories' />

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                <SearchSuggestionItem v-for="item in 6" :key="item">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit adipisicing
                </SearchSuggestionItem>
              </div>

              <SearchSuggestionLabel location='Audio' />

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                <SearchSuggestionItem v-for="item in 22" :key="item">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit adipisicing
                </SearchSuggestionItem>
              </div>

            </SearchSuggestionWrapper> -->
          </div>
        </form>
      </div>

    </transition>

  </div>


</template>

<script>
// import { mapGetters, mapActions } from 'vuex';
export default {
  props: {
    searchBoxState: Boolean
  },

  data() {
    return {
      search_text: '',
      gold_search_icon: false
    }
  },

  methods: {
    // ...mapActions({
    //   toggleSearchBox: "search/toggleSearchBox",
    // }),

    clearSearchText() {
      this.search_text = ''
    },

    toggleSearchBox(){
      this.$emit("toggleSearchBox")
    },

    focus() {
      this.$refs.input.focus()
      this.gold_search_icon = true
    },
  },


  // computed: {
  //   ...mapGetters({
  //     searchBoxState: "search/getSearchBox"
  //   }),
  // },

}
</script>
