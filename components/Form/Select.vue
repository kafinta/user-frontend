<template>
  <div class="w-full relative">
    <!-- Custom Select Trigger -->
    <div
      ref="trigger"
      :id="selectId"
      :tabindex="disabled ? -1 : 0"
      @click="!disabled && toggleDropdown()"
      @keydown="!disabled && handleKeydown($event)"
      @focus="!disabled && handleFocus()"
      @blur="!disabled && handleBlur($event)"
      :class="triggerClasses"
      class="w-full py-3 px-4 pr-10 border text-sm outline-none ring-0 focus:outline-none rounded-md bg-white"
      :style="disabled ? '' : 'transition: border-color 300ms ease-out, color 300ms ease-out;'"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-labelledby="`${selectId}-label`"
      :aria-disabled="disabled"
    >
      <span v-if="selectedOption !== null && selectedOption !== undefined && getSelectedDisplayText() !== ''" class="block truncate">{{ getSelectedDisplayText() }}</span>
      <span v-else class="block truncate opacity-0">{{ label }}</span>
    </div>

    <!-- Floating label -->
    <label
      :id="`${selectId}-label`"
      :for="selectId"
      :class="labelClasses"
      :style="disabled ? '' : 'transition: all 300ms ease-out;'"
      class="absolute left-4 pointer-events-none select-none"
    >
      {{ label }}
    </label>

    <!-- Custom dropdown arrow -->
    <div class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg
        :class="[
          { 'rotate-180': isOpen && !disabled },
          disabled ? 'text-accent-400' : 'text-secondary'
        ]"
        :style="disabled ? '' : 'transition: transform 200ms ease-out;'"
        class="w-4 h-4"
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
        :key="getOptionValue(option)"
        @mousedown.prevent="selectOption(option)"
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
/**
 * FormSelect Component
 *
 * Supports two option formats:
 * 1. Simple strings/numbers: ['Option 1', 'Option 2', 'Option 3']
 * 2. Objects with separate display text and values:
 *    [
 *      { label: 'Display Text', value: 'actual_value' },
 *      { text: 'Another Display', value: 123 },
 *      { name: 'Category Name', value: 'category_id' }
 *    ]
 *
 * Object properties priority: label > text > name > value
 */
export default {
  name: "FormSelect",
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
      // Label should float if any option is selected, including '' (e.g., 'All')
      return this.selectedOption !== null && this.selectedOption !== undefined;
    },

    triggerClasses() {
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
        'border-accent-200 cursor-pointer',

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
      if (this.disabled) return
      const value = this.getOptionValue(option)
      this.$emit('update:selectedOption', value)
      this.closeDropdown()
      this.$refs.trigger.focus()
    },

    handleFocus() {
      if (this.disabled) return
      this.isFocused = true
    },

    handleBlur(event) {
      if (this.disabled) return
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
        // Priority order: label > text > name > value
        return option.label || option.text || option.name || option.value || ''
      }
      return option || ''
    },

    getOptionValue(option) {
      if (typeof option === 'object') {
        return option.value !== undefined ? option.value : option
      }
      return option
    },

    getSelectedDisplayText() {
      // Find the option that matches the selected value
      const selectedOptionObj = this.options.find(option => {
        const value = this.getOptionValue(option)
        return value === this.selectedOption
      })

      if (selectedOptionObj) {
        return this.getDisplayText(selectedOptionObj)
      }

      // Fallback to the selected value itself if no matching option found
      return this.selectedOption
    },

    isSelected(option) {
      const value = this.getOptionValue(option)
      return value === this.selectedOption
    },

    findSelectedIndex() {
      return this.options.findIndex(option => {
        const value = this.getOptionValue(option)
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