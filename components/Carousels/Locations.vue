<template>
  <div v-if="locationsLoaded" class="glide_slides mt-5 relative flex items-center">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides">
        <UiCards @click="$router.push({name: 'marketplace-products', query: {location: item.name}})" v-for="item in locations" :key="item.id" :title="item.name" :backgroundImagePath="'http://localhost:8000' + item.image" :urlPath="{name: 'marketplace-locations'}" class="glide__slide"/>
      </div>
    </div>

    <div class="glide__arrows h-fit" data-glide-el="controls">
      <button class="glide__arrow glide__arrow--left absolute focus:outline-none left-3" data-glide-dir="<">
        <div class="bg-secondary aspect-square rounded-full p-3 hover:bg-primary duration-300 bg-opacity-75">
          <UiIconsAccordion class="w-5 h-5 -rotate-90 text-white" />
        </div>
      </button>
      <button class="glide__arrow glide__arrow--right absolute right-3 focus:outline-none" data-glide-dir=">">
        <div class="bg-secondary aspect-square rounded-full p-3 hover:bg-primary duration-300 bg-opacity-75">
          <UiIconsAccordion class="w-5 h-5 rotate-90 text-white" />
        </div>
      </button>
    </div>
  </div>
  <div v-else class="col-span-2 flex items-center justify-center mt-5">
    <UiIconsLoading class="text-accent-100 h-10 w-10"  />
  </div> 
</template>
<script setup>
import Glide from '@glidejs/glide'
import { onMounted, ref } from "vue";

const locationsLoaded = ref(false)
let locations = []

const getLocations = async () => {
  const { data: csrf_token_data, error: csrf_token_error } = await useCustomFetch('/sanctum/csrf-cookie')
  const { pending, data: user_auth_data, error: user_auth_error } = await useCustomFetch('api/locations/', {
    method: 'GET',
    onResponse(res) {
      if (res.response.status == 200) {
        locations = useState('locations', () => res.response._data).value
        setTimeout(() => {
          mountSlider()
        }, 200);
        locationsLoaded.value = true
      }
    },
  })
};

const mountSlider = () => {
  const marketplaceslider = document.querySelectorAll(`.glide_slides`)
  marketplaceslider.forEach((marketplace) => {
    new Glide(marketplace, {
      type: 'carousel',
      focusAt: 'center',
      autoplay: true,
      gap: 20,
      peek: 30,
      animationDuration: 1000,
      breakpoints: {
        600: {
          perView: 1
        },
        800: {
          perView: 2
        },
        1024: {
          perView: 3
        },
        1440: {
          perView: 4
        },
        12000: {
          perView: 5
        }
      }
    }).mount()
  })
}

onMounted(() =>{
  getLocations();
})
</script>