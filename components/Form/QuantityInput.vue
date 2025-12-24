<template>
  <div>
    <label v-if="label" class="block mb-2 text-sm font-medium text-secondary">{{ label }}</label>
    <div class="flex items-center gap-2" :class="containerClass">
      <button
        type="button"
        :class="buttonClass"
        @click="decrement"
        :disabled="modelValue <= 1"
        aria-label="Decrease quantity"
      >
      <svg :class="iconClass" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
        <path d="M4 12L20 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
      <input
        type="number"
        :value="modelValue"
        @input="onInput"
        min="1"
        :class="inputClass"
        class="text-center rounded no-spinner focus:outline-none active:outline-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        :class="buttonClass"
        @click="increment"
        aria-label="Increase quantity"
      >
      <svg :class="iconClass" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
        <path d="M4 12H20M12 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  label: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});
const emit = defineEmits(['update:modelValue']);

const sizeConfig = {
  sm: {
    container: 'gap-1',
    button: 'aspect-square p-1 flex items-center justify-center border border-accent-200 bg-secondary rounded text-xs font-bold hover:bg-primary duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed',
    icon: 'w-3 h-3',
    input: 'w-8 py-1 text-xs'
  },
  md: {
    container: 'gap-2',
    button: 'aspect-square p-2 flex items-center justify-center border border-accent-200 bg-secondary rounded text-lg font-bold hover:bg-primary duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed',
    icon: 'w-6 h-6',
    input: 'w-12 py-2 text-lg'
  },
  lg: {
    container: 'gap-3',
    button: 'aspect-square p-3 flex items-center justify-center border border-accent-200 bg-secondary rounded text-xl font-bold hover:bg-primary duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed',
    icon: 'w-7 h-7',
    input: 'w-16 py-3 text-xl'
  }
}

const containerClass = computed(() => sizeConfig[props.size].container)
const buttonClass = computed(() => sizeConfig[props.size].button)
const iconClass = computed(() => sizeConfig[props.size].icon)
const inputClass = computed(() => sizeConfig[props.size].input)

function decrement() {
  if (props.modelValue > 1) {
    emit('update:modelValue', props.modelValue - 1);
  }
}
function increment() {
  emit('update:modelValue', props.modelValue + 1);
}
function onInput(e) {
  let val = parseInt(e.target.value, 10);
  if (isNaN(val) || val < 1) val = 1;
  emit('update:modelValue', val);
}
</script>
<style scoped>
/* Remove number input spinners for all browsers */
input[type="number"].no-spinner::-webkit-inner-spin-button,
input[type="number"].no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"].no-spinner {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style> 