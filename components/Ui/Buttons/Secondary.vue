<template>
  <NuxtLink v-if="url" :to="url"
    :class="linkClasses"
    class="font-medium text-sm xl:text-base 2xl:text-lg select-none outline-none"
    :style="disabled ? '' : 'transition: color 500ms ease-in-out, border-color 500ms ease-in-out;'"
  >
    <slot />
  </NuxtLink>
  <button v-else
    @click="!disabled && $emit('clicked')"
    :class="buttonClasses"
    class="font-medium text-sm xl:text-base 2xl:text-lg select-none outline-none"
    :style="disabled ? '' : 'transition: color 500ms ease-in-out, border-color 500ms ease-in-out;'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: Object,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const buttonClasses = computed(() => {
  if (props.disabled) {
    return [
      // Disabled state - no transitions, no hover effects
      'text-accent-400 border-b border-transparent cursor-not-allowed'
    ].join(' ')
  }

  return [
    // Normal state with hover effects
    'text-secondary hover:text-primary border-b border-transparent hover:border-primary'
  ].join(' ')
})

const linkClasses = computed(() => {
  if (props.disabled) {
    return [
      // Disabled state - no transitions, no hover effects
      'text-accent-400 border-b border-transparent cursor-not-allowed pointer-events-none'
    ].join(' ')
  }

  return [
    // Normal state with hover effects
    'text-secondary hover:text-primary border-b border-transparent hover:border-primary'
  ].join(' ')
})
</script>