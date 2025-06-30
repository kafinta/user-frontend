<template>
  <div class="w-full relative">
    <div class="flex items-center">
      <!-- Input field -->
      <input
        ref="input"
        :id="inputId"
        :type="computedType"
        :value="inputValue"
        :disabled="disabled"
        :autocomplete="autocomplete || 'off'"
        @input="!disabled && handleInput($event)"
        @focus="!disabled && handleFocus()"
        @blur="!disabled && handleBlur()"
        :class="inputClasses"
        class="w-full py-3 px-4 border text-sm outline-none ring-0 focus:outline-none rounded-md bg-white peer placeholder-transparent relative"
        :style="disabled ? '' : 'transition: border-color 300ms ease-out, color 300ms ease-out;'"
        :placeholder="label"
      />

      <!-- Reveal/hide password toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-4 flex items-center text-accent-400 hover:text-primary focus:outline-none"
        @click="toggleReveal"
        tabindex="-1"
      >
        <UiIconsEye v-if="isHidden" class="h-5 w-5" />
        <UiIconsEyeOff v-else class="h-5 w-5" />
      </button>
    </div>

    <!-- Floating label -->
    <label
      :for="inputId"
      :class="labelClasses"
      :style="disabled ? '' : 'transition: all 300ms ease-out;'"
      class="absolute left-4 pointer-events-none select-none"
    >
      {{ label }}
    </label>

    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "FloatLabelInput",
  props: {
    extraClass: String,
    error: String,
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
      inputId: `input-${Math.random().toString(36).substring(2, 11)}`,
      isHidden: true
    }
  },

  computed: {
    computedType() {
      if (this.type === 'password') {
        return this.isHidden ? 'password' : 'text';
      }
      return this.type || 'text';
    },
    hasValue() {
      return this.inputValue && this.inputValue.length > 0
    },

    inputClasses() {
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
        this.error ? 'border-red-600 focus:border-red-600 active:border-red-600' : '',

        // Text alignment
        this.centerText ? 'text-center' : '',

        // Default text color
        'text-secondary',

        // Extra classes
        this.extraClass || ''
      ].filter(Boolean).join(' ')
    },

    labelClasses() {
      // Label should float if inputValue is not null/undefined (even if empty string)
      const isFloating = this.isFocused || (this.inputValue !== null && this.inputValue !== undefined)

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
    toggleReveal() {
      this.isHidden = !this.isHidden;
    },
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
      this.$refs.input.focus()
    }
  }
}
</script>

