<template>
  <LayoutsMarketplace>
    <Container>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        <li v-if="categoriesLoaded" v-for="category in categories" :key="category.id">
          <UiCards @clicked="chooseCategory(category)" :title="category.name" :backgroundImagePath="'http://localhost:8000' + category.image" class="w-full"/>
        </li>
        <li v-else class="flex items-center justify-center">
          <UiIconsLoading class="text-primary h-10 w-10" />
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script>
import { mapActions, mapState } from 'pinia'
import { useFilters } from "@/stores/filters";
import { useQuery } from "@/composables/useQuery";
const { query } = useQuery()
export default {
  data(){
    return {
      categoriesLoaded : false,
    }
  },
  methods: {
    ...mapActions(useFilters, { 
      getCategories: 'fetchCategories',
      selectCategory: 'selectCategory'
    }),

    chooseCategory(category){
      this.selectCategory(category);
      query.category = category.name;
      this.$router.push({name: 'marketplace-categories-category', params: {category: category.name}})
    },
  },
  computed: {
    ...mapState(useFilters, {
      categories: 'getCategories',
    })
  },
  created(){
    this.getCategories();
    this.categoriesLoaded = true;
  }
}
</script>