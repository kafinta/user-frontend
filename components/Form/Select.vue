<template>
  <div class="w-full relative">
    <!-- Custom Select Trigger -->
    <div
      ref="trigger"
      :id="selectId"
      :tabindex="disabled ? -1 : 0"
      @click="toggleDropdown"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
      :class="triggerClasses"
      class="w-full py-3 px-4 pr-10 border text-sm outline-none ring-0 focus:outline-none rounded-md duration-300 ease-out bg-white cursor-pointer"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-labelledby="`${selectId}-label`"
    >
      <span v-if="selectedOption" class="block truncate">{{ getDisplayText(selectedOption) }}</span>
      <span v-else class="block truncate opacity-0">{{ label }}</span>
    </div>

    <!-- Floating label -->
    <label
      :id="`${selectId}-label`"
      :for="selectId"
      :class="labelClasses"
      class="absolute left-4 transition-all duration-300 ease-out pointer-events-none select-none"
    >
      {{ label }}
    </label>

    <!-- Custom dropdown arrow -->
    <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg
        :class="{ 'rotate-180': isOpen }"
        class="w-4 h-4 text-secondary transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>

    <!-- Custom Dropdown -->
    <div
      v-if="isOpen"
      ref="dropdown"
      class="absolute z-50 w-full mt-1 bg-white border border-accent-200 rounded-md shadow-lg max-h-60 overflow-auto"
      role="listbox"
      :aria-labelledby="`${selectId}-label`"
    >
      <div
        v-for="(option, index) in options"
        :key="option.value || option"
        @click="selectOption(option)"
        @mouseenter="highlightedIndex = index"
        :class="optionClasses(option, index)"
        class="px-4 py-3 text-sm cursor-pointer transition-colors duration-150"
        role="option"
        :aria-selected="isSelected(option)"
      >
        {{ getDisplayText(option) }}
      </div>

      <!-- No options message -->
      <div v-if="options.length === 0" class="px-4 py-3 text-sm text-accent-400">
        No options available
      </div>
    </div>

    <!-- Backdrop to close dropdown -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
export default {
  name: "FloatLabelSelect",
  props: {
    extraClass: String,
    error: Boolean,
    label: {
      type: String,
      required: true
    },
    selectedOption: [String, Number],
    disabled: Boolean,
    options: {
      type: Array,
      default: () => []
    },
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
      isOpen: false,
      highlightedIndex: -1,
      selectId: `select-${Math.random().toString(36).substring(2, 11)}`
    }
  },

  computed: {
    hasValue() {
      return this.selectedOption !== null && this.selectedOption !== undefined && this.selectedOption !== ''
    },

    triggerClasses() {
      return [
        // Base styling
        'border-accent-200',

        // Focus states
        'focus:border-primary focus:border-opacity-100 focus:text-secondary',

        // Open state
        this.isOpen ? 'border-primary border-opacity-100' : '',

        // Error states
        this.error ? 'border-red-600 focus:border-red-600' : '',

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
      const isFloating = this.isFocused || this.hasValue || this.isOpen

      return [
        // Base positioning and styling
        'text-sm',

        // Floating state
        isFloating ? '-top-2 text-xs bg-white px-1' : 'top-3',

        // Color states
        this.error ? 'text-red-600' :
        (this.isFocused || this.isOpen) ? 'text-primary' : 'text-secondary',

        // Opacity
        this.disabled ? 'opacity-50' : ''
      ].filter(Boolean).join(' ')
    }
  },

  methods: {
    toggleDropdown() {
      if (this.disabled) return
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.highlightedIndex = this.findSelectedIndex()
      }
    },

    closeDropdown() {
      this.isOpen = false
      this.highlightedIndex = -1
    },

    selectOption(option) {
      const value = typeof option === 'object' ? option.value : option
      this.$emit('update:selectedOption', value)
      this.closeDropdown()
      this.$refs.trigger.focus()
    },

    handleFocus() {
      this.isFocused = true
    },

    handleBlur(event) {
      // Only blur if not clicking on dropdown
      if (!this.$refs.dropdown?.contains(event.relatedTarget)) {
        this.isFocused = false
        this.closeDropdown()
      }
    },

    handleKeydown(event) {
      if (this.disabled) return

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (this.isOpen && this.highlightedIndex >= 0) {
            this.selectOption(this.options[this.highlightedIndex])
          } else {
            this.toggleDropdown()
          }
          break
        case 'Escape':
          this.closeDropdown()
          break
        case 'ArrowDown':
          event.preventDefault()
          if (!this.isOpen) {
            this.toggleDropdown()
          } else {
            this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.options.length - 1)
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          if (this.isOpen) {
            this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0)
          }
          break
      }
    },

    getDisplayText(option) {
      if (typeof option === 'object') {
        return option.label || option.text || option.value
      }
      return option
    },

    isSelected(option) {
      const value = typeof option === 'object' ? option.value : option
      return value === this.selectedOption
    },

    findSelectedIndex() {
      return this.options.findIndex(option => {
        const value = typeof option === 'object' ? option.value : option
        return value === this.selectedOption
      })
    },

    optionClasses(option, index) {
      return [
        // Hover state
        'hover:bg-accent-100',

        // Selected state
        this.isSelected(option) ? 'bg-primary bg-opacity-10 text-primary' : 'text-secondary',

        // Highlighted state (keyboard navigation)
        index === this.highlightedIndex ? 'bg-accent-200' : ''
      ].filter(Boolean).join(' ')
    },

    focus() {
      this.$refs.trigger.focus()
    }
  },

  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeDropdown()
      }
    })
  }
}
</script>