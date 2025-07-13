<template>
  <div>
    <label v-if="label" class="block mb-2 text-sm font-medium text-secondary">{{ label }}</label>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="aspect-square p-2 flex items-center justify-center border border-accent-200 bg-secondary rounded text-lg font-bold hover:bg-primary duration-300 ease-in-out"
        @click="decrement"
        :disabled="modelValue <= 1"
        aria-label="Decrease quantity"
      >
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
        <path d="M4 12L20 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
      <input
        type="number"
        :value="modelValue"
        @input="onInput"
        min="1"
        class="w-12 py-2 text-center text-lg rounded no-spinner focus:outline-none active:outline-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        class="aspect-square p-2 flex items-center justify-center border border-accent-200 bg-secondary rounded text-lg font-bold hover:bg-primary duration-300 ease-in-out"
        @click="increment"
        aria-label="Increase quantity"
      >
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
        <path d="M4 12H20M12 4V20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  label: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);

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