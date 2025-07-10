<template>
  <div class="relative inline-block text-left" @keydown.esc="closeMenu">
    <!-- Trigger Button (customizable) -->
    <div>
      <slot name="trigger" :open="open" :toggleMenu="toggleMenu" />
    </div>
    <!-- Dropdown Menu -->
    <transition name="fade">
      <div v-if="open" class="absolute right-0 z-20 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-accent-200 focus:outline-none" @click.outside="closeMenu">
        <ul class="py-1">
          <li v-for="(item, idx) in items" :key="idx">
            <button
              :class="[
                'w-full flex items-center gap-2 px-4 py-2 text-left transition-colors',
                item.danger
                  ? 'text-red-600 hover:bg-accent-100 focus:bg-accent-100'
                  : 'text-accent-700 hover:bg-accent-100 focus:bg-accent-100'
              ]"
              @click="handleAction(item)"
              :disabled="item.disabled"
            >
              <component v-if="item.icon" :is="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
  items: {
    type: Array,
    required: true // [{ label, icon, action, disabled, danger }]
  }
})
const open = ref(false)
const triggerRef = ref(null)

function toggleMenu() {
  open.value = !open.value
}
function closeMenu() {
  open.value = false
}
function handleAction(item) {
  if (item && typeof item.action === 'function' && !item.disabled) {
    item.action()
    closeMenu()
  }
}
// Close on outside click
function onClickOutside(event) {
  if (triggerRef.value && !triggerRef.value.contains(event.target)) {
    closeMenu()
  }
}
onMounted(() => {
  document.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 