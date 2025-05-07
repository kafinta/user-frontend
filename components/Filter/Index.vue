<template>
  <aside class="lg:border-r lg:border-accent-200 lg:pr-4 w-full">
    <UiTypographyP class="mb-4 font-medium text-lg hidden lg:block">Filters</UiTypographyP>
    <div class="space-y-4">
      <div v-if="isLoading" class="space-y-4">
        <Skeleton height="32px" />
        <Skeleton height="15rem" />
        <Skeleton height="32px" />
        <Skeleton height="15rem" />
      </div>

      <div v-else-if="subcategoryDetails && subcategoryDetails.attributes && subcategoryDetails.attributes.length > 0">
        <div v-for="attribute in subcategoryDetails.attributes" :key="attribute.id" class="mb-6">
          <h3 class="font-medium text-secondary mb-2">{{ attribute.name }}</h3>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="value in attribute.values"
              :key="value.id"
              @click="toggleAttributeValue(attribute.id, value.id, value.name)"
              :class="[
                'py-2 px-5 text-sm font-medium duration-500 ease-in-out rounded-md cursor-pointer border',
                isAttributeValueSelected(attribute.id, value.id)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-secondary border-accent-200 hover:text-primary hover:border-primary focus:border-primary focus:text-primary'
              ]"
            >
              {{ value.name }}
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

// Selected attribute values - Map of attributeId -> { id, name }
const selectedAttributes = ref(new Map())

// Get subcategory details
const subcategoryDetails = computed(() => selectedSubcategory.value)

// Check if an attribute value is selected
function isAttributeValueSelected(attributeId, valueId) {
  if (!selectedAttributes.value.has(attributeId)) return false
  const selectedValue = selectedAttributes.value.get(attributeId)
  return selectedValue.id === valueId
}

// Toggle attribute value selection
function toggleAttributeValue(attributeId, valueId, valueName) {
  // If the value is already selected, deselect it
  if (selectedAttributes.value.has(attributeId) &&
      selectedAttributes.value.get(attributeId).id === valueId) {
    selectedAttributes.value.delete(attributeId)
  } else {
    // Otherwise, set this value as the only selected value for this attribute
    selectedAttributes.value.set(attributeId, { id: valueId, name: valueName })
  }

  // Emit selected attributes
  emitSelectedAttributes()
}

// Emit selected attributes as an object
function emitSelectedAttributes() {
  const result = {}

  selectedAttributes.value.forEach((selectedValue, attributeId) => {
    // Find the attribute name
    const attribute = subcategoryDetails.value?.attributes.find(attr => attr.id === attributeId)
    if (attribute) {
      result[attribute.name] = {
        id: selectedValue.id,
        name: selectedValue.name
      }
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