<template>
  <aside class="lg:border-r lg:border-accent lg:pr-2">
    <UiTypographyP class="mb-2 hidden lg:block">Filters</UiTypographyP>
    <Accordion class="grid gap-5">
      <AccordionItem container_class="border border-accent-100 p-2 px-3 rounded-md"
        trigger_class="font-medium text-lg" active>
        <template #accordion-trigger >
          <h4>Category</h4>
        </template>

        <template #accordion-content content_class="px-3 py-2">
          <div :class="toggleSubcategories ? 'hidden' : 'block'" class="mt-3">
            <ul v-if="categoryLoaded" class="flex gap-2 flex-wrap text-left">
              <li v-for="category in categories" :key="category.id">
                <UiButtonsTertiary @clicked="selectCategory(category); query.category = category.name; $router.push({name: '', query});" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out">{{category.name}}</UiButtonsTertiary>
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
              <li v-for="subcategory in subcategories" :key="subcategory.id">
                <UiButtonsTertiary @clicked="query.subcategory = subcategory.name; $router.push({name: '', query}); selectCategory(subcategory)" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out">{{subcategory.name}}</UiButtonsTertiary>
              </li>
            </ul>
            <div v-else class="flex items-center justify-center">
              <UiIconsLoading class="text-accent-100 h-10 w-10" />
            </div>
          </div>

          <div :class="toggleSubcategories ? 'flex' : 'hidden'" class="mt-3 flex gap-2 flex-wrap text-left">

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
            <UiButtonsTertiary @clicked="query.location = location.name; $router.push({name: '', query}); console.log($route.query)" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out" v-for="location in locations" :key="location.id">{{location.name}}</UiButtonsTertiary>
          </div>

          <div v-else class="flex items-center justify-center">
            <UiIconsLoading class="text-accent-100 h-10 w-10" />
          </div>
        </template>
      </AccordionItem>
    </Accordion>
  </aside>
</template>
<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from 'vue-router'
import { useQuery } from "@/composables/useQuery";
const route = useRoute()
const router = useRouter()
const query = useQuery()
const categoryLoaded = ref(false)
const subcategoryLoaded = ref(false)
const locationsLoaded = ref(false)
const toggleSubcategories = ref(false)
let locations = []
let categories = []
let categoryName = []
let subcategories = []
const getCategories = async () => {
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/categories/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        categories = res.response._data
        categoryLoaded.value = true
      }
    },
  })
};

const selectCategory = async (category) => {
  const { pending, data, error } = await useCustomFetch(`api/categories/${category.id}/subcategories/`, {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        categoryName = res.response._data.category.name
        subcategories = res.response._data.subcategories
        subcategoryLoaded.value = true
      }
    },
  })

  toggleSub()
}

function toggleSub() {
  toggleSubcategories.value = !toggleSubcategories.value
}

const getLocations = async () => {
  const { pending, data: locationData, error: user_auth_error } = await useCustomFetch('api/locations/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        locations = useState('locations', () => res.response._data).value
        locationsLoaded.value = true
      }
    },
  })
};

onBeforeMount(() => {
  getCategories();
  getLocations();
})
</script>