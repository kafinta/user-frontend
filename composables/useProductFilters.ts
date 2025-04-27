// composables/useProductFilters.ts
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFiltersStore } from '../stores/filters'

export function useProductFilters() {
  const route = useRoute()
  const router = useRouter()
  const filtersStore = useFiltersStore()

  // Initialize from URL query parameters
  const selectedCategoryId = ref<number | null>(
    route.query.category ? Number(route.query.category) : null
  )
  
  const selectedLocationId = ref<number | null>(
    route.query.location ? Number(route.query.location) : null
  )

  // Selected objects (for display purposes)
  const selectedCategory = computed(() => {
    if (!selectedCategoryId.value) return null
    return filtersStore.categories.find(cat => cat.id === selectedCategoryId.value) || null
  })
  
  const selectedLocation = computed(() => {
    if (!selectedLocationId.value) return null
    return filtersStore.locations.find(loc => loc.id === selectedLocationId.value) || null
  })
  
  // Check if both selections are made
  const canFetchSubcategories = computed(() => 
    selectedCategoryId.value !== null && selectedLocationId.value !== null
  )

  // Get the subcategories directly as a computed property
  const subcategories = computed(() => filtersStore.subcategories)
  
  // Get loading state directly as a computed property
  const isLoading = computed(() => filtersStore.isLoading)

  // Update URL when selections change
  watch([selectedCategoryId, selectedLocationId], ([catId, locId]) => {
    updateQueryParams(catId, locId)
    
    if (catId && locId) {
      fetchSubcategories()
    }
  })
  
  // Watch for URL changes from outside
  watch(() => route.query, (newQuery) => {
    const catId = newQuery.category ? Number(newQuery.category) : null
    const locId = newQuery.location ? Number(newQuery.location) : null
    
    // Only update if different to avoid loops
    if (catId !== selectedCategoryId.value) {
      selectedCategoryId.value = catId
    }
    
    if (locId !== selectedLocationId.value) {
      selectedLocationId.value = locId
    }
  }, { deep: true })

  // Initialize on mount
  onMounted(async () => {
    // Ensure categories and locations are loaded
    if (filtersStore.categories.length === 0) {
      await filtersStore.fetchCategories()
    }
    
    if (filtersStore.locations.length === 0) {
      await filtersStore.fetchLocations()
    }
    
    // Fetch subcategories if both params are present
    if (selectedCategoryId.value && selectedLocationId.value) {
      await fetchSubcategories()
    }
  })

  // Update URL with current selections
  function updateQueryParams(catId: number | null, locId: number | null) {
    const query: Record<string, string> = {}
    
    if (catId) query.category = catId.toString()
    if (locId) query.location = locId.toString()
    
    // Only update if different from current query
    if (JSON.stringify(query) !== JSON.stringify(route.query)) {
      router.replace({ query })
    }
  }

  // Select a category
  function selectCategory(id: number) {
    selectedCategoryId.value = id
  }
  
  // Select a location
  function selectLocation(id: number) {
    selectedLocationId.value = id
  }
  
  // Clear selections
  function clearSelections() {
    selectedCategoryId.value = null
    selectedLocationId.value = null
    updateQueryParams(null, null)
  }
  
  // Fetch subcategories
  async function fetchSubcategories() {
    if (!canFetchSubcategories.value) return
    
    await filtersStore.fetchSubcategories(
      selectedCategoryId.value as number,
      selectedLocationId.value as number
    )
  }
  
  return {
    // States
    selectedCategoryId,
    selectedLocationId,
    // selectedCategory,
    // selectedLocation,
    // canFetchSubcategories,
    // subcategories,
    // isLoading,

    get selectedCategory() { return selectedCategory.value },
    get selectedLocation() { return selectedLocation.value },
    get canFetchSubcategories() { return canFetchSubcategories.value },
    get subcategories() { return subcategories.value },
    get isLoading() { return isLoading.value },
    
    // Actions
    selectCategory,
    selectLocation,
    fetchSubcategories,
    clearSelections
  }
}

// Add this to your composable or to a utility file
export function getSelectionMessage(selectedCategory: any, selectedLocation: any, currentPage: string) {
  // When viewing the categories page with a location already selected
  if (currentPage === 'categories' && selectedLocation) {
    return `Choose a category for your ${selectedLocation.name}`;
  }
  
  // When viewing the locations page with a category already selected
  if (currentPage === 'locations' && selectedCategory) {
    return `Choose where to place your ${selectedCategory.name}`;
  }
  
  // When both are selected (subcategories page)
  if (selectedCategory && selectedLocation) {
    return `Browse ${selectedCategory.name} for your ${selectedLocation.name}`;
  }
  
  // Default messages when starting fresh
  if (currentPage === 'categories') {
    return 'Choose a category to get started';
  }
  
  if (currentPage === 'locations') {
    return 'Choose a room to get started';
  }
  
  return 'Find the perfect items for your home';
}