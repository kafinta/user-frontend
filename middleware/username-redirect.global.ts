// middleware/username-redirect.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Skip on server side
  if (import.meta.server) return;

  const authStore = useAuthStore();

  // Only redirect if user is authenticated and has a username
  if (!authStore.isAuthenticated || !authStore.user?.username) {
    return;
  }

  const userUsername = authStore.user.username;

  // Handle routes that should automatically redirect to user-specific URLs
  const redirectMappings = [
    // Dashboard routes
    { from: '/dashboard', to: `/${userUsername}/buying/dashboard` },
    { from: '/selling/dashboard', to: `/${userUsername}/selling/dashboard` },
    { from: '/buying/dashboard', to: `/${userUsername}/buying/dashboard` },
    
    // Profile routes
    { from: '/profile', to: `/${userUsername}/profile` },
    { from: '/settings', to: `/${userUsername}/settings` },
    
    // Selling routes
    { from: '/selling', to: `/${userUsername}/selling/dashboard` },
    { from: '/buying', to: `/${userUsername}/buying/dashboard` },
    
    // Onboarding routes
    { from: '/onboarding', to: `/${userUsername}/selling/onboarding` },
    { from: '/selling/onboarding', to: `/${userUsername}/selling/onboarding` },
  ];

  // Check if current route matches any redirect mapping
  const mapping = redirectMappings.find(map => to.path === map.from);
  
  if (mapping) {
    return navigateTo(mapping.to);
  }
});
