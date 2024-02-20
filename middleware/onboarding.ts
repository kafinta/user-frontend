export default defineNuxtRouteMiddleware((to, from, next) => {
  // Replace "dataItem" with the actual name of your data item
  const dataItem = useCookie<boolean | null>('dataItem');

  if (dataItem.value === false) {
    // Load intended page
    next();
  } else if (dataItem.value === true) {
    // Redirect to specified location
    next('/redirected-path');
  } else {
    // Handle undefined or null dataItem
    // You can redirect to login page, show an error message, or take other actions
    next('/login');
  }
});