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
                    <template v-if="image">
                <img :src="image" :alt="name" class="w-full rounded-t-xl aspect-[4/3] object-cover" />
            </template>
            <div v-else class="w-full rounded-t-xl aspect-[4/3] bg-gray-200 flex flex-col items-center justify-center gap-2 text-center">
                <UiIconsCamera class="w-10 h-10 text-accent-400" />
                <span class="text-sm text-accent-500">No image available</span>
            </div>
            <div class="p-4">
                <UiTypographyP class="line-clamp-2 group-hover:text-primary duration-300">{{ name }}</UiTypographyp>
                <div v-if="discountPrice" class="uppercase bg-red-600 py-0.5 px-1 rounded-sm text-xs text-white w-fit mt-2">Sale</div>
                <p class="font-medium text-lg text-secondary">
                    ₦{{ formatPrice(price) }}
                    <span v-if="discountPrice" class="line-through text-sm text-accent-400 font-normal">
                        ₦{{ formatPrice(discountPrice) }}
                    </span>
                </p>
                <div class="flex items-center justify-between mt-3">
                    <ProductsRating :rating="rating" />
                    <div v-if="reviewCount || salesCount" class="text-xs text-accent-500 flex gap-2">
                        <span v-if="reviewCount">{{ reviewCount }} review{{ reviewCount !== 1 ? 's' : '' }}</span>
                        <span v-if="reviewCount && salesCount">•</span>
                        <span v-if="salesCount">{{ salesCount }} sold</span>
                    </div>
                </div>
            </div>
        </NuxtLink>
    </li>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useProductFilters } from '@/composables/useProductFilters';
import UiIconsCamera from '@/components/Ui/Icons/Camera.vue';

const router = useRouter();
const route = useRoute();
const productFilters = useProductFilters();

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
    skeleton: Boolean,
    rating: Number,
    reviewCount: Number,
    salesCount: Number
});

function formatPrice(price) {
    return new Intl.NumberFormat('en-NG').format(price);
}
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