<template>
  <footer class="px-6 md:px-8 lg:px-10 py-6 border-t border-secondary border-opacity-20">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto py-8">
      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Company</h4>
        <NuxtLink><UiButtonsSecondary>About</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Privacy Policy</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Terms of Service</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Copyright & Trademark</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Intellectual Property Claims</UiButtonsSecondary></NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Services</h4>
        <NuxtLink><UiButtonsSecondary>Shop Products</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Products Pricing</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Hire Artisans</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Become a Seller</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Join as an Artisan</UiButtonsSecondary></NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Support</h4>
        <NuxtLink><UiButtonsSecondary>Help & Support</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Trust & Safety</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Your Orders</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Shipping & Delivery</UiButtonsSecondary></NuxtLink>
        <NuxtLink><UiButtonsSecondary>Return Policy</UiButtonsSecondary></NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Download Apps</h4>
        <NuxtLink><img src="@/assets/images/icons/apple.svg" class="w-36" alt=""></NuxtLink>
        <NuxtLink><img src="@/assets/images/icons/google.svg" class="w-36" alt=""></NuxtLink>
      </div>
    </div>

    <div class="border-t border-secondary border-opacity-10 pt-6 flex items-center justify-between">
      <div class="flex items-center gap-5">
        <NavigationLogo class="m-0 w-28" />
        <p class="text-secondary text-xs md:text-sm">&copy; Kafinta {{ date.getFullYear() }}</p>
      </div>

      <div class="flex items-center gap-5">
        <NuxtLink>
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-secondary bg-opacity-20 hover:bg-opacity-30 rounded-md flex justify-center items-center">
            <img src="@/assets/images/logos/facebook_f.svg" class="w-6 h-6" alt="">
          </div>
        </NuxtLink>

        <NuxtLink>
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-secondary bg-opacity-20 hover:bg-opacity-30 rounded-md flex justify-center items-center">
            <img src="@/assets/images/logos/twitter.svg" class="w-6 h-6" alt="">
          </div>
        </NuxtLink>

        <NuxtLink>
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-secondary bg-opacity-20 hover:bg-opacity-30 rounded-md flex justify-center items-center">
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