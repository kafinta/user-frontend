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

  // Selected objects (for display purposes)
  const selectedCategory = ref<any>(null); // { id, name, slug }
  // selectedSubcategory comes from storeToRefs(filtersStore)
  const selectedLocation = ref<any>(null); // { id, name, slug }
  const selectedSubcategoryId = ref<number | null>(null);
  const selectedCategoryId = ref<number | null>(null);
  const selectedLocationId = ref<number | null>(null);

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
    !!categorySlug.value && !!locationSlug.value
  )

  // Get the subcategories directly as a computed property
  const subcategories = computed(() => filtersStore.subcategories)

  // Get the selected subcategory details
  const selectedSubcategoryDetails = computed(() => selectedSubcategory.value)

  // Get loading state directly as a computed property
  const isLoading = computed(() => filtersStore.isLoading)

  // Update URL when selections change (use slugs)
  function updateQueryParams(catSlug: string | null, locSlug: string | null, subSlug: string | null = null) {
    // Start with the current query
    const newQuery = { ...route.query };
    // Update or remove category
    if (catSlug) newQuery.category = catSlug;
    else delete newQuery.category;
    // Update or remove location
    if (locSlug) newQuery.location = locSlug;
    else delete newQuery.location;
    // Update or remove subcategory
    if (subSlug) newQuery.subcategory = subSlug;
    else delete newQuery.subcategory;
    // Only update if different from current query
    if (JSON.stringify(newQuery) !== JSON.stringify(route.query)) {
      router.replace({ query: newQuery });
    }
  }

  // Watch for changes in selected objects and update the URL
  watch([
    () => selectedCategory.value?.slug,
    () => selectedLocation.value?.slug,
    () => selectedSubcategory.value?.slug
  ], ([catSlug, locSlug, subSlug]) => {
    updateQueryParams(catSlug, locSlug, subSlug)
    if (catSlug && locSlug) {
      fetchSubcategories()
    }
  })

  // Watch for URL changes from outside (use slugs)
  watch(() => route.query, (newQuery) => {
    const catSlug = typeof newQuery.category === 'string' ? newQuery.category : undefined
    const locSlug = typeof newQuery.location === 'string' ? newQuery.location : undefined
    const subSlug = typeof newQuery.subcategory === 'string' ? newQuery.subcategory : undefined

    // Look up objects by slug from the store
    if (catSlug !== selectedCategory.value?.slug) {
      const catObj = filtersStore.categories.find(c => c.slug === catSlug)
      selectedCategory.value = catObj || null
      selectedCategoryId.value = catObj?.id || null
    }
    if (locSlug !== selectedLocation.value?.slug) {
      const locObj = filtersStore.locations.find(l => l.slug === locSlug)
      selectedLocation.value = locObj || null
      selectedLocationId.value = locObj?.id || null
    }
    if (subSlug !== selectedSubcategory.value?.slug) {
      const subObj = filtersStore.subcategories.find(s => s.slug === subSlug)
      selectedSubcategory.value = subObj || null
      selectedSubcategoryId.value = subObj?.id || null
      // If we have a subcategory slug, fetch its details
      if (subObj) {
        fetchSubcategoryDetails(subObj.id)
      } else {
        selectedSubcategory.value = null;
        selectedSubcategoryId.value = null;
      }
    }
  }, { deep: true })

  // Initialize on mount (use slugs from query)
  onMounted(async () => {
    // Ensure categories and locations are loaded
    if (filtersStore.categories.length === 0) {
      await filtersStore.fetchCategories()
    }
    if (filtersStore.locations.length === 0) {
      await filtersStore.fetchLocations()
    }
    // Fetch subcategories if both params are present
    if (categorySlug.value && locationSlug.value) {
      await fetchSubcategories()
    }
    // If we have a subcategory slug in the URL, fetch its details
    if (subcategorySlug.value) {
      const subObj = filtersStore.subcategories.find(s => s.slug === subcategorySlug.value)
      if (subObj) await fetchSubcategoryDetails(subObj.id)
    }
  })

  function selectCategory(categoryOrSlugOrId: any) {
    let category = null;
    if (typeof categoryOrSlugOrId === 'object') {
      category = categoryOrSlugOrId;
    } else if (typeof categoryOrSlugOrId === 'string') {
      category = filtersStore.categories.find(c => c.slug === categoryOrSlugOrId) ||
                 filtersStore.categories.find(c => c.id === Number(categoryOrSlugOrId));
    } else if (typeof categoryOrSlugOrId === 'number') {
      category = filtersStore.categories.find(c => c.id === categoryOrSlugOrId);
    }
    if (category) {
      if (selectedCategory.value?.id !== category.id) {
        selectedCategory.value = category;
        selectedCategoryId.value = category.id;
        // Only reset subcategory if category actually changed
        selectedSubcategory.value = null;
        selectedSubcategoryId.value = null;
      }
    }
  }

  function selectLocation(locationOrSlugOrId: any) {
    let location = null;
    if (typeof locationOrSlugOrId === 'object') {
      location = locationOrSlugOrId;
    } else if (typeof locationOrSlugOrId === 'string') {
      location = filtersStore.locations.find(l => l.slug === locationOrSlugOrId) ||
                 filtersStore.locations.find(l => l.id === Number(locationOrSlugOrId));
    } else if (typeof locationOrSlugOrId === 'number') {
      location = filtersStore.locations.find(l => l.id === locationOrSlugOrId);
    }
    if (location) {
      if (selectedLocation.value?.id !== location.id) {
        selectedLocation.value = location;
        selectedLocationId.value = location.id;
        // Only reset subcategory if location actually changed
        selectedSubcategory.value = null;
        selectedSubcategoryId.value = null;
      }
    }
  }

  function selectSubcategory(subcategoryOrSlugOrId: any) {
    let subcategory = null;
    if (typeof subcategoryOrSlugOrId === 'object') {
      subcategory = subcategoryOrSlugOrId;
    } else if (typeof subcategoryOrSlugOrId === 'string') {
      subcategory = filtersStore.subcategories.find(s => s.slug === subcategoryOrSlugOrId) ||
                    filtersStore.subcategories.find(s => s.id === Number(subcategoryOrSlugOrId));
    } else if (typeof subcategoryOrSlugOrId === 'number') {
      subcategory = filtersStore.subcategories.find(s => s.id === subcategoryOrSlugOrId);
    }
    if (subcategory) {
      selectedSubcategory.value = subcategory;
      selectedSubcategoryId.value = subcategory.id;
    }
  }

  // Clear selections
  function clearSelections() {
    selectedCategory.value = null
    selectedLocation.value = null
    selectedSubcategory.value = null
    selectedCategoryId.value = null
    selectedLocationId.value = null
    selectedSubcategoryId.value = null
    updateQueryParams(null, null, null)
  }

  // Fetch subcategories
  async function fetchSubcategories() {
    if (!canFetchSubcategories.value) return
    // Use IDs for API calls
    await filtersStore.fetchSubcategories(
      selectedCategory.value?.id,
      selectedLocation.value?.id
    )
  }

  // Fetch subcategory details
  async function fetchSubcategoryDetails(subcategoryId: number) {
    await filtersStore.fetchSubcategoryDetails(subcategoryId)
  }

  // Select a subcategory by id (async)
  async function selectSubcategoryById(id: number) {
    selectedSubcategoryId.value = id
    return await fetchSubcategoryDetails(id)
  }

  return {
    // States
    selectedCategory,
    selectedSubcategory, // This is now only from the store
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
    selectSubcategoryById,
    fetchSubcategories,
    fetchSubcategoryDetails,
    clearSelections
  }
}