<template>
  <LayoutsMarketplace>
    <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      <li v-if="categoryLoaded" v-for="item in categories" :key="item.id">
        <UiCards @clicked="selectCategory(item); $router.push({name: 'marketplace-categories-category', params: {category: item.name}})" :title="item.name" :backgroundImagePath="'http://localhost:8000' + item.image" class="w-full"/>
      </li>
      <li v-else class="flex items-center justify-center">
        <UiIconsLoading class="text-primary h-10 w-10" />
      </li>
    </ul>
  </LayoutsMarketplace>
</template>
<script setup>
import { onMounted, ref } from "vue";
const categoryLoaded = ref(false)
let categories  = []

function selectCategory(item) {
  const selected = useState('selected_item', () => item.name)
}

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

onMounted(() => {
  getCategories();
})
</script>