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
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="textareaClasses"
      class="w-full py-3 px-4 border text-sm outline-none ring-0 focus:outline-none rounded-md duration-300 ease-out bg-white peer placeholder-transparent resize-y"
      :placeholder="label"
    ></textarea>

    <!-- Floating label -->
    <label
      :for="textareaId"
      :class="labelClasses"
      class="absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none"
    >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: "FloatLabelTextarea",
  props: {
    extraClass: String,
    error: Boolean,
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

    textareaClasses() {
      return [
        // Base styling
        'border-accent-200',

        // Focus states
        'focus:border-primary focus:border-opacity-100 focus:text-secondary',
        'active:border-primary active:border-opacity-100 active:text-secondary',

        // Error states
        this.error ? 'border-red-600 focus:border-red-600 active:border-red-600' : '',

        // Text alignment
        this.centerText ? 'text-center' : '',

        // Default text color
        'text-secondary',

        // Disabled state
        this.disabled ? 'bg-accent-50 text-accent-400 cursor-not-allowed' : '',

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
        this.error ? 'text-red-600' :
        this.isFocused ? 'text-primary' : 'text-secondary',

        // Opacity
        this.disabled ? 'opacity-50' : ''
      ].filter(Boolean).join(' ')
    }
  },

  methods: {
    handleInput(event) {
      this.$emit('update:inputValue', event.target.value)
    },

    handleFocus() {
      this.isFocused = true
    },

    handleBlur() {
      this.isFocused = false
    },

    focus() {
      this.$refs.textarea.focus()
    }
  }
}
</script>

