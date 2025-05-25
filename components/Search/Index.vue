<template>
  <div class="w-full relative">
    <transition name="fade">
      <div @click="toggleSearchBox" v-show="searchBoxState" class="h-screen bg-secondary bg-opacity-50 fixed w-full z-120 cursor-pointer"></div>
    </transition>

    <transition>
      <div class="fixed w-full z-130 top-[120px] md:top-32">
        <form @submit.prevent="search" v-show="searchBoxState" class="max-w-3xl mx-auto">
          <FormInputGroup>
            <FormInputGroupAddon>
              <UiIconsSearch class="p-2 w-10 h-10" :class="gold_search_icon ? 'text-primary' : 'text-secondary'" />
            </FormInputGroupAddon>
            <FormInputText placeholder="Search for products, artisans services..." id="search_input" type="text" v-model="search_text" fluid/>
            <FormInputGroupAddon clickable @click="toggleSearchBox">
              <div class="flex text-sm items-center ">
                <UiIconsClose class="w-5 h-5 text-secondary" />
              </div>
            </FormInputGroupAddon>
          </FormInputGroup>
          <div class="px-4 sm:px-6">
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

    search(){
      this.$router.push({name: 'marketplace-products', query: {query: this.search_text}})
    },

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
