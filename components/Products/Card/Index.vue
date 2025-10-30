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
    <li v-else class="border border-accent-200 rounded-xl list-none flex flex-col h-full">
        <NuxtLink :to="`/marketplace/products/${slug}`" class="group block flex-1">
            <img :src="image" :alt="name" class="w-full rounded-t-xl aspect-[4/3]" />
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
                    <ProductsRating :rating="5" />
                </div>
            </div>
        </NuxtLink>
        <div class="p-4 pt-0">
            <button
                @click="handleAddToCart"
                :disabled="isAddingToCart"
                class="w-full px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
            </button>
        </div>
    </li>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductFilters } from '@/composables/useProductFilters';
import { useCartApi } from '@/composables/useCartApi';
import { useAppToast } from '~/utils/toastify';

const router = useRouter();
const route = useRoute();
const productFilters = useProductFilters();
const { addToCart } = useCartApi();
const toast = useAppToast();

const isAddingToCart = ref(false);

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
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

function formatPrice(price) {
    return new Intl.NumberFormat('en-NG').format(price);
}

async function handleAddToCart() {
    isAddingToCart.value = true;
    try {
        await addToCart(props.id, 1);
    } catch (error) {
        console.error('Error adding to cart:', error);
    } finally {
        isAddingToCart.value = false;
    }
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