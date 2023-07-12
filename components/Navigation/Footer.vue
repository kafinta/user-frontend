<template>
  <footer class="px-6 md:px-8 lg:px-10 py-6 border-t border-accent-100 w-full">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto py-8">
      <div class="flex flex-col gap-2 text-left">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Company</h4>
        <NuxtLink to=""><UiButtonsSecondary>About</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Privacy Policy</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Terms of Service</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Copyright & Trademark</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary class="text-left w-fit">Intellectual Property Claims</UiButtonsSecondary></NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Services</h4>
        <NuxtLink to=""><UiButtonsSecondary>Shop Products</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Products Pricing</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Hire Artisans</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Become a Seller</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Join as an Artisan</UiButtonsSecondary></NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Support</h4>
        <NuxtLink to=""><UiButtonsSecondary>Help & Support</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Trust & Safety</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Your Orders</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Shipping & Delivery</UiButtonsSecondary></NuxtLink>
        <NuxtLink to=""><UiButtonsSecondary>Return Policy</UiButtonsSecondary></NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Download Apps</h4>
        <NuxtLink to=""><img src="@/assets/images/icons/apple.svg" class="w-36" alt=""></NuxtLink>
        <NuxtLink to=""><img src="@/assets/images/icons/google.svg" class="w-36" alt=""></NuxtLink>
      </div>
    </div>

    <div class="border-t border-accent-100 pt-6 flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center gap-5">
        <NavigationLogo class="m-0 w-28" />
        <UiTypographyP :small_text="true" class="text-secondary text-xs md:text-sm">&copy; Kafinta {{ date.getFullYear() }}</UiTypographyP>
      </div>

      <div class="flex items-center gap-5">
        <NuxtLink to="">
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-accent-100 hover:bg-accent-200 rounded-md flex justify-center items-center">
            <img src="@/assets/images/logos/facebook_f.svg" class="w-6 h-6" alt="">
          </div>
        </NuxtLink>

        <NuxtLink to="">
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-accent-100 hover:bg-accent-200 rounded-md flex justify-center items-center">
            <img src="@/assets/images/logos/twitter.svg" class="w-6 h-6" alt="">
          </div>
        </NuxtLink>

        <NuxtLink to="">
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-accent-100 hover:bg-accent-200 rounded-md flex justify-center items-center">
            <img src="@/assets/images/logos/instagram.svg" class="w-6 h-6" alt="">
          </div>
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      date: ''
    }
  },
  created(){
    this.date = new Date()
  }
}
</script>

<style>

</style>