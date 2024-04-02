<template>
  <aside class="lg:border-r lg:border-accent lg:pr-2">
    <UiTypographyP class="mb-2 hidden lg:block">Filters</UiTypographyP>
    <Accordion class="grid gap-5">

    <AccordionItem container_class="p-2 px-3 rounded-md border border-accent-100"
      trigger_class="font-medium text-lg">

      <template #accordion-trigger>
        <h4>Categories</h4>
      </template>

      <template #accordion-content content_class="px-3 py-2">
        <div :class="toggleSubcategories ? 'hidden' : 'block'" class="mt-3">
          <ul v-if="categoriesLoaded" class="flex gap-2 flex-wrap text-left">
            <li v-for="category in categories" :key="category.id">
              <UiButtonsTertiary @clicked="chooseCategory(category)" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out">{{category.name}}</UiButtonsTertiary>
            </li>
          </ul>
          <div v-else class="flex items-center justify-center">
            <UiIconsLoading class="text-accent-100 h-10 w-10" />
          </div>
        </div>

        <div :class="toggleSubcategories ? 'block' : 'hidden'" class="mt-3 px-5">
          <UiButtonsSecondary @clicked="toggleSub()" class="flex gap-2 items-center mb-5">
            <span><UiIconsArrow class="w-4" /></span>
            {{ categoryName }}
          </UiButtonsSecondary>
          <ul v-if="subcategoryLoaded" class="flex gap-2 flex-wrap text-left">
            <li v-for="item in subcategory" :key="subcategory.id">
              <UiButtonsTertiary @clicked="chooseSubcategory()" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out">{{item.name}}</UiButtonsTertiary>
            </li>
          </ul>
          <div v-else class="flex items-center justify-center">
            <UiIconsLoading class="text-accent-100 h-10 w-10" />
          </div>
        </div>
      </template>
    </AccordionItem>

    <AccordionItem container_class="border border-accent-100 p-2 px-3 rounded-md"
      trigger_class="font-medium text-lg">
      <template #accordion-trigger >
        <h4>Locations</h4>
      </template>

      <template #accordion-content content_class="px-3 py-2">
        <div v-if="locationsLoaded" class="mt-3 flex gap-2 flex-wrap text-left">
          <UiButtonsTertiary @clicked="chooseLocation()" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out" v-for="location in locations" :key="location.id">{{location.name}}</UiButtonsTertiary>
        </div>

        <div v-else class="flex items-center justify-center">
          <UiIconsLoading class="text-accent-100 h-10 w-10" />
        </div>
      </template>
    </AccordionItem>
    </Accordion>
  </aside>
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
      subcategoryLoaded : false,
      locationsLoaded : false,
      toggleSubcategories : false,
      categoryName : '',
    }
  },
  methods: {
    ...mapActions(useFilters, { 
      getCategories: 'fetchCategories',
      getLocations: 'fetchLocations',
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
      locations: 'getLocations',
      subcategory: 'getSubcategory'
    })
  },
  created(){
    this.getCategories();
    this.categoriesLoaded = true;
    this.getLocations();
    this.locationsLoaded = true;
  }
}
</script>