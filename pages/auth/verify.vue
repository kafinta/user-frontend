<template>
  <div class="flex justify-center items-center py-16">
    <main class="w-full max-w-md mx-auto rounded-xl p-5 border-accent-200 border space-y-8">
      <div class="text-center space-y-6">
        <UiIconsLoading class="w-12 h-12 text-primary mx-auto" />
        <UiTypographyH3 class="font-medium text-3xl text-secondary">Redirecting...</UiTypographyH3>
        <UiTypographyP class="text-sm text-secondary">Please wait while we redirect you to the verification page.</UiTypographyP>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  isVerifyRoute: true
});

useHead({
  title: 'Verify Email | Kafinta',
  meta: [
    { name: 'description', content: 'Verify your email address to complete your Kafinta account setup' }
  ]
});

import { onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Redirect to appropriate verification page
onMounted(async () => {
  const token = route.query.token;
  const email = route.query.email;

  if (token) {
    // Redirect to token verification page
    await router.push({
      path: '/auth/verify-email/token',
      query: { token }
    });
  } else {
    // Redirect to code verification page
    await router.push({
      path: '/auth/verify-email/code',
      query: email ? { email } : {}
    });
  }
});
</script>