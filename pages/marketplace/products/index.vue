<template>
  <LayoutsMarketplace>
    <div class="flex justify-between items-center">
      <UiButtonsPrimary @clicked="openDialog=true" class="lg:hidden">
        <div class="flex gap-5">
          <p>Filters</p>
          <UiIconsFilter class="w-5 flex m-0" />
        </div>
      </UiButtonsPrimary>
    </div>

    <div class="grid lg:grid-cols-4 2xl:grid-cols-5 gap-5 mt-10">
      <aside class="hidden lg:block bg-white overflow-y-scroll border-r border-accent">
        <UiTypographyP class="mb-2">Filters</UiTypographyP>
        <Accordion>
          <AccordionItem container_class=""
            trigger_class=" border-b border-accent py-2 px-3" active>
            <template #accordion-trigger >
              <UiTypographyP><strong>Category</strong></UiTypographyP>
            </template>

            <template #accordion-content>
              <div v-if="categoryLoaded" class="mt-3 flex gap-2 flex-wrap text-left">
                <UiButtonsTertiary :class="categoryActive ? 'text-primary ml-4' : ''" @clicked="$router.push({name: '', query: {category: category.name}}); selectCategory(category.name)" class="text-left text-secondary hover:text-primary py-2 duration-500 ease-in-out" v-for="category in categories" :key="category.id">{{category.name}}</UiButtonsTertiary>
              </div>

              <div v-else class="col-span-2 flex items-center justify-center">
                <UiIconsLoading class="text-primary h-10 w-10" />
              </div>
            </template>
          </AccordionItem>
        </Accordion>
      </aside>

      <div class="lg:col-span-3 2xl:col-span-4 w-full">
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
          <UserProductsMinimal v-for="item in 30" :key="item" />
        </div>
          <div class="join gap-1 mt-10 justify-center w-full">
            <button class="join-item btn">«</button>
            <button class="join-item btn btn-active">1</button>
            <button class="join-item btn">»</button>
          </div>
      </div>

    </div>

    <ModalsDrawer okText="Apply" :scrollable="true" :footerButtons="true" :openDialog="openDialog" @closeDialog="openDialog=false">
      <template #title>Filters</template>
      <div class="h-full">
        <Accordion class="">
        </Accordion>
      </div>
    </ModalsDrawer>
  </LayoutsMarketplace>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()


const openDialog = ref(false)
const categoryLoaded = ref(false)
const locations = []
let categories = []
const categoryActive = ref(false)

const selectCategory = () => {
  
}

const getCategories = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')

  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/categories/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        const allcategories = useState('categories', () => res.response._data)
        categories = allcategories.value
        categoryLoaded.value = true
      }
    },
  })
};

onMounted(() => {
  categoryLoaded.value = false
  getCategories();
})
</script>