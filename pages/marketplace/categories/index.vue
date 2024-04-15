<template>
  <LayoutsMarketplace>
    <Container>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        <li v-if="categoryLoaded" v-for="item in categories" :key="item.id">
          <UiCards @clicked="selectCategory(item); query.category=item.name; $router.push({name: 'marketplace-categories-category', params: {category: item.name}})" :title="item.name" :backgroundImagePath="'http://localhost:8000' + item.image" class="w-full"/>
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

    toggleSub(){
      this.toggleSubcategories = !this.toggleSubcategories
    },

    chooseCategory(category){
      this.selectCategory(category);
      this.categoryName = category.name
      query.category = category.name;
      this.$router.push({name: '', query})
      if (this.subcategory != []) {
        this.toggleSub()
        this.subcategoryLoaded = true
      }
    },

    chooseSubcategory(){
      query.subcategory = item.name; 
      $router.push({name: 'marketplace-products', query});
    },

    chooseLocation(){
      query.location = location.name;
      $router.push({name: 'marketplace-products', query});
    }
  },
  computed: {
    ...mapState(useFilters, {
      categories: 'getCategories',
      subcategory: 'getSubcategory'
    })
  },
  created(){
    this.getCategories();
    this.categoriesLoaded = true;
  }
}
</script>