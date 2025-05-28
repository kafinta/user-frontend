<template>
  <div class="w-full relative">
    <!-- Input field -->
    <input
      ref="input"
      :id="inputId"
      :type="type || 'text'"
      :value="inputValue"
      :disabled="disabled"
      :autocomplete="autocomplete || 'off'"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="inputClasses"
      class="w-full py-3 px-4 border text-sm outline-none ring-0 focus:outline-none rounded-md duration-300 ease-out bg-white peer placeholder-transparent"
      :placeholder="label"
    />

    <!-- Floating label -->
    <label
      :for="inputId"
      :class="labelClasses"
      class="absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none"
    >
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: "FloatLabelInput",
  props: {
    extraClass: String,
    error: Boolean,
    label: {
      type: String,
      required: true
    },
    inputValue: String,
    type: String,
    disabled: Boolean,
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
      inputId: `input-${Math.random().toString(36).substring(2, 11)}`
    }
  },

  computed: {
    hasValue() {
      return this.inputValue && this.inputValue.length > 0
    },

    inputClasses() {
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
      this.$refs.input.focus()
    }
  }
}
</script>

