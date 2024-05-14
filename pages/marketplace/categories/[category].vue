<template>
  <LayoutsMarketplace>
    <Container>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        <li v-if="subcategoriesLoaded" v-for="subcategory in subcategories" :key="subcategory.id">
          <UiCards @clicked="chooseSubcategory(subcategory)" :title="subcategory.name" :backgroundImagePath="'http://localhost:8000' + subcategory.image" class="w-full"/>
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
const { query } = useQuery();
export default {
  data(){
    return {
      subcategoriesLoaded : false,
    }
  },

  methods: {
    ...mapActions(useFilters, { 
      selectCategory: 'selectCategory'
    }),

    chooseSubcategory(subcategory){
      query.subcategory=subcategory.name;
      this.$router.push({name: 'marketplace-products', query})
    },
  },
  computed: {
    ...mapState(useFilters, {
      subcategories: 'getSubcategories',
    })
  },

  mounted(){
    this.subcategoriesLoaded = true;
  }
}
</script>
<script setup>

</script>