<template>
  <LayoutsMarketplace>
    <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      <li v-if="categoryLoaded" v-for="item in subcategories" :key="item.id">
        <UiCards @clicked="$router.push({name: 'marketplace-products', query: {category: item.name}})" :title="item.name" :backgroundImagePath="'http://localhost:8000' + item.image" class="w-full"/>
      </li>
      <li v-else class="flex items-center justify-center">
        <UiIconsLoading class="text-primary h-10 w-10" />
      </li>
    </ul>
  </LayoutsMarketplace>
</template>
<script setup>
import { useSelectCategory } from "@/composables/useSelectCategory";
import { onMounted, ref } from "vue";
const categoryLoaded = ref(false)
const {id} = useSelectCategory() 
let subcategories  = []
const getSubcategories = async () => {
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch(`api/categories/${id.value}/subcategories/`, {
    method: 'GET',
    onResponse(res) {
      console.log(res.response)
      if (res.response.status == 200) {
        subcategories = useState('subcategories', () => res.response._data.subcategories).value
        categoryLoaded.value = true
      } else {
      }
    },
  })
};

onMounted(() => {
  console.log(id.value)
  getSubcategories();
})
</script>