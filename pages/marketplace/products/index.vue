<template>
  <LayoutsMarketplace>
    <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <aside>

      </aside>
      <ul>
        <li v-for="item in 30"></li>
      </ul>
    </div>
  </LayoutsMarketplace>
</template>
<script lang="ts" setup>
const getCategories = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')

  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/categories/7', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        const thecategories = useState('categories', () => res.response._data)
        const categories = thecategories.value
        // isLoading.value = true
      }
    },
  })
};
</script>