<template>
  <main class="h-screen grid place-items-center">
    <div>
      <h1 class="text-9xl text-center font-bold">{{error.statusCode}}!</h1>
      <p>
        {{ error.message }}
      </p>

      <UiButtonsPrimary @clicked="handleError" class="mt-10 mx-auto">Go back home</UiButtonsPrimary>
    </div>
  </main>
</template>
<script setup>
const error = useError();
const handleError = () => {
  clearError({
    redirect: '/',
  });
};
</script>