<template>
  <LayoutsDashboard mode="buyer">
  </LayoutsDashboard>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
});

useHead({
  title: 'Account Settings | Kafinta',
  meta: [
    { name: 'description', content: 'Manage your Kafinta account settings' }
  ]
});
</script>