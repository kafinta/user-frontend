<template>
  <ModalsDrawer
    :openDialog="open"
    :footerButtons="false"
    :scrollable="true"
    @closeDialog="$emit('close')"
  >
    <template #title>
      Filters
    </template>
    <div class="space-y-4 flex-1 overflow-y-auto">
      <FormInput
        label="Search by name"
        v-model:inputValue="filters.keyword"
        @keyup.enter="emitFilters"
        class="w-full mt-2"
      />
      <FormSelect
        label="Category"
        :options="categoryOptions"
        v-model:selectedOption="filters.category"
        @update:selectedOption="onCategoryChange"
        class="w-full"
      />
      <FormSelect
        label="Location"
        :options="locationOptions"
        v-model:selectedOption="filters.location"
        @update:selectedOption="onLocationChange"
        class="w-full"
      />
      <FormSelect
        label="Subcategory"
        :options="subcategoryOptions"
        v-model:selectedOption="filters.subcategory"
        :disabled="!filters.category || !filters.location"
        @update:selectedOption="emitFilters"
        class="w-full"
      />
      <FormSelect
        label="Status"
        :options="statusOptions"
        v-model:selectedOption="filters.status"
        @update:selectedOption="emitFilters"
        class="w-full"
      />
      <FormSelect
        label="Stock Status"
        :options="stockStatusOptions"
        v-model:selectedOption="filters.stockStatus"
        @update:selectedOption="emitFilters"
        class="w-full"
      />
      <FormSelect
        label="Sort Direction"
        :options="sortDirectionOptions"
        v-model:selectedOption="filters.sortDirection"
        @update:selectedOption="emitFilters"
        class="w-full"
      />
    </div>
    <div class="flex lg:flex-row flex-col gap-3 mt-4">
      <UiButtonsTertiary @click="clearFilters" :flexdisplay="true" class="flex-1">Clear Filters</UiButtonsTertiary>
      <UiButtonsPrimary @click="emitFilters" :flexdisplay="true" class="flex-1">Apply Filters</UiButtonsPrimary>
    </div>
  </ModalsDrawer>
</template>

<script setup>
import { reactive } from 'vue'
import FormInput from '~/components/Form/Input.vue'
import FormSelect from '~/components/Form/Select.vue'
import ModalsDrawer from '~/components/Modals/Drawer.vue'
import UiButtonsTertiary from '~/components/Ui/Buttons/Tertiary.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  categoryOptions: { type: Array, default: () => [] },
  locationOptions: { type: Array, default: () => [] },
  subcategoryOptions: { type: Array, default: () => [] },
  statusOptions: { type: Array, default: () => [] },
  stockStatusOptions: { type: Array, default: () => [] },
  sortDirectionOptions: { type: Array, default: () => [] },
  initialFilters: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['filter-changed', 'close'])

const filters = reactive({
  keyword: props.initialFilters.keyword || '',
  category: props.initialFilters.category || '',
  location: props.initialFilters.location || '',
  subcategory: props.initialFilters.subcategory || '',
  status: props.initialFilters.status || '',
  stockStatus: props.initialFilters.stockStatus || '',
  sortDirection: props.initialFilters.sortDirection || ''
})

function emitFilters() {
  // Only include filters with a non-empty value
  const filtered = {}
  for (const key in filters) {
    if (filters[key] !== '') {
      filtered[key] = filters[key]
    }
  }
  emit('filter-changed', filtered)
  emit('close') // Close the sidebar after applying
}

function onCategoryChange() {
  filters.subcategory = ''
  emitFilters()
}
function onLocationChange() {
  filters.subcategory = ''
  emitFilters()
}

function clearFilters() {
  filters.keyword = ''
  filters.category = ''
  filters.location = ''
  filters.subcategory = ''
  filters.status = ''
  filters.stockStatus = ''
  filters.sortDirection = ''
  emit('filter-changed', {})
  emit('close') // Close the sidebar after clearing
}
</script>

<style scoped>
</style> 