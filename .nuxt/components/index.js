export { default as Accordion } from '../..\\components\\Accordion\\Index.vue'
export { default as AccordionItem } from '../..\\components\\Accordion\\Item.vue'
export { default as FormButton } from '../..\\components\\Form\\Button.vue'
export { default as FormInput } from '../..\\components\\Form\\Input.vue'
export { default as FormToggle } from '../..\\components\\Form\\Toggle.vue'
export { default as CarouselsMarketplace } from '../..\\components\\Carousels\\Marketplace.vue'
export { default as CarouselsProfessionals } from '../..\\components\\Carousels\\Professionals.vue'
export { default as CarouselsProjects } from '../..\\components\\Carousels\\Projects.vue'
export { default as NavigationFooter } from '../..\\components\\Navigation\\Footer.vue'
export { default as NavigationMenu } from '../..\\components\\Navigation\\Menu.vue'
export { default as Search } from '../..\\components\\Search\\Index.vue'
export { default as SharedBackdrop } from '../..\\components\\Shared\\Backdrop.vue'
export { default as NavigationLogo } from '../..\\components\\Navigation\\Logo\\Index.vue'
export { default as NavigationLogoInverted } from '../..\\components\\Navigation\\Logo\\Inverted.vue'
export { default as NavigationLogoMonotone } from '../..\\components\\Navigation\\Logo\\Monotone.vue'
export { default as NavigationNavBar } from '../..\\components\\Navigation\\NavBar\\Index.vue'
export { default as NavigationSideBar } from '../..\\components\\Navigation\\Side\\Bar.vue'
export { default as NavigationSideMenu } from '../..\\components\\Navigation\\Side\\Menu.vue'
export { default as SearchSuggestionItem } from '../..\\components\\Search\\Suggestion\\Item.vue'
export { default as SearchSuggestionLabel } from '../..\\components\\Search\\Suggestion\\Label.vue'
export { default as SearchSuggestionWrapper } from '../..\\components\\Search\\Suggestion\\Wrapper.vue'
export { default as UiButtonsAccent } from '../..\\components\\Ui\\Buttons\\Accent.vue'
export { default as UiButtonsPrimary } from '../..\\components\\Ui\\Buttons\\Primary.vue'
export { default as UiButtonsSecondary } from '../..\\components\\Ui\\Buttons\\Secondary.vue'
export { default as UiButtonsTertiary } from '../..\\components\\Ui\\Buttons\\Tertiary.vue'
export { default as UiCards } from '../..\\components\\Ui\\Cards\\Index.vue'
export { default as UiCardsSecondary } from '../..\\components\\Ui\\Cards\\Secondary.vue'
export { default as UiIconsAccordion } from '../..\\components\\Ui\\Icons\\Accordion.vue'
export { default as UiIconsCart } from '../..\\components\\Ui\\Icons\\Cart.vue'
export { default as UiIconsClose } from '../..\\components\\Ui\\Icons\\Close.vue'
export { default as UiIconsDashboard } from '../..\\components\\Ui\\Icons\\Dashboard.vue'
export { default as UiIconsFilter } from '../..\\components\\Ui\\Icons\\Filter.vue'
export { default as UiIconsGigs } from '../..\\components\\Ui\\Icons\\Gigs.vue'
export { default as UiIconsLoading } from '../..\\components\\Ui\\Icons\\Loading.vue'
export { default as UiIconsLocation } from '../..\\components\\Ui\\Icons\\Location.vue'
export { default as UiIconsMessages } from '../..\\components\\Ui\\Icons\\Messages.vue'
export { default as UiIconsMore } from '../..\\components\\Ui\\Icons\\More.vue'
export { default as UiIconsNotifications } from '../..\\components\\Ui\\Icons\\Notifications.vue'
export { default as UiIconsOverview } from '../..\\components\\Ui\\Icons\\Overview.vue'
export { default as UiIconsPopup } from '../..\\components\\Ui\\Icons\\Popup.vue'
export { default as UiIconsProfile } from '../..\\components\\Ui\\Icons\\Profile.vue'
export { default as UiIconsSearch } from '../..\\components\\Ui\\Icons\\Search.vue'
export { default as UiIconsSettings } from '../..\\components\\Ui\\Icons\\Settings.vue'
export { default as UiIconsTime } from '../..\\components\\Ui\\Icons\\Time.vue'
export { default as UiIconsTransactions } from '../..\\components\\Ui\\Icons\\Transactions.vue'
export { default as UiTypographyH1 } from '../..\\components\\Ui\\Typography\\H1.vue'
export { default as UiTypographyH2 } from '../..\\components\\Ui\\Typography\\H2.vue'
export { default as UiTypographyH3 } from '../..\\components\\Ui\\Typography\\H3.vue'
export { default as UiTypographyP } from '../..\\components\\Ui\\Typography\\P.vue'
export { default as UserProfileOnlineStatus } from '../..\\components\\User\\Profile\\OnlineStatus.vue'
export { default as UserProfilePicture } from '../..\\components\\User\\Profile\\Picture.vue'
export { default as NavigationNavBarUserMobile } from '../..\\components\\Navigation\\NavBar\\User\\Mobile.vue'
export { default as NavigationNavBarUserSearch } from '../..\\components\\Navigation\\NavBar\\User\\Search.vue'
export { default as NavigationNavBarUserSeller } from '../..\\components\\Navigation\\NavBar\\User\\Seller.vue'
export { default as UserProductsMinimal } from '../..\\components\\User\\Products\\Minimal\\Index.vue'

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
