<template>
  <div class="flex gap-4 p-4 border border-accent-200 rounded-lg bg-white hover:shadow-md transition-shadow">
    <!-- Product Image -->
    <div class="flex-shrink-0 w-24 h-24">
      <img
        v-if="productImage"
        :src="productImage"
        :alt="item.product.name"
        class="w-full h-full object-cover rounded-md"
      />
      <div v-else class="w-full h-full bg-accent-100 rounded-md flex items-center justify-center">
        <UiIconsCamera class="w-8 h-8 text-accent-300" />
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <NuxtLink
          :to="`/marketplace/products/${item.product.slug}`"
          class="text-secondary font-medium hover:text-primary transition-colors"
        >
          {{ item.product.name }}
        </NuxtLink>
        <div class="text-primary font-semibold mt-1">
          ₦{{ formatPrice(item.product.price) }}
        </div>
      </div>

      <!-- Quantity Controls -->
      <div class="flex items-center gap-2">
        <button
          @click="decreaseQuantity"
          :disabled="isUpdating"
          class="w-8 h-8 flex items-center justify-center border border-accent-200 rounded hover:bg-accent-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span class="text-lg">−</span>
        </button>
        <input
          v-model.number="quantity"
          type="number"
          min="1"
          @change="updateQuantity"
          :disabled="isUpdating"
          class="w-12 h-8 text-center border border-accent-200 rounded focus:outline-none focus:border-primary disabled:opacity-50"
        />
        <button
          @click="increaseQuantity"
          :disabled="isUpdating"
          class="w-8 h-8 flex items-center justify-center border border-accent-200 rounded hover:bg-accent-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span class="text-lg">+</span>
        </button>
      </div>
    </div>

    <!-- Subtotal and Remove -->
    <div class="flex flex-col items-end justify-between">
      <div class="text-right">
        <div class="text-accent-600 text-sm">Subtotal</div>
        <div class="text-secondary font-semibold">
          ₦{{ formatPrice(item.subtotal) }}
        </div>
      </div>

      <button
        @click="removeItem"
        :disabled="isUpdating"
        class="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UiIconsCamera from '~/components/Ui/Icons/Camera.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove'])

const quantity = ref(props.item.quantity)
const isUpdating = ref(false)

const productImage = computed(() => {
  if (props.item.product.images && props.item.product.images.length > 0) {
    const image = props.item.product.images[0]
    return image.path || image.url
  }
  return null
})

function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price)
}

function increaseQuantity() {
  quantity.value++
  updateQuantity()
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
    updateQuantity()
  }
}

async function updateQuantity() {
  if (quantity.value !== props.item.quantity) {
    isUpdating.value = true
    try {
      emit('update-quantity', props.item.id, quantity.value)
    } finally {
      isUpdating.value = false
    }
  }
}

function removeItem() {
  emit('remove', props.item.id)
}
</script>

