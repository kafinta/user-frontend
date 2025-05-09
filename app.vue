<template>
  <div>
    <!-- PrimeVue Toast with specific group -->
    <Toast position="top-right" group="br" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

</template>
<script setup>
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { useAppToast } from '~/utils/toast';

// Initialize toast service
const toast = useToast();

onMounted(() => {
  console.log('App mounted, Toast component initialized');

  // Toast system is now working correctly
  if (process.client) {
    try {
      // Verify that the toast utility is available without showing a notification
      const appToast = useAppToast();
      if (appToast) {
        console.log('Toast utility is available and ready');
      }
    } catch (error) {
      console.error('Error checking toast utility:', error);
    }
  }
});
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: white;
}

*{
  scroll-behavior: smooth;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  user-select: none;
  caret-color: #C9B14F;
}

.product {
  aspect-ratio: 5/3;
  object-fit: cover;
  object-position: center;
}

button:disabled {
  cursor: not-allowed;
}

.background {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

*::-webkit-scrollbar {
  width:5px;
  background-color: transparent;
  cursor: pointer;
  scroll-behavior: smooth;
}

*::-webkit-scrollbar-thumb {
  width:5px;
  background-color: #C9B14F;
  cursor: pointer;
}


.menu-shadow {
  box-shadow: 3px 0 10px -2px rgba(0, 0, 0, 0.082);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-in-left-enter-active, .slide-in-left-leave-active {
  transition: transform 0.5s;
}

.slide-in-left-enter {
  transform: translate(100%, 0);
}

.slide-in-left-leave-to {
  transform: translate(100%, 0);
}

.slide-in-bottom-enter-active, .slide-in-bottom-leave-active {
  transition: transform 0.4s;
}

.slide-in-bottom-enter {
  transform: translate(0, 100%);
}

.slide-in-bottom-leave-to {
  transform: translate(0, 100%);
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}

.bounce-enter-active {
  -webkit-animation: bounce-in 0.4s;
  animation: bounce-in 0.4s;
}

.bounce-leave-active {
  animation: bounce-in 0.4s reverse;
}

@-webkit-keyframes bounce-in {
  0% {
    opacity: 0%;
    transform: scale(0);
  }
  50% {
    opacity: 50%;
    transform: scale(1.2);
  }
  100% {
    opacity: 100%;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0%;
    transform: scale(0);
  }
  50% {
    opacity: 50%;
    transform: scale(1.2);
  }
  100% {
    opacity: 100%;
    transform: scale(1);
  }
}
</style>
