<template>
  <LayoutsMarketplace>
    <Container>
      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        <li v-if="locationsLoaded" v-for="item in locations" :key="item.id">
          <UiCards @clicked="query.location=item.name; $router.push({name: 'marketplace-products', query})" :title="item.name" :backgroundImagePath="'http://localhost:8000' + item.image" class="w-full"/>
        </li>
        <li v-else class="flex items-center justify-center">
          <UiIconsLoading class="text-primary h-10 w-10" />
        </li>
      </ul>
    </Container>
  </LayoutsMarketplace>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useQuery } from "@/composables/useQuery";
const {query} = useQuery() 
const locationsLoaded = ref(false)
let locations = []

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
  getLocations();
})
</script>