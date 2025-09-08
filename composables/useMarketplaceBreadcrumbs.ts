import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFiltersStore } from '~/stores/filters'

export interface BreadcrumbItem {
  label: string
  route?: any
  active?: boolean
}

export const useMarketplaceBreadcrumbs = () => {
  const route = useRoute()
  const filtersStore = useFiltersStore()

  /**
   * Generate marketplace breadcrumbs following the hierarchy:
   * Home > Location Name > Category Name > Subcategory Name > Current Page
   * 
   * @param currentPageLabel - The label for the current page (e.g., "Products", "Categories")
   * @param currentPageRoute - Optional route for the current page (if it should be clickable)
   */
  const generateBreadcrumbs = (currentPageLabel: string, currentPageRoute?: any): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = []

    // Get current selections from URL
    const locationSlug = route.query.location as string
    const categorySlug = route.query.category as string  
    const subcategorySlug = route.query.subcategory as string

    // Add Location if selected
    if (locationSlug) {
      const location = filtersStore.locations.find(l => l.slug === locationSlug)
      if (location) {
        items.push({
          label: location.name,
          route: { 
            path: '/marketplace/locations', 
            query: { 
              // Preserve only location for location page
              location: locationSlug 
            } 
          }
        })
      }
    }

    // Add Category if selected
    if (categorySlug) {
      const category = filtersStore.categories.find(c => c.slug === categorySlug)
      if (category) {
        items.push({
          label: category.name,
          route: { 
            path: '/marketplace/categories', 
            query: { 
              // Preserve location and category for category page
              ...(locationSlug && { location: locationSlug }),
              category: categorySlug
            } 
          }
        })
      }
    }

    // Add Subcategory if selected
    if (subcategorySlug) {
      const subcategory = filtersStore.subcategories.find(s => s.slug === subcategorySlug)
      if (subcategory) {
        items.push({
          label: subcategory.name,
          route: { 
            path: '/marketplace/subcategories', 
            query: { 
              // Preserve all selections for subcategory page
              ...(locationSlug && { location: locationSlug }),
              ...(categorySlug && { category: categorySlug })
            } 
          }
        })
      }
    }

    // Add current page
    items.push({
      label: currentPageLabel,
      route: currentPageRoute,
      active: !currentPageRoute // If no route provided, mark as active
    })

    return items
  }

  /**
   * Computed breadcrumbs for Categories page
   */
  const categoriesBreadcrumbs = computed(() => {
    return generateBreadcrumbs('Categories')
  })

  /**
   * Computed breadcrumbs for Locations page  
   */
  const locationsBreadcrumbs = computed(() => {
    return generateBreadcrumbs('Locations')
  })

  /**
   * Computed breadcrumbs for Subcategories page
   */
  const subcategoriesBreadcrumbs = computed(() => {
    return generateBreadcrumbs('Subcategories')
  })

  /**
   * Computed breadcrumbs for Products page
   */
  const productsBreadcrumbs = computed(() => {
    return generateBreadcrumbs('Products')
  })

  /**
   * Computed breadcrumbs for Search Results
   */
  const searchBreadcrumbs = computed(() => {
    return generateBreadcrumbs('Search Results')
  })

  return {
    generateBreadcrumbs,
    categoriesBreadcrumbs,
    locationsBreadcrumbs, 
    subcategoriesBreadcrumbs,
    productsBreadcrumbs,
    searchBreadcrumbs
  }
}
