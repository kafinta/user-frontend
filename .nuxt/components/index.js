export { default as CarouselsMarketplace } from '../..\\components\\Carousels\\Marketplace.vue'
export { default as CarouselsProfessionals } from '../..\\components\\Carousels\\Professionals.vue'
export { default as CarouselsProjects } from '../..\\components\\Carousels\\Projects.vue'
export { default as NavigationFooter } from '../..\\components\\Navigation\\Footer.vue'
export { default as NavigationMenu } from '../..\\components\\Navigation\\Menu.vue'
export { default as FormButton } from '../..\\components\\Form\\Button.vue'
export { default as FormInput } from '../..\\components\\Form\\Input.vue'
export { default as FormToggle } from '../..\\components\\Form\\Toggle.vue'
export { default as Search } from '../..\\components\\Search\\Index.vue'
export { default as NavigationHeader } from '../..\\components\\Navigation\\Header\\Index.vue'
export { default as NavigationHeaderUserHeader } from '../..\\components\\Navigation\\Header\\UserHeader.vue'
export { default as NavigationLogo } from '../..\\components\\Navigation\\Logo\\Index.vue'
export { default as NavigationLogoOneColor } from '../..\\components\\Navigation\\Logo\\OneColor.vue'
export { default as SearchSuggestionItem } from '../..\\components\\Search\\Suggestion\\Item.vue'
export { default as SearchSuggestionLabel } from '../..\\components\\Search\\Suggestion\\Label.vue'
export { default as SearchSuggestionWrapper } from '../..\\components\\Search\\Suggestion\\Wrapper.vue'
export { default as UiButtonsPrimary } from '../..\\components\\Ui\\Buttons\\Primary.vue'
export { default as UiButtonsSecondary } from '../..\\components\\Ui\\Buttons\\Secondary.vue'
export { default as UiCards } from '../..\\components\\Ui\\Cards\\Index.vue'
export { default as UiCardsSecondary } from '../..\\components\\Ui\\Cards\\Secondary.vue'
export { default as UiIconsAccordion } from '../..\\components\\Ui\\Icons\\Accordion.vue'
export { default as UiIconsClose } from '../..\\components\\Ui\\Icons\\Close.vue'
export { default as UiIconsLoading } from '../..\\components\\Ui\\Icons\\Loading.vue'
export { default as UiIconsMessages } from '../..\\components\\Ui\\Icons\\Messages.vue'
export { default as UiIconsNotifications } from '../..\\components\\Ui\\Icons\\Notifications.vue'
export { default as UiIconsSearch } from '../..\\components\\Ui\\Icons\\Search.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
