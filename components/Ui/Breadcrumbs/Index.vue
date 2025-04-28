<template>
  <nav aria-label="Breadcrumb" class="card flex items-center gap-2">
    <ol class="flex items-center gap-2 flex-wrap">
      <li>
        <slot name="home">
          <nuxt-link :to="homeRoute" class="breadcrumb-link" aria-label="Home">
            <span v-if="homeIcon" :class="homeIcon" class="text-accent-400 hover:text-primary duration-300"></span>
            <span v-else class="pi pi-home text-accent-400 hover:text-primary duration-300"></span>
          </nuxt-link>
        </slot>
      </li>
      
      <li aria-hidden="true">
        <span class="text-accent-400 pi pi-angle-right h-4"></span>
      </li>
      
      <!-- Dynamic breadcrumb items -->
      <template v-for="(item, index) in validatedModel" :key="index">
        <li>
          <nuxt-link 
            v-if="item.route && !item.active" 
            :to="item.route" 
            class="breadcrumb-link"
            @click="handleItemClick(item)"
          >
            <span v-if="item.icon" :class="item.icon" class="mr-1"></span>
            <span class="font-normal text-accent-400 hover:text-primary duration-300">{{ item.label }}</span>
          </nuxt-link>
          <span v-else-if="item.active" class="font-normal text-primary" aria-current="page">{{ item.label }}</span>
          <span v-else class="font-normal text-accent-400">{{ item.label }}</span>
        </li>
        
        <!-- Add separator except after the last item -->
        <li v-if="index < validatedModel.length - 1" aria-hidden="true">
          <span class="text-accent-400" :class="separatorIcon"></span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  model: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(item => 
        typeof item === 'object' && 
        'label' in item && 
        typeof item.label === 'string'
      );
    }
  },
  homeRoute: {
    type: [String, Object],
    default: '/'
  },
  homeIcon: {
    type: String,
    default: 'pi pi-home'
  },
  separatorIcon: {
    type: String,
    default: 'pi pi-angle-right'
  }
});

const emit = defineEmits(['item-click']);

// Validate model items
const validatedModel = computed(() => {
  return props.model.map(item => ({
    ...item,
    label: item.label || 'Unnamed',
    route: item.route || null,
    active: !!item.active
  }));
});

// Function to handle item clicks
const handleItemClick = (item) => {
  emit('item-click', item);
};
</script>

<style scoped>
.breadcrumb-link {
  text-decoration: none;
  transition: color 0.2s ease;
}

@media (max-width: 640px) {
  .card {
    padding: 0.5rem 0;
  }
}
</style>
