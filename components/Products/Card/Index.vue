<template>
    <li v-if="skeleton" class="border border-accent-200 rounded-xl cursor-pointer list-none">
        <UiSkeleton class="rounded-t-xl aspect-[4/3] bg-accent-200 w-full" height="" />
        <div class="p-4">
            <UiSkeleton height="1.5rem" class="mb-1" />
            <UiSkeleton height="1.5rem" class="mb-1" />
            <UiSkeleton height="2rem" class="mt-2 max-w-36"/>
            <div class="flex items-center justify-between mt-3">
                <ProductsRating :loading="true" />
            </div>
        </div>
    </li>
    <li v-else class="border border-accent-200 rounded-xl cursor-pointer list-none">
        <NuxtLink :to="`/marketplace/products/${slug}`" class="group block">
            <img :src="image" :alt="name" class="w-full rounded-t-xl aspect-[4/3]" />
            <div class="p-4">
                <UiTypographyP class="line-clamp-2 group-hover:text-primary duration-300">{{ name }}</UiTypographyp>
                <div v-if="discountPrice" class="uppercase bg-red-600 py-0.5 px-1 rounded-sm text-xs text-white w-fit mt-2">Sale</div>
                <p class="font-medium text-lg text-secondary">
                    ${{ price ?? '0.00' }}
                    <span v-if="discountPrice" class="line-through text-sm text-accent-400 font-normal">
                        ${{ discountPrice }}
                    </span>
                </p>
                <div class="flex items-center justify-between mt-3">
                    <ProductsRating :rating="5" />
                </div>
            </div>
        </NuxtLink>
    </li>
</template>
<script setup>
import { watchEffect, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductFilters } from '@/composables/useProductFilters';

const router = useRouter();
const route = useRoute();
const productFilters = useProductFilters();

function shouldRedirect() {
  // No subcategory selected and no search query
  return !productFilters.selectedSubcategoryDetails && !route.query.query;
}

// Redirect on mount and whenever dependencies change
watchEffect(() => {
  if (shouldRedirect()) {
    router.replace('/marketplace/categories');
  }
});

const props = defineProps({
    slug: {
        type: String,
        default: 'product-slug'
    },
    name: {
    type: String,
    default: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis iusto modi deserunt quis labore dignissimos provident facere, consectetur eveniet magnam vero quam nihil quibusdam sed nobis, in, necessitatibus nam fugit.'
    },
    price: Number,
    discountPrice: Number,
    image: String,
    skeleton: Boolean
});
</script>
<style scoped>
/* If Tailwind's line-clamp-2 is not available, use this fallback: */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>