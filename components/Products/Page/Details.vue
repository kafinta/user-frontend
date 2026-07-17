<template>
  <div class="col-span-1 lg:col-span-2">
    <template v-if="isLoading">
      <UiSkeleton height="2.5rem" class="mb-3 full" />
      <UiSkeleton height="1.5rem" class="mb-2 full" />
      <UiSkeleton height="1.5rem" class="mb-2 full" />
      <UiSkeleton height="2rem" class="mb-4 full" />
      <UiSkeleton height="3rem" class="mb-4 full" />
      <UiSkeleton height="2.5rem" class="w-full" />
    </template>
    <template v-else>
      <UiBreadcrumbs :model="breadcrumbItems" />
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span v-if="product?.category?.name" class="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-secondary">
          {{ product.category.name }}
        </span>
        <span v-if="product?.location?.name" class="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-secondary">
          {{ product.location.name }}
        </span>
        <span v-if="product?.subcategory?.name" class="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-secondary">
          {{ product.subcategory.name }}
        </span>
      </div>

      <UiTypographyH2 class="mt-3">{{ product?.name || 'N/A' }}</UiTypographyH2>
      <UiTypographyP class="mt-2 text-accent-500 flex flex-wrap items-center gap-2">
        <span>Listed by</span>
        <UiButtonsSecondary>{{ product?.user?.name || 'Seller' }}</UiButtonsSecondary>
      </UiTypographyP>

      <div class="flex flex-wrap items-center gap-3 my-4">
        <ProductsReviewStars :review="Number(product?.rating || product?.average_rating || 0)" />
        <UiTypographyP class="text-sm text-accent-500">
          {{ Number(product?.review_count || product?.reviews_count || 0) }} review{{ Number(product?.review_count || product?.reviews_count || 0) !== 1 ? 's' : '' }}
        </UiTypographyP>
      </div>

      <div class="rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
        <div class="flex items-end gap-3 flex-wrap">
          <UiTypographyH2 class="m-0">
            ₦{{ formatPrice(product?.price) }}
          </UiTypographyH2>
          <UiTypographyP v-if="product?.previous_price && product?.previous_price !== product?.price" class="text-accent-400 line-through">
            ₦{{ formatPrice(product?.previous_price) }}
          </UiTypographyP>
          <span v-if="product?.discount || (product?.previous_price && product?.previous_price > product?.price)" class="inline-flex items-center rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Sale
          </span>
        </div>
        <UiTypographyP v-if="product?.discount || (product?.previous_price && product?.previous_price > product?.price)" class="mt-2 text-sm text-red-600">
          {{ product?.discount || Math.round(((Number(product?.previous_price || 0) - Number(product?.price || 0)) / Number(product?.previous_price || 1)) * 100) }}% off
        </UiTypographyP>
      </div>

      <div v-if="product?.description" class="mt-5 rounded-xl border border-accent-200 bg-accent-50 p-4 text-sm text-secondary">
        {{ product.description }}
      </div>

      <div v-if="product?.manage_stock" class="mt-4 text-sm text-accent-500">
        Stock available: <span class="font-medium text-secondary">{{ product?.stock_quantity ?? 0 }}</span>
      </div>

      <hr class="mt-5" />
      <form @submit.prevent="handleAddToCart" class="grid gap-5 mt-5">
        <div class="flex gap-5 items-end">
          <FormQuantityInput v-model="quantity" class="col-span-2" />
          <FormButton :loading="isAddingToCart" :disabled="isAddingToCart" class="col-span-3 gap-5 h-[46px] items-center">
            <UiIconsCart class="w-5 h-5 block" />{{ isAddingToCart ? 'Adding...' : 'Add to cart' }}
          </FormButton>
        </div>
      </form>
    </template>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useCartApi } from '~/composables/useCartApi'
import { useAppToast } from '~/utils/toastify'
import ProductsReviewStars from '~/components/Products/Review/Stars.vue'

const props = defineProps({
  product: Object,
  isLoading: Boolean
});

const { addToCart } = useCartApi()
const toast = useAppToast()

const quantity = ref(1)
const isAddingToCart = ref(false)

const breadcrumbItems = computed(() => {
  if (!props.product) return []

  const items = []

  // Add location if available
  if (props.product.location?.name) {
    items.push({
      label: props.product.location.name,
      route: {
        path: '/marketplace/locations',
        query: { location: props.product.location.slug }
      }
    })
  }

  // Add category if available
  if (props.product.category?.name) {
    items.push({
      label: props.product.category.name,
      route: {
        path: '/marketplace/categories',
        query: {
          ...(props.product.location?.slug && { location: props.product.location.slug }),
          category: props.product.category.slug
        }
      }
    })
  }

  // Add subcategory if available
  if (props.product.subcategory?.name) {
    items.push({
      label: props.product.subcategory.name,
      route: {
        path: '/marketplace/subcategories',
        query: {
          ...(props.product.location?.slug && { location: props.product.location.slug }),
          ...(props.product.category?.slug && { category: props.product.category.slug })
        }
      }
    })
  }

  // Add Products page
  items.push({
    label: 'Products',
    route: {
      path: '/marketplace/products',
      query: {
        ...(props.product.location?.slug && { location: props.product.location.slug }),
        ...(props.product.category?.slug && { category: props.product.category.slug }),
        ...(props.product.subcategory?.slug && { subcategory: props.product.subcategory.slug })
      }
    }
  })

  // Add current product as active item
  items.push({
    label: props.product.name,
    active: true
  })

  return items
})

function formatPrice(value) {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value || 0))
}

async function handleAddToCart() {
  if (!props.product || !props.product.id) {
    toast.error('Product information is missing')
    return
  }

  isAddingToCart.value = true
  try {
    await addToCart(props.product.id, quantity.value, undefined, props.product)
    quantity.value = 1
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    isAddingToCart.value = false
  }
}
</script>