<template>
  <LayoutsDashboard mode="buyer" pageTitle="Dashboard">
    <div class="border border-accent-200 rounded-md divide-y divide-x lg:divide-y-0 divide-accent-100 grid grid-cols-2 lg:grid-cols-4">
      <div class="p-5 flex gap-5 items-center">
        <img src="/images/insights/completed.svg" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>Items purchased</UiTypographyP>
          <UiTypographyH2>0</UiTypographyH2>
        </div>
      </div>
      <div class="p-5 flex gap-5 items-center">
        <img src="/images/insights/pending.svg" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>Pending deliveries</UiTypographyP>
          <UiTypographyH2>0</UiTypographyH2>
        </div>
      </div>
      <div class="p-5 flex gap-5 items-center">
        <img src="/images/insights/completed.svg" class="w-8 h-8" alt="">
        <div>
          <UiTypographyP>Total spending</UiTypographyP>
          <UiTypographyH2>$0.00</UiTypographyH2>
        </div>
      </div>
      <div class="p-5 flex gap-5 items-center">
        <UiIconsCart class="w-8 h-8 text-primary" />
        <div>
          <UiTypographyP>Items in cart</UiTypographyP>
          <UiTypographyH2>0</UiTypographyH2>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <h3 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Products you may like</h3>
    </div>
  </LayoutsDashboard>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
});

useHead({
  title: 'Buyer Dashboard | Kafinta',
  meta: [
    { name: 'description', content: 'Your buyer dashboard on Kafinta - track orders, manage cart, and discover products' }
  ]
});
</script>

<style>

</style>