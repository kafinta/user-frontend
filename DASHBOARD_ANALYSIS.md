# Dashboard Analysis & Issues

## Overview
The three dashboards (buying, selling, onboarding) have significant inconsistencies in state management, responsiveness, and data handling patterns.

---

## 🔴 Critical Issues Found

### 1. **Buying Dashboard** - No State Management
**File:** `pages/[username]/buying/dashboard.vue`

**Issues:**
- ❌ No data fetching - all metrics hardcoded to "0"
- ❌ No loading states
- ❌ No error handling
- ❌ No API calls to fetch actual data
- ❌ "Products you may like" section has no implementation
- ❌ No state variables for cart items, orders, spending

**Current State:**
```vue
<UiTypographyH2>0</UiTypographyH2> <!-- All hardcoded -->
```

**Should Have:**
- Items purchased count
- Pending deliveries count
- Total spending amount
- Cart items count
- Recommended products list

---

### 2. **Selling Dashboard** - Inconsistent State Management
**File:** `pages/[username]/selling/dashboard.vue`

**Issues:**
- ❌ Hardcoded data (username = 'Quadri', all counts = 0)
- ❌ Unused state variables (tabs, description_edit, date)
- ❌ No API calls to fetch products or orders
- ❌ setTimeout hack for date (line 102-104)
- ❌ Typo in route name: `username-selliing-products` (line 54)
- ❌ No loading states for cards
- ❌ No error handling
- ❌ Inconsistent prop naming: `pageTitle` vs `page_title`

**Current State:**
```typescript
const username = ref('Quadri'); // Hardcoded!
const tabs = ref([...]); // Unused
onMounted(() => {
  setTimeout(() => {
    date.value = new Date(); // Why?
  }, 2000);
});
```

---

### 3. **Onboarding Dashboard** - Good Pattern (Reference)
**File:** `pages/[username]/selling/onboarding/index.vue`

**What's Good:**
- ✅ Proper loading states with skeletons
- ✅ API calls in onMounted
- ✅ Error handling with toast notifications
- ✅ Computed properties from composable
- ✅ Proper state management
- ✅ Responsive grid layout

**Minor Issues:**
- ⚠️ Hardcoded fallback data in useOnboarding.ts (lines 148-168)
- ⚠️ No error context in API failures

---

## 📊 Responsiveness Issues

### Buying Dashboard
- Grid: `grid-cols-2 lg:grid-cols-4`
- ❌ No `md:` breakpoint - jumps from 2 to 4 columns
- ❌ No mobile optimization for text size
- ❌ "Products you may like" section has no responsive grid

### Selling Dashboard
- Grid: `grid-cols-2 lg:grid-cols-4` (same issue)
- Cards: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- ❌ Inconsistent breakpoint naming with buying dashboard
- ❌ No `sm:` breakpoint for small screens

### Onboarding Dashboard
- Grid: `lg:grid-cols-2` (better - uses lg breakpoint)
- Cards: `md:grid-cols-2 lg:grid-cols-3` (consistent)
- ✅ Better responsive design

---

## 🏗️ State Management Patterns

### Pattern 1: Onboarding (GOOD)
```typescript
// Uses composable for state
const onboarding = useOnboarding();
const canComplete = computed(() => onboarding.canComplete.value);

// Fetches data in onMounted
onMounted(async () => {
  await fetchProgress();
});
```

### Pattern 2: Selling Dashboard (BAD)
```typescript
// Hardcoded state
const username = ref('Quadri');
const tabs = ref([...]);

// No data fetching
onMounted(() => {
  setTimeout(() => { date.value = new Date(); }, 2000);
});
```

### Pattern 3: Buying Dashboard (MISSING)
```typescript
// No state at all
// No composable
// No API calls
// No loading states
```

---

## 🎯 Recommended Solutions

### 1. Create Dashboard Composables
- `useBuyerDashboard()` - fetch buyer metrics
- `useSellerDashboard()` - fetch seller metrics
- Consistent pattern with `useOnboarding()`

### 2. Standardize Responsiveness
- Use consistent breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Metrics grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- Cards grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 3. Implement Proper State Management
- Loading states with skeletons
- Error handling with toast notifications
- Actual data fetching from API
- Computed properties for derived state

### 4. Fix Prop Naming Inconsistency
- Buying: `page_title` (snake_case)
- Selling: `pageTitle` (camelCase)
- Onboarding: `pageTitle` (camelCase)
- **Standardize to camelCase**

---

## 📋 Implementation Order

1. **Create dashboard composables** (reusable state management)
2. **Fix buying dashboard** (implement state + API calls)
3. **Fix selling dashboard** (implement state + API calls + fix typos)
4. **Standardize responsiveness** (consistent breakpoints across all)
5. **Fix prop naming** (camelCase everywhere)
6. **Add loading skeletons** (consistent UX)

---

## API Endpoints Needed

### Buyer Dashboard
- `GET /api/buyer/metrics` - items purchased, pending deliveries, total spending, cart count
- `GET /api/products/recommended` - recommended products

### Seller Dashboard
- `GET /api/seller/metrics` - products count, active orders, completed orders, total earnings
- `GET /api/seller/orders?limit=3` - recent orders
- `GET /api/seller/products?limit=3` - top products


