
<template>
  <LayoutsDashboard mode="buyer" pageTitle="Orders">
    <div class="flex divide-x border w-full border-accent-200 rounded-md mb-5 overflow-x-hidden">
      <button
        v-for="(status, index) in orderStatuses"
        :key="status.id"
        @click="activeStatus = status.id"
        :class="[
          'px-5 py-3 flex-1 text-sm md:text-base transition-colors duration-300',
          activeStatus === status.id ? 'bg-secondary text-white' : 'bg-accent-200 text-secondary',
          index === 0 ? 'rounded-l-md' : '',
          index === orderStatuses.length - 1 ? 'rounded-r-md' : ''
        ]"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Orders List -->
    <ul v-if="filteredOrders.length > 0" class="space-y-4">
      <li v-for="order in filteredOrders" :key="order.id" class="border border-accent-200 rounded-md p-5 hover:shadow-md transition-shadow duration-300">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Order Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-medium text-secondary">Order #{{ order.id }}</h3>
              <span :class="getStatusColor(order.status)" class="text-xs font-medium px-3 py-1 rounded-full">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <p class="text-sm text-accent-600 mb-2">{{ order.date }}</p>
            <p class="text-sm text-secondary">{{ order.itemCount }} item(s) • <strong>{{ order.total }}</strong></p>
          </div>

          <!-- Action Button -->
          <div class="flex-shrink-0">
            <UiButtonsPrimary class="whitespace-nowrap">View Details</UiButtonsPrimary>
          </div>
        </div>
      </li>
    </ul>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <UiIconsCart class="w-16 h-16 text-accent-300 mx-auto mb-4" />
      <UiTypographyH3 class="text-secondary mb-2">No orders yet</UiTypographyH3>
      <UiTypographyP class="text-accent-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</UiTypographyP>
      <NuxtLink to="/marketplace" class="inline-block px-6 py-2 bg-secondary text-white rounded-md hover:bg-primary transition-colors duration-300">
        Browse Products
      </NuxtLink>
    </div>
  </LayoutsDashboard>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
});

useHead({
  title: 'My Orders | Kafinta',
  meta: [
    { name: 'description', content: 'View and manage your orders on Kafinta' }
  ]
});

// Order statuses
const orderStatuses = [
  { id: 'pending', label: 'Pending' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'completed', label: 'Completed' }
];

// Active status filter
const activeStatus = ref('pending');

// Mock orders data - will be replaced with API call
const orders = ref([
  {
    id: 1001,
    status: 'pending',
    date: 'Dec 15, 2024',
    itemCount: 3,
    total: '$245.99'
  },
  {
    id: 1002,
    status: 'shipped',
    date: 'Dec 10, 2024',
    itemCount: 1,
    total: '$89.99'
  },
  {
    id: 1003,
    status: 'delivered',
    date: 'Dec 5, 2024',
    itemCount: 2,
    total: '$156.50'
  },
  {
    id: 1004,
    status: 'completed',
    date: 'Nov 28, 2024',
    itemCount: 5,
    total: '$412.00'
  }
]);

// Filter orders by active status
const filteredOrders = computed(() => {
  return orders.value.filter(order => order.status === activeStatus.value);
});

// Get status color classes
function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800'
  };
  return colors[status] || 'bg-accent-100 text-accent-800';
}

// Get status label
function getStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    shipped: 'Shipped',
    delivered: 'Delivered',
    completed: 'Completed'
  };
  return labels[status] || status;
}
</script>

<style scoped>
</style>


