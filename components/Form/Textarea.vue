<template>
  <div class="w-full relative">
    <!-- Textarea field -->
    <textarea
      ref="textarea"
      :id="textareaId"
      :value="inputValue"
      :disabled="disabled"
      :rows="rows"
      :autocomplete="autocomplete || 'off'"
      @input="!disabled && handleInput($event)"
      @focus="!disabled && handleFocus()"
      @blur="!disabled && handleBlur()"
      :class="textareaClasses"
      class="w-full py-3 px-4 border text-sm outline-none ring-0 focus:outline-none rounded-md bg-white peer placeholder-transparent resize-y"
      :style="disabled ? '' : 'transition: border-color 300ms ease-out, color 300ms ease-out;'"
      :placeholder="label"
    ></textarea>

    <!-- Floating label -->
    <label
      :for="textareaId"
      :class="labelClasses"
      :style="disabled ? '' : 'transition: all 300ms ease-out;'"
      class="absolute left-4 pointer-events-none select-none"
    >
      {{ label }}
    </label>

    <p v-if="typeof error === 'string' && error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "FloatLabelTextarea",
  props: {
    extraClass: String,
    error: [Boolean, String],
    label: {
      type: String,
      required: true
    },
    inputValue: String,
    disabled: Boolean,
    rows: {
      type: Number,
      default: 4
    },
    autocomplete: String,
    centerText: {
      default: false,
      type: Boolean
    },
    fluid: {
      default: true,
      type: Boolean
    }
  },

  data() {
    return {
      isFocused: false,
      textareaId: `textarea-${Math.random().toString(36).substring(2, 11)}`
    }
  },

  computed: {
    hasValue() {
      return this.inputValue && this.inputValue.length > 0
    },

    hasError() {
      return !!this.error
    },

    textareaClasses() {
      if (this.disabled) {
        return [
          // Disabled state - no transitions, no hover effects
          'border-accent-200 bg-accent-50 text-accent-400 cursor-not-allowed',
          this.centerText ? 'text-center' : '',
          this.extraClass || ''
        ].filter(Boolean).join(' ')
      }

      return [
        // Base styling
        'border-accent-200',

        // Focus states
        'focus:border-primary focus:border-opacity-100 focus:text-secondary',
        'active:border-primary active:border-opacity-100 active:text-secondary',

        // Error states
        this.hasError ? 'border-red-600 focus:border-red-600 active:border-red-600' : '',

        // Text alignment
        this.centerText ? 'text-center' : '',

        // Default text color
        'text-secondary',

        // Extra classes
        this.extraClass || ''
      ].filter(Boolean).join(' ')
    },

    labelClasses() {
      const isFloating = this.isFocused || this.hasValue

      return [
        // Base positioning and styling
        'text-sm',

        // Floating state
        isFloating ? '-top-2 text-xs bg-white px-1' : 'top-3',

        // Color states
        this.hasError ? 'text-red-600' :
        this.isFocused ? 'text-primary' : 'text-secondary',

        // Opacity
        this.disabled ? 'opacity-50' : ''
      ].filter(Boolean).join(' ')
    }
  },

  methods: {
    handleInput(event) {
      if (this.disabled) return
      this.$emit('update:inputValue', event.target.value)
    },

    handleFocus() {
      if (this.disabled) return
      this.isFocused = true
    },

    handleBlur() {
      if (this.disabled) return
      this.isFocused = false
    },

    focus() {
      if (this.disabled) return
      this.$refs.textarea.focus()
    }
  }
}
</script>

