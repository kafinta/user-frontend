<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
    :class="[
      isActive
        ? 'bg-primary text-white'
        : 'text-secondary hover:bg-accent-100'
    ]"
    :aria-current="isActive ? 'page' : undefined"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4" />
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  to: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  }
})
</script>

