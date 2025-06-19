<template>
  <div class="w-full">
    <div class="flex justify-between gap-2 md:gap-3">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="el => inputRefs[index] = el"
        v-model="digits[index]"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        maxlength="1"
        :class="inputClasses"
        class="w-12 h-12 md:w-14 md:h-14 text-center text-lg font-medium border rounded-md outline-none ring-0 focus:outline-none bg-white"
        :style="disabled ? '' : 'transition: border-color 300ms ease-out, color 300ms ease-out;'"
        @input="!disabled && handleInput(index, $event)"
        @keydown="!disabled && handleKeydown(index, $event)"
        @focus="!disabled && handleFocus(index)"
        @paste="!disabled && handlePaste($event)"
        :disabled="disabled"
        autocomplete="off"
      />
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: "OtpInput",
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 6
    },
    integerOnly: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue', 'complete'],

  data() {
    return {
      digits: Array(this.length).fill(''),
      inputRefs: []
    }
  },

  computed: {
    inputClasses() {
      if (this.disabled) {
        return [
          // Disabled state - no transitions, no hover effects
          'border-accent-200 bg-accent-50 text-accent-400 cursor-not-allowed',
          this.error ? 'border-red-300' : ''
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

        // Default text color
        'text-secondary',

        // Hover state
        'hover:border-primary hover:border-opacity-60'
      ].filter(Boolean).join(' ')
    },

    otpValue() {
      return this.digits.join('')
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        if (newValue !== this.otpValue) {
          this.setDigitsFromValue(newValue)
        }
      }
    },

    otpValue(newValue) {
      this.$emit('update:modelValue', newValue)

      // Emit complete event when all digits are filled
      if (newValue.length === this.length) {
        this.$emit('complete', newValue)
      }
    }
  },

  methods: {
    setDigitsFromValue(value) {
      const cleanValue = String(value || '').slice(0, this.length)
      this.digits = Array(this.length).fill('').map((_, index) =>
        cleanValue[index] || ''
      )
    },

    handleInput(index, event) {
      if (this.disabled) return

      const value = event.target.value

      // Only allow numbers if integerOnly is true
      if (this.integerOnly && value && !/^\d$/.test(value)) {
        event.target.value = this.digits[index]
        return
      }

      // Update the digit
      this.digits[index] = value

      // Move to next input if value is entered
      if (value && index < this.length - 1) {
        this.focusInput(index + 1)
      }
    },

    handleKeydown(index, event) {
      if (this.disabled) return

      // Handle backspace
      if (event.key === 'Backspace') {
        if (!this.digits[index] && index > 0) {
          // If current input is empty, move to previous and clear it
          this.digits[index - 1] = ''
          this.focusInput(index - 1)
        } else {
          // Clear current input
          this.digits[index] = ''
        }
        return
      }

      // Handle arrow keys
      if (event.key === 'ArrowLeft' && index > 0) {
        this.focusInput(index - 1)
        return
      }

      if (event.key === 'ArrowRight' && index < this.length - 1) {
        this.focusInput(index + 1)
        return
      }

      // Handle delete key
      if (event.key === 'Delete') {
        this.digits[index] = ''
        return
      }

      // Prevent non-numeric input if integerOnly is true
      if (this.integerOnly && !/^\d$/.test(event.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
        event.preventDefault()
      }
    },

    handleFocus(index) {
      if (this.disabled) return

      // Select all text when focusing
      this.$nextTick(() => {
        if (this.inputRefs[index]) {
          this.inputRefs[index].select()
        }
      })
    },

    handlePaste(event) {
      if (this.disabled) return

      event.preventDefault()
      const pastedData = event.clipboardData.getData('text')

      if (!pastedData) return

      // Clean the pasted data
      let cleanData = pastedData.replace(/\D/g, '') // Remove non-digits
      if (cleanData.length > this.length) {
        cleanData = cleanData.slice(0, this.length)
      }

      // Fill the digits
      this.digits = Array(this.length).fill('').map((_, index) =>
        cleanData[index] || ''
      )

      // Focus the next empty input or the last input
      const nextEmptyIndex = this.digits.findIndex(digit => !digit)
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : this.length - 1
      this.focusInput(focusIndex)
    },

    focusInput(index) {
      if (this.disabled) return

      this.$nextTick(() => {
        if (this.inputRefs[index]) {
          this.inputRefs[index].focus()
        }
      })
    },

    // Public method to focus the first input
    focus() {
      if (this.disabled) return
      this.focusInput(0)
    },

    // Public method to clear all inputs
    clear() {
      if (this.disabled) return
      this.digits = Array(this.length).fill('')
      this.focusInput(0)
    }
  }
}
</script>
