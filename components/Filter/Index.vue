<template>
  <aside class="lg:border-r lg:border-accent lg:pr-2">
    <UiTypographyP class="mb-2 hidden lg:block">Filters</UiTypographyP>
    <Accordion class="grid gap-5">
      <AccordionItem container_class="border border-accent lg:border-none"
        trigger_class=" border-b border-accent py-2 px-3" active>
        <template #accordion-trigger >
          <UiTypographyP><strong>Category</strong></UiTypographyP>
        </template>

        <template #accordion-content content_class="px-3 py-2">
          <div v-if="categoryLoaded" class="mt-3 flex gap-2 flex-wrap text-left">
            <UiButtonsTertiary @clicked="query.category = category.name; $router.push({name: '', query}); selectCategory(category.name)" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out" v-for="category in categories" :key="category.id">{{category.name}}</UiButtonsTertiary>
          </div>

          <div v-else class="flex items-center justify-center">
            <UiIconsLoading class="text-accent-100 h-10 w-10" />
          </div>
        </template>
      </AccordionItem>

      <AccordionItem container_class="border border-accent lg:border-none"
        trigger_class=" border-b border-accent py-2 px-3">
        <template #accordion-trigger >
          <UiTypographyP><strong>Locations</strong></UiTypographyP>
        </template>

        <template #accordion-content content_class="px-3 py-2">
          <div v-if="categoryLoaded" class="mt-3 flex gap-2 flex-wrap text-left">
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
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const categoryLoaded = ref(false)
const locationsLoaded = ref(false)
let locations = []
let categories = []
const query = ref({})
const getCategories = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/categories/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        categories = useState('categories', () => res.response._data).value
        categoryLoaded.value = true
      } else {
      }
    },
  })
};

const getLocations = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/locations/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        locations = useState('locations', () => res.response._data).value
        locationsLoaded.value = true
      }
    },
  })
};

onMounted(() => {
  getCategories();
  getLocations();
})
</script>