<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false" class="py-8 pb-18">
      <div class="mt-2">
        <div class="flex items-center justify-between">
          <div>
            <UiTypographyH2 class="text-secondary text-xl md:text-2xl 2xl:text-3xl font-medium">Top Locations</UiTypographyH2>
            <UiTypographyP>Locations our users shop for the most</UiTypographyP>
          </div>
          <UiButtonsSecondary @clicked="navigateToAllLocations" class="flex gap-1 items-center">
            See All
            <UiIconsChevron class="transform rotate-90 w-4 h-4" />
          </UiButtonsSecondary>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3 mt-6">
          <UiSkeleton v-for="i in 4" :key="`skeleton-${i}`" height="120px" class="rounded-lg" />
        </div>

        <!-- Loaded state -->
        <ul v-else class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3 mt-6">
          <li v-for="location in displayedLocations" :key="location.id">
            <button @click="navigateToLocation(location)" class="p-5 flex gap-5 border border-secondary border-opacity-20 items-center rounded-lg hover:border-primary duration-300 ease-in-out w-full">
              <div class="bg-primary h-20 w-20 rounded-full flex items-center justify-center flex-shrink-0">
                <img class="w-14 h-14" :alt="location.name" :src="location.icon" />
              </div>

              <div class="text-left">
                <h3 class="text-secondary text-lg font-medium">{{ location.name }}</h3>
                <p class="text-secondary text-sm mt-0">{{ location.products }}</p>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </Container>

    <section class="py-10">
      <Container class="space-y-8">
        <CarouselsProductShowcase
          endpoint="/api/products/top"
          tag="Best Sellers"
          title="All-Time Top Products"
          subtitle="The products our customers return to most often."
          :seeAllUrl="{ path: '/marketplace/products', query: { sort: 'top' } }"
          />

        <CarouselsProductShowcase
          endpoint="/api/products/trending"
          tag="Trending"
          title="Trending Products"
          subtitle="What’s gaining traction right now based on recent buying activity."
          :seeAllUrl="{ path: '/marketplace/products', query: { sort: 'trending' } }"
          />

        <CarouselsProductShowcase
          endpoint="/api/products/featured"
          tag="Featured"
          title="Featured Products"
          subtitle="A curated selection of highlighted products from the marketplace."
          :seeAllUrl="{ path: '/marketplace/products', query: { sort: 'featured' } }"
          />
      </Container>
    </section>
  </LayoutsMarketplace>
</template>
<script setup>
useHead({
  title: 'Browse Marketplace | Kafinta',
  meta: [
    { name: 'description', content: 'Discover and shop products from top sellers on Kafinta marketplace' }
  ]
});

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductFilters } from '~/composables/useProductFilters';
import { useFiltersStore } from '~/stores/filters';
import { storeToRefs } from 'pinia';

const router = useRouter();
const filtersStore = useFiltersStore();
const { locations: apiLocations, isLoading } = storeToRefs(filtersStore);
const productFilters = useProductFilters();

// Map location names to local icon paths and product descriptions
const locationMetadata = {
  'Bedroom': {
    icon: '/images/room_icons/bedroom.svg',
    products: 'Beds, pillows, bedsheets, lamps...'
  },
  'Living Room': {
    icon: '/images/room_icons/living_room.svg',
    products: 'Sofas, couches, tables ...'
  },
  'Kitchen': {
    icon: '/images/room_icons/kitchen.svg',
    products: 'Fixtures, tables, kitchen tops...'
  },
  'Dining': {
    icon: '/images/room_icons/dining.svg',
    products: 'Chairs, tables, utensils...'
  },
  'Dining Room': {
    icon: '/images/room_icons/dining.svg',
    products: 'Chairs, tables, utensils...'
  }
};

// Display only the first 4 locations with metadata
const displayedLocations = computed(() =>
  apiLocations.value.slice(0, 4).map(location => ({
    ...location,
    icon: locationMetadata[location.name]?.icon || location.image_path,
    products: locationMetadata[location.name]?.products || 'Browse products'
  }))
);

const navigateToLocation = async (location) => {
  await productFilters.selectLocationAndNavigate(location);
};

const navigateToAllLocations = () => {
  router.push({ name: 'marketplace-locations' });
};

// Load the category and location data needed by the marketplace landing page
onMounted(async () => {
  if (filtersStore.categories.length === 0) {
    await filtersStore.fetchCategories();
  }

  if (apiLocations.value.length === 0) {
    await filtersStore.fetchLocations();
  }
});
</script>
