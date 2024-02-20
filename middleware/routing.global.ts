export default defineNuxtRouteMiddleware((to, from) => {
  const endsWithSelling = to.fullPath.endsWith('/selling');
  const endsWithBuying = to.fullPath.endsWith('/buying');

  if (endsWithSelling || endsWithBuying) {
    return navigateTo(to.fullPath + '/dashboard'); // Redirect with /dashboard added
  }
});