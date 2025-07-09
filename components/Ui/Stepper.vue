<template>
  <nav class="flex items-center justify-center gap-2 py-4 select-none">
    <template v-for="(step, idx) in steps" :key="step.label">
      <button
        class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none"
        :class="{
          'bg-primary text-white shadow': idx === currentStep,
          'bg-accent-100 text-accent-600 hover:bg-accent-200': isEnabled(idx) && idx !== currentStep,
          'bg-accent-50 text-accent-300 cursor-not-allowed': !isEnabled(idx)
        }"
        :disabled="!isEnabled(idx)"
        @click="$emit('step-click', idx)"
        type="button"
      >
        <span class="flex items-center">
          <span v-if="idx < currentStep" class="inline-block w-5 h-5 mr-2 rounded-full bg-success-500 text-white flex items-center justify-center text-xs">&#10003;</span>
          <span v-else class="inline-block w-5 h-5 mr-2 rounded-full border border-accent-300 flex items-center justify-center text-xs">{{ idx + 1 }}</span>
          {{ step.label }}
        </span>
      </button>
      <span v-if="idx < steps.length - 1" class="w-6 h-0.5 bg-accent-200 mx-1"></span>
    </template>
  </nav>
</template>
<script setup>
const rawProps = defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  },
  isEnabled: {
    type: Function,
    default: undefined
  }
})

const isEnabled = rawProps.isEnabled || ((idx) => idx <= rawProps.currentStep)

defineEmits(['step-click'])
</script>
<style scoped>
.bg-success-500 {
  background-color: #22c55e;
}
</style> 