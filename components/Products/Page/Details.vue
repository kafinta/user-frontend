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
      <UiTypographyH2 class="mt-2">{{ product?.name || 'N/A' }}</UiTypographyH2>
      <UiTypographyP class="mt-2">Listed by 
        <UiButtonsSecondary>{{ product?.user?.name || 'Seller' }}</UiButtonsSecondary>
      </UiTypographyP>
      <div class="flex gap-2 items-center my-3">
        <div class="flex gap-0.5 items-center">
          <UiIconsStar v-for="star in 5" :key="star" class="w-5 h-5 text-primary" />
        </div>
        <UiTypographyP>{{ product?.review_count || 0 }} reviews</UiTypographyP>
      </div>
      
      <div class="mt-5 bg-red-600 text-sm font-medium py-1 px-2 text-white rounded-[4px] w-fit uppercase">Sale</div>
      <UiTypographyH2 class="mt-2">
        ${{ product?.price || 0 }} 
        <span class="text-lg line-through text-accent-300">${{ product?.previous_price || (product?.price) }}
        </span>
        <span class="text-lg text-red-600 ml-2">
          {{ product?.discount || 0 }}% off
        </span>
      </UiTypographyH2>
      <hr class="mt-5" />
      <form class="grid gap-5 mt-5">
        <div class="flex gap-5 items-end">
          <FormQuantityInput v-model="quantity" class="col-span-2" />
          <FormButton class="col-span-3 gap-5 h-[46px] items-center">
            <UiIconsCart class="w-5 h-5 block" />Add to cart
          </FormButton>
        </div>
      </form>
    </template>
  </div>
</template>
<script setup>
const props = defineProps({
  product: Object,
  isLoading: Boolean
});


const quantity = ref(1)

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
</script>