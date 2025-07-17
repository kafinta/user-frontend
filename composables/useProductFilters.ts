// composables/useProductFilters.ts
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFiltersStore } from '../stores/filters'
import { storeToRefs } from 'pinia'

export function useProductFilters() {
  const route = useRoute()
  const router = useRouter()
  const filtersStore = useFiltersStore()
  const { selectedSubcategory } = storeToRefs(filtersStore)

  // Initialize from URL query parameters
  const selectedCategoryId = ref<number | null>(
    route.query.category ? Number(route.query.category) : null
  )

  const selectedLocationId = ref<number | null>(
    route.query.location ? Number(route.query.location) : null
  )

  const selectedSubcategoryId = ref<number | null>(
    route.query.subcategory ? Number(route.query.subcategory) : null
  )

  // Selected objects (for display purposes)
  const selectedCategory = ref(null); // { id, name, slug }
  const selectedSubcategory = ref(null); // { id, name, slug }
  const selectedLocation = ref(null); // { id, name, slug }

  // Helper computed properties for API calls
  const categoryId = computed(() => selectedCategory.value?.id);
  const subcategoryId = computed(() => selectedSubcategory.value?.id);
  const locationId = computed(() => selectedLocation.value?.id);

  // Helper computed properties for slugs (for URLs)
  const categorySlug = computed(() => selectedCategory.value?.slug);
  const subcategorySlug = computed(() => selectedSubcategory.value?.slug);
  const locationSlug = computed(() => selectedLocation.value?.slug);

  // Check if both selections are made
  const canFetchSubcategories = computed(() =>
    selectedCategoryId.value !== null && selectedLocationId.value !== null
  )

  // Get the subcategories directly as a computed property
  const subcategories = computed(() => filtersStore.subcategories)

  // Get the selected subcategory details
  const selectedSubcategoryDetails = computed(() => selectedSubcategory.value)

  // Get loading state directly as a computed property
  const isLoading = computed(() => filtersStore.isLoading)

  // Update URL when selections change
  watch([selectedCategoryId, selectedLocationId], ([catId, locId]) => {
    updateQueryParams(catId, locId, selectedSubcategoryId.value)

    if (catId && locId) {
      fetchSubcategories()
    }
  })

  // Watch for URL changes from outside
  watch(() => route.query, (newQuery) => {
    const catId = newQuery.category ? Number(newQuery.category) : null
    const locId = newQuery.location ? Number(newQuery.location) : null
    const subId = newQuery.subcategory ? Number(newQuery.subcategory) : null

    // Only update if different to avoid loops
    if (catId !== selectedCategoryId.value) {
      selectedCategoryId.value = catId
    }

    if (locId !== selectedLocationId.value) {
      selectedLocationId.value = locId
    }

    if (subId !== selectedSubcategoryId.value) {
      selectedSubcategoryId.value = subId

      // If we have a subcategory ID, fetch its details
      if (subId) {
        fetchSubcategoryDetails(subId)
      } else {
        // Clear selected subcategory if no ID in URL
        selectedSubcategory.value = null;
      }
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

    // If we have a subcategory ID in the URL, fetch its details
    if (selectedSubcategoryId.value) {
      await fetchSubcategoryDetails(selectedSubcategoryId.value)
    }
  })

  // Update URL with current selections
  function updateQueryParams(catId: number | null, locId: number | null, subId: number | null = null) {
    const query: Record<string, string> = {}

    if (catId) query.category = catId.toString()
    if (locId) query.location = locId.toString()
    if (subId) query.subcategory = subId.toString()

    // Only update if different from current query
    if (JSON.stringify(query) !== JSON.stringify(route.query)) {
      router.replace({ query })
    }
  }

  function selectCategory(category) {
    selectedCategory.value = category;
  }
  function selectSubcategory(subcategory) {
    selectedSubcategory.value = subcategory;
  }
  function selectLocation(location) {
    selectedLocation.value = location;
  }

  // Clear selections
  function clearSelections() {
    selectedCategoryId.value = null
    selectedLocationId.value = null
    selectedSubcategoryId.value = null
    selectedSubcategory.value = null
    updateQueryParams(null, null, null)
  }

  // Fetch subcategories
  async function fetchSubcategories() {
    if (!canFetchSubcategories.value) return

    await filtersStore.fetchSubcategories(
      selectedCategoryId.value as number,
      selectedLocationId.value as number
    )
  }

  // Fetch subcategory details
  async function fetchSubcategoryDetails(subcategoryId: number) {
    await filtersStore.fetchSubcategoryDetails(subcategoryId)
  }

  // Select a subcategory
  async function selectSubcategory(id: number) {
    selectedSubcategoryId.value = id
    return await fetchSubcategoryDetails(id)
  }

  return {
    // States
    selectedCategory,
    selectedSubcategory,
    selectedLocation,
    selectedCategoryId,
    selectedLocationId,
    selectedSubcategoryId,
    // selectedCategory,
    // selectedLocation,
    // canFetchSubcategories,
    // subcategories,
    // isLoading,

    categoryId,
    subcategoryId,
    locationId,
    categorySlug,
    subcategorySlug,
    locationSlug,

    // Actions
    selectCategory,
    selectLocation,
    selectSubcategory,
    fetchSubcategories,
    fetchSubcategoryDetails,
    clearSelections
  }
}