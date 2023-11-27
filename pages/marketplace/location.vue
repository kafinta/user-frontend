<template>
  <LayoutsMarketplace>
    <!-- <UiCards v-if="locationsLoaded" v-for="item in locations" :key="item.id" :title="item.name" :backgroundImagePath="item.image" :urlPath="item.urlPath"/> -->
    <div v-if="locationsLoaded" v-for="item in locations" :key="item.id">
      <img  :src="'http://localhost:8000' + item.image" alt="">
    </div>
    <div v-else class="flex items-center justify-center">
      <UiIconsLoading class="text-primary h-10 w-10" />
    </div>
  </LayoutsMarketplace>
</template>
<script setup>
import { onMounted, ref } from "vue";

const locationsLoaded = ref(false)
let locations = []

const getLocations = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')

  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/locations/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        locations = useState('locations', () => res.response._data).value
        console.log(locations)
        locationsLoaded.value = true
      }
    },
  })
};

onMounted(() => {
  getLocations();
})
</script>