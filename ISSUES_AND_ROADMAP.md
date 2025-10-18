# Frontend Issues & Roadmap

## Summary
You were right to pause and address existing issues. The dashboards have significant state management and responsiveness problems that need fixing before moving to new features.

---

## 📋 Issues to Fix (Priority Order)

### PHASE 1: Critical Issues (2-3 days)

#### 1. Dashboard State Management
- **Buying Dashboard**: No state management, all hardcoded to 0
- **Selling Dashboard**: Hardcoded username, unused state, no API calls
- **Onboarding Dashboard**: Good pattern (use as reference)
- **Fix**: Create composables for buyer/seller metrics, implement proper data fetching

#### 2. Dashboard Responsiveness
- **Issue**: Inconsistent breakpoints across dashboards
- **Buying**: `grid-cols-2 lg:grid-cols-4` (no md breakpoint)
- **Selling**: `grid-cols-2 lg:grid-cols-4` (same issue)
- **Onboarding**: `lg:grid-cols-2` (better)
- **Fix**: Standardize to `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`

#### 3. Prop Naming Inconsistency
- **Buying**: `page_title` (snake_case)
- **Selling**: `pageTitle` (camelCase)
- **Onboarding**: `pageTitle` (camelCase)
- **Fix**: Standardize to camelCase everywhere

#### 4. Selling Dashboard Bugs
- Typo: `username-selliing-products` (line 54)
- Hardcoded username: `'Quadri'` (line 79)
- Unused state: `tabs`, `description_edit`, `date`
- Weird setTimeout: `setTimeout(() => { date.value = new Date(); }, 2000)`
- **Fix**: Remove hardcoded data, implement proper state

#### 5. useOnboarding.ts Hardcoded Fallback
- **Issue**: Lines 148-168 create fake data on API failure
- **Fix**: Let errors propagate to pages for proper handling

#### 6. Product API Error Context
- **Issue**: useProductApi.ts errors don't show which step failed
- **Fix**: Add step context to error messages

#### 7. Form Validation Feedback
- **Issue**: Inconsistent field-level error display
- **Fix**: Ensure all forms show backend validation errors

#### 8. Marketplace Loading States
- **Issue**: No loading skeletons while fetching data
- **Fix**: Add loading states to categories, locations, subcategories

---

## 🏗️ Implementation Plan

### Step 1: Create Dashboard Composables
```typescript
// composables/useBuyerDashboard.ts
export const useBuyerDashboard = () => {
  const metrics = ref({
    itemsPurchased: 0,
    pendingDeliveries: 0,
    totalSpending: 0,
    cartItems: 0
  });
  const recommendedProducts = ref([]);
  const isLoading = ref(false);
  
  const fetchMetrics = async () => { /* ... */ };
  const fetchRecommendedProducts = async () => { /* ... */ };
  
  return { metrics, recommendedProducts, isLoading, fetchMetrics, fetchRecommendedProducts };
};

// composables/useSellerDashboard.ts
export const useSellerDashboard = () => {
  const metrics = ref({
    productsCount: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalEarnings: 0
  });
  const recentOrders = ref([]);
  const topProducts = ref([]);
  const isLoading = ref(false);
  
  const fetchMetrics = async () => { /* ... */ };
  const fetchRecentOrders = async () => { /* ... */ };
  const fetchTopProducts = async () => { /* ... */ };
  
  return { metrics, recentOrders, topProducts, isLoading, fetchMetrics, fetchRecentOrders, fetchTopProducts };
};
```

### Step 2: Update Buying Dashboard
- Use `useBuyerDashboard()` composable
- Fetch actual data from API
- Add loading states
- Fix responsiveness
- Fix prop naming

### Step 3: Update Selling Dashboard
- Use `useSellerDashboard()` composable
- Remove hardcoded data
- Remove unused state
- Fix typos
- Add loading states
- Fix responsiveness
- Fix prop naming

### Step 4: Standardize Responsiveness
- All metric grids: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- All card grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Consistent text sizing with breakpoints

### Step 5: Fix Remaining Issues
- Remove hardcoded fallback in useOnboarding.ts
- Add error context to useProductApi.ts
- Add loading states to marketplace pages
- Fix form validation feedback

---

## 📊 Expected Outcomes

After fixes:
- ✅ Consistent state management across all dashboards
- ✅ Proper data fetching with loading states
- ✅ Responsive design that works on all devices
- ✅ No hardcoded data or unused state
- ✅ Consistent error handling
- ✅ Better UX with loading skeletons

---

## ⏱️ Estimated Timeline

- **Phase 1 (Critical Issues)**: 2-3 days
  - Dashboard composables: 1 day
  - Update dashboards: 1 day
  - Standardize responsiveness: 0.5 day
  - Fix remaining issues: 0.5 day

- **Phase 2 (Cart System)**: 3-4 days (after Phase 1)
- **Phase 3 (Orders & Checkout)**: 4-5 days
- **Phase 4 (Seller Dashboard Features)**: 3-4 days
- **Phase 5 (Search & Filtering)**: 2-3 days

---

## ✅ Next Steps

1. Review this analysis
2. Approve the implementation plan
3. Start with creating dashboard composables
4. Update buying dashboard
5. Update selling dashboard
6. Standardize responsiveness
7. Fix remaining issues

Ready to start? Which issue would you like to tackle first?


