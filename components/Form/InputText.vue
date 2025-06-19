<template>
  <div>
    <label>{{ label }}</label>
    <input
      ref="input"
      :id="inputId"
      :type="type || 'text'"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :autocomplete="autocomplete || 'off'"
      :readonly="readonly"
      :maxlength="maxlength"
      :minlength="minlength"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      :class="inputClasses"
      class="w-full outline-none ring-0 focus:outline-none bg-transparent"
      :style="effectiveDisabled ? '' : 'transition: all 300ms ease-out;'"
    />
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "InputText",
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    fluid: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    maxlength: {
      type: [String, Number],
      default: null
    },
    minlength: {
      type: [String, Number],
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue', 'focus', 'blur', 'keydown', 'input'],

  inject: {
    inputGroup: {
      default: null
    }
  },

  data() {
    return {
      inputId: `input-text-${Math.random().toString(36).substring(2, 11)}`,
      isFocused: false
    }
  },

  computed: {
    isInGroup() {
      return !!this.inputGroup
    },

    effectiveSize() {
      return this.inputGroup?.size || this.size
    },

    effectiveError() {
      return this.inputGroup?.error || this.error
    },

    effectiveDisabled() {
      return this.inputGroup?.disabled || this.disabled
    },

    inputClasses() {
      const sizeClasses = {
        small: 'py-2 px-3 text-sm',
        normal: 'py-3 px-4 text-base',
        large: 'py-4 px-5 text-lg'
      }

      // If in an InputGroup, use minimal styling
      if (this.isInGroup) {
        return [
          sizeClasses[this.effectiveSize],
          'text-secondary placeholder-gray-400',
          this.effectiveDisabled ? 'cursor-not-allowed' : '',
          this.fluid ? 'flex-1' : ''
        ].filter(Boolean).join(' ')
      }

      // Standalone input styling
      return [
        // Base styling
        'border rounded-md',
        
        // Size
        sizeClasses[this.effectiveSize],
        
        // Width
        this.fluid ? 'w-full' : '',
        
        // Border states
        this.effectiveError ? 'border-red-600' : 'border-secondary border-opacity-20',
        
        // Focus states
        !this.effectiveError ? 'focus:border-primary focus:border-opacity-100' : 'focus:border-red-600',
        
        // Text colors
        'text-secondary placeholder-gray-400',
        
        // Background
        'bg-white',
        
        // Disabled state
        this.effectiveDisabled ? 'bg-accent-50 text-accent-400 cursor-not-allowed' : '',
        
        // Hover state
        !this.effectiveDisabled && !this.effectiveError ? 'hover:border-primary hover:border-opacity-60' : ''
      ].filter(Boolean).join(' ')
    }
  },

  methods: {
    handleInput(event) {
      if (this.effectiveDisabled) return
      this.$emit('update:modelValue', event.target.value)
      this.$emit('input', event)
    },

    handleFocus(event) {
      if (this.effectiveDisabled) return
      this.isFocused = true
      this.$emit('focus', event)
    },

    handleBlur(event) {
      if (this.effectiveDisabled) return
      this.isFocused = false
      this.$emit('blur', event)
    },

    handleKeydown(event) {
      if (this.effectiveDisabled) return
      this.$emit('keydown', event)
    },

    // Public method to focus the input
    focus() {
      if (this.effectiveDisabled) return
      this.$refs.input?.focus()
    },

    // Public method to blur the input
    blur() {
      if (this.effectiveDisabled) return
      this.$refs.input?.blur()
    },

    // Public method to select all text
    select() {
      if (this.effectiveDisabled) return
      this.$refs.input?.select()
    }
  }
}
</script>
