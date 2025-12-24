<template>
  <div class="flex gap-3 pb-4 border-b border-accent-100 last:border-b-0">
    <!-- Product Image -->
    <div class="flex-shrink-0 w-20 h-20">
      <img
        v-if="productImage"
        :src="productImage"
        :alt="item.product.name"
        class="w-full h-full object-cover rounded-md"
      />
      <div v-else class="w-full h-full bg-accent-100 rounded-md flex items-center justify-center">
        <UiIconsCamera class="w-6 h-6 text-accent-300" />
      </div>
    </div>

    <!-- Product Details -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <div>
        <NuxtLink
          :to="`/marketplace/products/${item.product.slug}`"
          class="text-secondary font-medium hover:text-primary transition-colors text-sm line-clamp-2"
        >
          {{ item.product.name }}
        </NuxtLink>
        <div class="text-primary font-semibold mt-1 text-sm">
          ₦{{ formatPrice(item.product.price) }}
        </div>
      </div>

      <!-- Quantity Input -->
      <FormQuantityInput
        v-model="quantity"
        size="sm"
        @update:modelValue="updateQuantity"
      />
    </div>

    <!-- Remove Button -->
    <button
      @click="removeItem"
      :disabled="isUpdating"
      class="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start pt-1"
    >
      Remove
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UiIconsCamera from '~/components/Ui/Icons/Camera.vue'
import FormQuantityInput from '~/components/Form/QuantityInput.vue'

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

function updateQuantity() {
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

