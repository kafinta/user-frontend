<template>
  <div class="form-radio-group">
    <!-- Label -->
    <label v-if="label" :class="labelGroupClasses" class="block text-sm font-medium text-secondary mb-3">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Radio Options -->
    <div :class="layoutClasses">
      <div
        v-for="(option, index) in options"
        :key="getOptionValue(option)"
        class="flex items-center"
      >
        <div class="relative flex items-center">
          <!-- Hidden native radio input -->
          <input
            :id="`${fieldId}_${index}`"
            type="radio"
            :name="fieldId"
            :value="getOptionValue(option)"
            :checked="isSelected(option)"
            @change="selectOption(option)"
            :disabled="disabled"
            class="sr-only"
          />

          <!-- Custom radio button -->
          <div
            :class="radioClasses(option)"
            class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
            :style="disabled ? '' : 'transition: all 200ms ease-out;'"
            @click="!disabled && selectOption(option)"
          >
            <!-- Inner dot when selected -->
            <div
              v-if="isSelected(option)"
              class="w-2.5 h-2.5 rounded-full bg-white transition-all duration-200"
            ></div>
          </div>

          <!-- Label -->
          <label
            :for="`${fieldId}_${index}`"
            :class="labelClasses(option)"
            class="ml-3 text-sm"
            :style="disabled ? '' : 'transition: color 200ms ease-out;'"
            @click="!disabled && selectOption(option)"
          >
            {{ getDisplayText(option) }}
          </label>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'FormRadio',
  props: {
    // Value binding
    selectedValue: {
      type: [String, Number, Boolean],
      default: null
    },

    // Options array - can be strings or objects
    options: {
      type: Array,
      required: true,
      default: () => []
    },

    // Label for the radio group
    label: {
      type: String,
      default: ''
    },

    // Error message
    error: {
      type: String,
      default: ''
    },

    // Required field indicator
    required: {
      type: Boolean,
      default: false
    },

    // Disabled state
    disabled: {
      type: Boolean,
      default: false
    },

    // Layout direction
    layout: {
      type: String,
      default: 'vertical', // 'vertical' or 'horizontal'
      validator: (value) => ['vertical', 'horizontal'].includes(value)
    }
  },

  emits: ['update:selectedValue'],

  data() {
    return {
      fieldId: `radio_${Math.random().toString(36).substr(2, 9)}`
    }
  },

  computed: {
    layoutClasses() {
      return {
        'flex flex-col gap-3': this.layout === 'vertical',
        'flex flex-row gap-6': this.layout === 'horizontal'
      }
    },

    labelGroupClasses() {
      return {
        'text-center': this.layout === 'horizontal'
      }
    }
  },

  methods: {
    // Get value from option (string or object)
    getOptionValue(option) {
      return typeof option === 'object' ? option.value : option
    },

    // Get display text from option (string or object)
    getDisplayText(option) {
      if (typeof option === 'object') {
        return option.label || option.text || option.name || option.value
      }
      return option
    },

    // Check if option is selected
    isSelected(option) {
      return this.getOptionValue(option) === this.selectedValue
    },

    // Select an option
    selectOption(option) {
      if (this.disabled) return

      const value = this.getOptionValue(option)
      this.$emit('update:selectedValue', value)
    },

    // Radio button classes
    radioClasses(option) {
      const isSelected = this.isSelected(option)
      const hasError = !!this.error

      if (this.disabled) {
        return {
          // Disabled state - no transitions, no hover effects
          'cursor-not-allowed': true,
          'border-accent-200 bg-accent-50': !isSelected,
          'border-accent-300 bg-accent-300': isSelected
        }
      }

      return {
        // Base styles
        'cursor-pointer': true,
        'border-accent-300 bg-white': !isSelected && !hasError,

        // Selected state
        'border-primary bg-primary': isSelected,

        // Error state
        'border-red-500 bg-white': hasError && !isSelected,

        // Hover states
        'hover:border-accent-400': !isSelected && !hasError,
        'hover:border-primary-600 hover:bg-primary-600': isSelected
      }
    },

    // Label classes
    labelClasses(option) {
      if (this.disabled) {
        return {
          'text-accent-400 cursor-not-allowed': true
        }
      }

      return {
        'text-secondary cursor-pointer': true
      }
    }
  }
}
</script>
