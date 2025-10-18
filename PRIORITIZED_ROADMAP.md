# Prioritized Frontend Roadmap

## Executive Summary

After reviewing the sidebar and layout, here's the **prioritized roadmap ordered by time to completion**:

### Timeline Overview
- **Phase 1 (Quick Fixes)**: < 1 hour
- **Phase 2 (Responsiveness)**: 1-2 hours  
- **Phase 3 (Features)**: 2-4 hours
- **Phase 4 (API Integration)**: 2-3 days
- **Phase 5 (Cart System)**: 3-4 days

**Total to production-ready**: ~1 week

---

## 🚀 PHASE 1: Quick Sidebar Fixes (< 1 hour)

**Start here** - These are blocking issues that affect everything else.

### 1.1 Fix Prop Naming: `page_title` → `pageTitle`
**Time**: 10 minutes
**Files to update**:
- `pages/[username]/buying/dashboard.vue` - change `page_title` to `pageTitle`
- `components/Layouts/Dashboard.vue` - already uses `pageTitle` ✅

**Impact**: Consistency across all dashboards

### 1.2 Add Disabled State Styling to Menu Items
**Time**: 15 minutes
**File**: `components/Navigation/SideBar/Menu.vue`

**Current issue**:
```vue
:disabled="isDisabled"
:class="[
  'group flex items-center px-8 w-full py-3 gap-3',
  isDisabled ? '' : (is_active ? 'bg-white' : 'hover:bg-accent-500 duration-500 ease-in-out')
]"
```

**Fix**: Add proper disabled styling
```vue
:class="[
  'group flex items-center px-8 w-full py-3 gap-3',
  isDisabled ? 'cursor-not-allowed opacity-50' : (is_active ? 'bg-white' : 'hover:bg-accent-500 duration-500 ease-in-out')
]"
```

### 1.3 Remove Hardcoded Earnings Display
**Time**: 5 minutes
**File**: `components/Navigation/SideBar/Index.vue` (line 58)

**Current**:
```vue
<p class="text-green-500 text-sm">$0.00</p>
```

**Fix**: Remove or make dynamic (placeholder for now)
```vue
<!-- Will be populated from API later -->
<p class="text-green-500 text-sm">{{ userEarnings }}</p>
```

### 1.4 Make Online Status Dynamic
**Time**: 5 minutes
**File**: `components/Navigation/SideBar/Index.vue` (line 54)

**Current**:
```vue
<UserProfileOnlineStatus :is_online="true" :is_displayed="true" />
```

**Fix**: Make dynamic (can be placeholder)
```vue
<UserProfileOnlineStatus :is_online="isUserOnline" :is_displayed="true" />
```

---

## 🎨 PHASE 2: Sidebar Responsiveness (1-2 hours)

**After Phase 1** - Improve layout and styling

### 2.1 Review Sidebar Width Strategy
**Time**: 30 minutes
**File**: `components/Navigation/SideBar/Index.vue` (line 3)

**Current**:
```vue
<nav class="fixed z-100 top-0 left-0 w-4/6 md:w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col bg-secondary h-screen">
```

**Issue**: Sidebar gets narrower on larger screens (16.67% on XL)

**Options**:
1. Keep fixed width: `w-64` (256px) on all screens
2. Use better ratio: `md:w-1/3 lg:w-1/4 xl:w-1/5`
3. Hybrid: Fixed on desktop, responsive on mobile

**Recommendation**: Option 1 (fixed width) for better readability

### 2.2 Replace Hardcoded Colors with CSS Variables
**Time**: 20 minutes
**File**: `components/Navigation/SideBar/Menu.vue`

**Current**:
```vue
return 'text-[#909090] group-hover:text-accent-300';
```

**Fix**:
```vue
return 'text-accent-600 group-hover:text-accent-300';
```

### 2.3 Close Mobile Menu on Navigation
**Time**: 15 minutes
**Files**: `components/Layouts/Dashboard.vue` and `components/Navigation/SideBar/Index.vue`

**Fix**: Emit event or use callback to close menu when navigation item clicked

### 2.4 Improve Disabled State Consistency
**Time**: 15 minutes
**File**: `components/Navigation/SideBar/Menu.vue`

**Add**:
- Proper cursor styling
- No hover effects when disabled
- Consistent opacity

---

## ⚡ PHASE 3: Sidebar Features (2-4 hours)

**After Phase 2** - Add features and polish

### 3.1 Add Loading States to Sidebar
**Time**: 1 hour
**File**: `components/Navigation/SideBar/Index.vue`

**Add**:
- Loading skeleton for user profile
- Loading state for earnings
- Loading state for navigation items

### 3.2 Complete Buyer Navigation Items
**Time**: 1 hour
**File**: `components/Navigation/SideBar/Index.vue` (lines 288-294)

**Current**: Orders commented out
**Fix**: Uncomment and implement Orders page for buyers

### 3.3 Improve Hamburger Menu Animation
**Time**: 1 hour
**File**: `components/Layouts/Dashboard.vue` (lines 26-47)

**Current**: Custom CSS animation
**Fix**: Use Tailwind transitions for smoother animation

---

## 📊 PHASE 4: API Integration (2-3 days)

**After sidebar is fixed** - Implement data fetching

### 4.1 Create Dashboard Composables
**Time**: 1 day
- `composables/useBuyerDashboard.ts`
- `composables/useSellerDashboard.ts`

### 4.2 Update Dashboard Pages
**Time**: 1 day
- Update buying dashboard with real data
- Update selling dashboard with real data
- Add loading states and error handling

### 4.3 Standardize Dashboard Responsiveness
**Time**: 0.5 day
- Consistent breakpoints across all dashboards
- Consistent grid layouts

---

## 🛒 PHASE 5: Cart System (3-4 days)

**After API integration** - Implement cart functionality

### 5.1 Create Cart Composable
**Time**: 1 day
- Guest cart functionality
- Add to cart with variants
- Cart persistence

### 5.2 Implement Cart Page
**Time**: 1 day
- Cart summary
- Item management
- Checkout button

### 5.3 Cart Merging on Login
**Time**: 1 day
- Merge guest cart with user cart
- Handle conflicts

---

## 📋 Quick Reference: What to Fix First

### Blocking Issues (Fix Now)
1. ✅ Prop naming inconsistency
2. ✅ Disabled state styling
3. ✅ Hardcoded data in sidebar

### High Priority (Fix Soon)
1. Sidebar width strategy
2. Mobile menu close on navigation
3. Color variable consistency

### Medium Priority (Fix After API)
1. Loading states
2. Complete buyer navigation
3. Menu animation

### Low Priority (Polish)
1. Additional features
2. Advanced animations
3. Performance optimizations

---

## 🎯 Recommended Execution Order

**Day 1 (Today)**:
- Phase 1: Quick Fixes (< 1 hour)
- Phase 2: Responsiveness (1-2 hours)
- Phase 3: Features (2-4 hours)
- **Total**: 4-7 hours

**Day 2-3**:
- Phase 4: API Integration (2-3 days)

**Day 4-5**:
- Phase 5: Cart System (3-4 days)

---

## ✅ Success Criteria

After all phases:
- ✅ Sidebar is responsive and consistent
- ✅ No hardcoded data in UI
- ✅ Proper disabled state styling
- ✅ Loading states for all data
- ✅ Mobile menu works smoothly
- ✅ Dashboard pages fetch real data
- ✅ Cart system is functional

---

## 🚀 Ready to Start?

**Recommendation**: Start with Phase 1 (Quick Fixes) right now. These are quick wins that unblock everything else.

Should I start implementing Phase 1?


