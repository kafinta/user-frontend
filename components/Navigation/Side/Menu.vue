<template>
  <button
    :disabled="isDisabled"
    :class="[
      'group flex items-center px-8 w-full py-3 gap-3',
      isDisabled ? '' : (is_active ? 'bg-white' : 'hover:bg-accent-500 duration-500 ease-in-out')
    ]"
  >
    <div
      :class="[
        'w-7 h-7 2xl:w-8 2xl:h-8 duration-500 ease-in-out',
        iconColorClass
      ]"
    >
      <slot />
    </div>

    <div
      :class="[
        'text-base 2xl:text-lg duration-500 ease-in-out',
        textColorClass
      ]"
    >
      {{ menu_text }}
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';

// Props with validation
const props = defineProps({
  menu_text: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: false
  },
  isSeller: {
    type: Boolean,
    default: true
  }
});

// Computed properties for better performance
const isDisabled = computed(() => !props.isSeller);

const iconColorClass = computed(() => {
  if (isDisabled.value) return 'text-accent-400';
  if (props.is_active) return 'text-primary';
  return 'text-[#909090] group-hover:text-accent-300';
});

const textColorClass = computed(() => {
  if (isDisabled.value) return 'text-accent-400';
  if (props.is_active) return 'font-medium text-secondary';
  return 'font-normal text-[#909090] group-hover:text-accent-300';
});
</script>