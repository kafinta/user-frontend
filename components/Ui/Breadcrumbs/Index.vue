<template>
  <nav aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 flex-wrap text-accent-400 text-base">
      <!-- Home item -->
      <li>
        <slot name="home">
          <nuxt-link :to="homeRoute" class="breadcrumb-link" aria-label="Home">
            <i class="hover:text-primary duration-300 pi pi-home"></i>
          </nuxt-link>
        </slot>
      </li>

      <!-- First separator -->
      <li v-if="validatedModel.length > 0" aria-hidden="true">
        <i class="pi pi-angle-right"></i>
      </li>

      <!-- Dynamic breadcrumb items -->
      <template v-for="(item, index) in validatedModel" :key="index">
        <li>
          <nuxt-link
            v-if="item.route && !item.active"
            :to="item.route"
            :class="getBreadcrumbItemClass(item)"
          >
            {{ item.label }}
          </nuxt-link>
          <span
            v-else
            :class="getBreadcrumbItemClass(item)"
            :aria-current="item.active ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        </li>

        <!-- Add separator except after the last item -->
        <li v-if="index < validatedModel.length - 1" aria-hidden="true">
          <i class="pi pi-angle-right"></i>
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
  }
});

// Process model items and set the last one as active
const validatedModel = computed(() => {
  const items = props.model.map((item, index, array) => ({
    ...item,
    label: item.label || 'Unnamed',
    route: item.route || null,
    // Set the last item as active, ignore any active flag in the original items
    active: index === array.length - 1
  }));

  return items;
});

// Get class for breadcrumb item based on its state
const getBreadcrumbItemClass = (item) => {
  const baseClass = 'font-normal';

  if (item.active) {
    return `${baseClass} text-primary`;
  }

  return item.route
    ? `${baseClass} text-accent-400 hover:text-primary duration-300 breadcrumb-link`
    : `${baseClass} text-accent-400`;
};
</script>

<style scoped>
.breadcrumb-link {
  text-decoration: none;
  transition: color 0.2s ease;
}
</style>