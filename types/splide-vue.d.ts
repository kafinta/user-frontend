declare module '@splidejs/vue-splide' {
  import type { DefineComponent } from 'vue'

  const Splide: DefineComponent<{}, {}, any>
  const SplideSlide: DefineComponent<{}, {}, any>

  export { Splide, SplideSlide }
}

declare module '@splidejs/vue-splide/css' {
  const styles: string
  export default styles
}
