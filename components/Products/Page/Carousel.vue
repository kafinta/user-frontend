<template>
  <div class="glide_slider pictures grid items-center relative">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides">
        <div class="product bg-accent-400"></div>
        <div class="product bg-primary"></div>
        <div class="product bg-orange-500"></div>
        <div class="product bg-pink-600"></div>
      </ul>
    </div>

    <div class="glide__arrows flex justify-between h-fit absolute w-full px-6" data-glide-el="controls">
        <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
          <div class="bg-secondary aspect-square rounded-full p-1.5 hover:bg-primary duration-300 bg-opacity-75">
            <UiIconsChevron class="w-7 h-7 -rotate-90 text-white" />
          </div>
        </button>
        <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
          <div class="bg-secondary aspect-square rounded-full p-1.5 hover:bg-primary duration-300 bg-opacity-75">
            <UiIconsChevron class="w-7 h-7 rotate-90 text-white" />
          </div>
        </button>
    </div>
  </div>
</template>
<script>
// import Glide from '@glidejs/glide'
export default {
  mounted(){
    // const productsSlider = document.querySelectorAll(`.pictures`);
    // productsSlider.forEach((picture) => {
    //   new Glide(picture, {
    //     type: 'carousel',
    //     focusAt: 'center',
    //     gap: 0,
    //     peek: 0,
    //     animationDuration: 500,
    //     perView: 1
    //   }).mount();
    // });
  }
}
</script>