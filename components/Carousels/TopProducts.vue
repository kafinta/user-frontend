<template>
  <Container>
    <div>
      <div class="glide_slider professionals">
        <div class="flex items-center justify-between">
          <div>
            <UiTypographyH2>Trending Products</UiTypographyH2>
            <UiTypographyP>Our top selling products in the last month.</UiTypographyP>
          </div>
          <div class="glide__arrows flex gap-2" data-glide-el="controls">
            <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
              <div class="bg-secondary aspect-square rounded-full p-1.5 hover:bg-primary duration-300 bg-opacity-75">
                <UiIconsAccordion class="w-5 h-5 -rotate-90 text-white" />
              </div>
            </button>
            <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
              <div class="bg-secondary aspect-square rounded-full p-1.5 hover:bg-primary duration-300 bg-opacity-75">
                <UiIconsAccordion class="w-5 h-5 rotate-90 text-white" />
              </div>
            </button>
          </div>
        </div>

        <div class="glide__track mt-5" data-glide-el="track">
          <ul class="glide__slides">
            <ProductsCard v-for="professional in professionals" :key="professional.id" :title="professional.title" :image="professional.backgroundImagePath" :urlPath="professional.urlPath" class="glide__slide" />
          </ul>
        </div>

      </div>
    </div>
  </Container>

</template>

<script setup>
import Glide from '@glidejs/glide';
import { onMounted, ref } from "vue";
const professionals = [
  {
      id: 1,
      title: 'Architects and Building Designers',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243546/kafinta/professionals/architecture_pfqxd1.jpg',
      urlPath: 'architects'
  },
  {
      id: 2,
      title: 'General Contractors',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243547/kafinta/professionals/contractors_lh7l0e.jpg',
      urlPath: 'contractors'
  },
  {
      id: 3,
      title: 'Interior Designers & Decorators',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674493506/kafinta/professionals/interior_design_pqrjoi.jpg',
      urlPath: 'interior'
  },
  {
      id: 4,
      title: 'Landscape Contractors',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243718/kafinta/professionals/landscape_hu1kew.jpg',
      urlPath: 'landscape'
  },
  {
      id: 5,
      title: 'Stone, Paver & Concrete',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674494156/kafinta/professionals/concrete_2_m4mxvu.jpg',
      urlPath: 'concrete'
  },
  {
      id: 6,
      title: 'Swimming Pool Builders',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674243925/kafinta/professionals/swimming_pool_kzttut.jpg',
      urlPath: 'pool'
  },
  {
      id: 7,
      title: 'Home Remodeling',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674244002/kafinta/professionals/remodeling_fizg3u.jpg',
      urlPath: 'remodeling'
  },
  {
      id: 8,
      title: 'Accessory Dwelling Units',
      backgroundImagePath: 'https://res.cloudinary.com/dslsh7dej/image/upload/v1674244070/kafinta/professionals/dwelling_units_b7fsmx.jpg',
      urlPath: 'dwelling'
  },
];

onMounted(() =>{
  const professionalsSlider = document.querySelectorAll(`.professionals`);
    professionalsSlider.forEach((professional) => {
      new Glide(professional, {
        type: 'carousel',
        focusAt: 'center',
        gap: 20,
        peek: 0,
        animationDuration: 500,
        breakpoints: {
          600: {
              perView: 1
          },
          800: {
              perView: 1
          },
          1024: {
              perView: 2
          },
          1440: {
              perView: 3
          },
          12000: {
              perView: 5
          }
        }
      }).mount();
    });
})
</script>