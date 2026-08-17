<template>
  <aside class="lg:border-r lg:border-accent-200 lg:pr-4 w-full">
    <UiTypographyP class="mb-4 font-medium text-lg hidden lg:block">Filters</UiTypographyP>
    <div class="space-y-4 pb-20">
      <div v-if="isLoading" class="space-y-4">
        <UiSkeleton height="32px" />
        <UiSkeleton height="15rem" />
        <UiSkeleton height="32px" />
        <UiSkeleton height="15rem" />
      </div>

      <div v-else-if="attributes && attributes.length > 0">
        <AccordionIndex :allowMultiple="true">
          <AccordionItem
            v-for="attribute in attributes"
            :key="attribute.id"
            :active="true"
            container_class="border-b border-accent-200 pb-2 mb-2"
          >
            <template #accordion-trigger>
              <h3 class="font-medium text-secondary py-2">{{ attribute.name }}</h3>
            </template>
            <template #accordion-content>
              <div class="flex flex-wrap gap-2 py-2">
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
            </template>
          </AccordionItem>
        </AccordionIndex>
      </div>

      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>

      <div v-else class="rounded-2xl border border-accent-200 bg-white p-5 text-center text-secondary shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-primary">
          <UiIconsFilter class="h-6 w-6" />
        </div>
        <p class="font-medium">No filters available</p>
        <p class="mt-1 text-sm text-accent-600">This selection doesn’t have any filter options yet.</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFiltersStore } from '~/stores/filters'
import { storeToRefs } from 'pinia'
import AccordionIndex from '~/components/Accordion/Index.vue'
import AccordionItem from '~/components/Accordion/Item.vue'
import { useProductsApi } from '~/composables/useProductsApi'

const route = useRoute()
const filtersStore = useFiltersStore()
const { selectedSubcategory, isLoading, error } = storeToRefs(filtersStore)
const productsApi = useProductsApi()
const { filters: apiFilters } = productsApi

// Selected attribute values - Map of attributeId -> { id, name }
const selectedAttributes = ref(new Map())

// Get subcategory details
const subcategoryDetails = computed(() => selectedSubcategory.value)

// Attributes to render: prefer selected subcategory attributes, fallback to API-provided available_attributes
const attributes = computed(() => {
  if (selectedSubcategory.value && Array.isArray(selectedSubcategory.value.attributes) && selectedSubcategory.value.attributes.length) {
    return selectedSubcategory.value.attributes
  }
  if (apiFilters.value && Array.isArray(apiFilters.value.available_attributes) && apiFilters.value.available_attributes.length) {
    return apiFilters.value.available_attributes
  }
  return []
})

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

function getSelectedAttributesFromRoute() {
  const map = new Map()
  if (!route.query) return map

  Object.entries(route.query).forEach(([key, value]) => {
    if (typeof key !== 'string' || !key.startsWith('attributes[') || typeof value !== 'string') {
      return
    }

    const attributeName = key.replace(/^attributes\[(.*)\]$/, '$1')
    const attribute = attributes.value?.find(item => item.name === attributeName)
    if (!attribute) return

    const matchingValue = attribute.values.find(option => String(option.id) === String(value))
    if (matchingValue) {
      map.set(attribute.id, { id: matchingValue.id, name: matchingValue.name })
    }
  })

  return map
}

function syncSelectedAttributes() {
  selectedAttributes.value = getSelectedAttributesFromRoute()
}

// Emit selected attributes as an object
function emitSelectedAttributes() {
  const result = {}

  selectedAttributes.value.forEach((selectedValue, attributeId) => {
    const attribute = attributes.value?.find(attr => attr.id === attributeId)
    if (attribute) {
      result[attribute.name] = String(selectedValue.id)
    }
  })

  emit('filter-changed', { attributes: result })
}

// Define emits
const emit = defineEmits(['filter-changed'])

watch([subcategoryDetails, attributes], () => {
  syncSelectedAttributes()
}, { immediate: true })

watch(
  () => route.query,
  () => {
    syncSelectedAttributes()
  },
  { deep: true }
)
</script>
