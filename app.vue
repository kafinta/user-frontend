<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
  import './assets/css/tailwind.css'
  useHead({
    title: 'Kafinta | Bring your dream home to life',
  });
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
* {
  font-family: Poppins;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

*::-webkit-scrollbar {
  width:8px;
  background-color: transparent;
  cursor: pointer;
}

*::-webkit-scrollbar-thumb {
  width:8px;
  background-color: #C9B14F;
  cursor: pointer;
}
</style>
