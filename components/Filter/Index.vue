<template>
  <aside class="lg:border-r lg:border-accent-200 lg:pr-4 w-full">
    <UiTypographyP class="mb-4 font-medium text-lg hidden lg:block">Filters</UiTypographyP>
    <div class="space-y-4">
      <div v-if="isLoading" class="animate-pulse">
        <div class="h-6 bg-accent-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-accent-200 rounded w-full mb-1"></div>
        <div class="h-4 bg-accent-200 rounded w-full mb-1"></div>
        <div class="h-4 bg-accent-200 rounded w-full mb-1"></div>
      </div>

      <div v-else-if="subcategoryDetails && subcategoryDetails.attributes && subcategoryDetails.attributes.length > 0">
        <div v-for="attribute in subcategoryDetails.attributes" :key="attribute.id" class="mb-6">
          <h3 class="font-medium text-secondary mb-2">{{ attribute.name }}</h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="value in attribute.values"
              :key="value"
              @click="toggleAttributeValue(attribute.id, value)"
              :class="[
                'py-2 px-5 text-sm font-medium duration-500 ease-in-out rounded-md cursor-pointer border',
                isAttributeValueSelected(attribute.id, value)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-secondary border-accent-200 hover:text-primary hover:border-primary focus:border-primary focus:text-primary'
              ]"
            >
              {{ value }}
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <div v-else class="text-secondary">
        No filters available for this selection.
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'

const filtersStore = useFiltersStore()
const { selectedSubcategory, isLoading, error } = storeToRefs(filtersStore)

// Selected attribute values
const selectedAttributes = ref(new Map())

// Get subcategory details
const subcategoryDetails = computed(() => selectedSubcategory.value)

// Check if an attribute value is selected
function isAttributeValueSelected(attributeId, value) {
  if (!selectedAttributes.value.has(attributeId)) return false
  return selectedAttributes.value.get(attributeId).includes(value)
}

// Toggle attribute value selection
function toggleAttributeValue(attributeId, value) {
  if (!selectedAttributes.value.has(attributeId)) {
    selectedAttributes.value.set(attributeId, [value])
    return
  }

  const values = selectedAttributes.value.get(attributeId)
  const index = values.indexOf(value)

  if (index === -1) {
    values.push(value)
  } else {
    values.splice(index, 1)
  }

  // If no values left, remove the attribute
  if (values.length === 0) {
    selectedAttributes.value.delete(attributeId)
  } else {
    selectedAttributes.value.set(attributeId, values)
  }

  // Emit selected attributes
  emitSelectedAttributes()
}

// Emit selected attributes as an object
function emitSelectedAttributes() {
  const result = {}

  selectedAttributes.value.forEach((values, attributeId) => {
    // Find the attribute name
    const attribute = subcategoryDetails.value?.attributes.find(attr => attr.id === attributeId)
    if (attribute) {
      result[attribute.name] = values
    }
  })

  // Emit the selected attributes
  emit('filter-changed', result)
}

// Define emits
const emit = defineEmits(['filter-changed'])

// Reset selected attributes when subcategory changes
watch(subcategoryDetails, () => {
  selectedAttributes.value = new Map()
})
</script>