<template>
  <LayoutsDashboard mode="seller" page_title="New Product">
    <div class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full relative">
      <!-- Progress Steps -->
      <div class="flex items-center">
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Publish Product</UiTypographyH3>
      <div v-if="isLoading" class="w-full flex justify-center py-8">
        <UiIconsLoading class="w-8 h-8" />
        <span class="ml-2 text-secondary">Publishing...</span>
      </div>
      <div v-else class="w-full">
        <div class="bg-white border border-accent-200 rounded-xl p-8 flex flex-col gap-6 items-center">
          <UiTypographyP class="mb-2 text-center">Review your product details and click below to publish.</UiTypographyP>
          <FormButton :loading="isLoading" class="w-64 mx-auto" @click="handlePublish">Publish Product</FormButton>
        </div>
      </div>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useProductApi } from '~/composables/useProductApi'
import { ref } from 'vue'
import UiTypographyH3 from '~/components/Ui/Typography/H3.vue'
import UiTypographyP from '~/components/Ui/Typography/P.vue'
import UiIconsLoading from '~/components/Ui/Icons/Loading.vue'
import FormButton from '~/components/Form/Button.vue'

const route = useRoute()
const router = useRouter()
const productApi = useProductApi()

const productSlug = route.params.slug
const isLoading = ref(false)

const handlePublish = async () => {
  isLoading.value = true
  // Fetch product by slug to get its id
  const response = await productApi.getProductBySlug(productSlug)
  const product = response?.data?.product || response?.data
  if (!product) {
    isLoading.value = false
    return
  }
  // Only publish when the user clicks the button
  const publishResponse = await productApi.publishProduct(product.id)
  isLoading.value = false
  if (publishResponse && publishResponse.status === 'success') {
    router.push({ path: `/${route.params.username}/selling/products` })
  }
}
</script> 