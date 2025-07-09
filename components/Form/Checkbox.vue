<template>
  <div class="flex items-center gap-2">
    <!-- Hidden native checkbox for accessibility -->
    <input
      :id="inputId"
      ref="input"
      type="checkbox"
      :checked="isChecked"
      :disabled="disabled"
      :name="name"
      :value="value"
      @change="handleChange"
      class="sr-only"
    />
    
    <!-- Custom checkbox -->
    <div
      @click="!disabled && toggle()"
      @keydown.space.prevent="!disabled && toggle()"
      @keydown.enter.prevent="!disabled && toggle()"
      :tabindex="disabled ? -1 : 0"
      role="checkbox"
      :aria-checked="isChecked"
      :aria-disabled="disabled"
      :class="checkboxClasses"
      class="relative flex items-center justify-center w-4 h-4 border-2 rounded focus:outline-none"
      :style="disabled ? '' : 'transition: all 200ms ease-out;'"
    >
      <!-- Checkmark -->
      <svg
        v-show="isChecked"
        class="w-3 h-3 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    
    <!-- Label -->
    <label
      v-if="label || $slots.default"
      :for="inputId"
      :class="labelClasses"
      class="select-none"
      :style="disabled ? '' : 'transition: color 200ms ease-out;'"
    >
      <slot>{{ label }}</slot>
    </label>
  </div>

  <p v-if="typeof error === 'string' && error" class="text-xs text-red-500 mt-1">{{ error }}</p>
</template>

<script>
export default {
  name: "CustomCheckbox",
  props: {
    modelValue: {
      type: [Boolean, Array],
      default: false
    },
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    },
    binary: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    error: {
      type: [Boolean, String],
      default: false
    }
  },

  emits: ['update:modelValue', 'change'],

  data() {
    return {
      inputId: `checkbox-${Math.random().toString(36).substring(2, 11)}`
    }
  },

  computed: {
    isChecked() {
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.includes(this.value)
      }
      return this.binary ? this.modelValue : (this.modelValue || this.checked)
    },

    hasError() {
      return !!this.error
    },

    checkboxClasses() {
      const sizeClasses = {
        small: 'w-3 h-3',
        normal: 'w-4 h-4',
        large: 'w-5 h-5'
      }

      if (this.disabled) {
        return [
          // Size
          sizeClasses[this.size],
          // Disabled state - no transitions, no hover effects
          this.isChecked ? 'bg-accent-300 border-accent-300' : 'bg-accent-50 border-accent-200',
          'cursor-not-allowed',
          this.hasError ? 'border-red-300' : ''
        ].filter(Boolean).join(' ')
      }

      return [
        // Size
        sizeClasses[this.size],

        // Base styling
        this.isChecked ? 'bg-primary border-primary' : 'bg-white border-secondary border-opacity-30',

        // Hover states
        !this.isChecked ? 'hover:border-primary hover:border-opacity-60' : 'hover:bg-primary hover:bg-opacity-90',

        // Error states
        this.hasError ? 'border-red-600' : '',

        // Interactive state
        'cursor-pointer'
      ].filter(Boolean).join(' ')
    },

    labelClasses() {
      if (this.disabled) {
        return [
          'text-sm text-accent-400 cursor-not-allowed',
          this.hasError ? 'text-red-300' : ''
        ].filter(Boolean).join(' ')
      }

      return [
        // Base styling
        'text-sm cursor-pointer',

        // Color states
        this.hasError ? 'text-red-600' : 'text-secondary',

        // Hover state
        'hover:text-primary'
      ].filter(Boolean).join(' ')
    }
  },

  methods: {
    toggle() {
      if (this.disabled) return

      let newValue

      if (Array.isArray(this.modelValue)) {
        // Handle array values (multiple checkboxes)
        newValue = [...this.modelValue]
        const index = newValue.indexOf(this.value)
        
        if (index > -1) {
          newValue.splice(index, 1)
        } else {
          newValue.push(this.value)
        }
      } else {
        // Handle boolean values (single checkbox)
        newValue = !this.isChecked
      }

      this.$emit('update:modelValue', newValue)
      this.$emit('change', {
        checked: !this.isChecked,
        value: newValue,
        originalEvent: event
      })
    },

    handleChange(event) {
      // This handles the native checkbox change for accessibility
      this.toggle()
    },

    // Public method to focus the checkbox
    focus() {
      this.$refs.input?.focus()
    }
  }
}
</script>

<style scoped>
/* Conditional transitions for the checkmark - only when not disabled */
svg {
  transition: opacity 0.2s ease-out;
}
</style>
