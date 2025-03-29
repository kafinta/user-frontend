<template>
  <footer class="border-t border-accent-200 w-full">
    <Container class="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto py-8">
      <div class="flex flex-col gap-2 text-left items-start">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Company</h4>
        <UiButtonsSecondary :url="{}">About</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Privacy Policy</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Terms of Service</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Copyright & Trademark</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}" class="text-left w-fit">Intellectual Property Claims</UiButtonsSecondary>
      </div>

      <div class="flex flex-col gap-2 items-start">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Services</h4>
        <UiButtonsSecondary :url="{}">Shop Products</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Products Pricing</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Hire Artisans</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Become a Seller</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Join as an Artisan</UiButtonsSecondary>
      </div>

      <div class="flex flex-col gap-2 items-start">
        <h4 class="uppercase text-secondary text-base font-medium mb-2">Support</h4>
        <UiButtonsSecondary :url="{}">Help & Support</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Trust & Safety</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Your Orders</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Shipping & Delivery</UiButtonsSecondary>
        <UiButtonsSecondary :url="{}">Return Policy</UiButtonsSecondary>
      </div>

      <div class="flex flex-col gap-2">
        <h4 class="uppercase text-secondary text-base font-medium mb-2 items-start">Download Apps</h4>
        <img src="/images/icons/apple.svg" class="w-36" alt="">
        <img src="/images/icons/google.svg" class="w-36" alt="">
      </div>
    </Container>

    <Container :addTopBottomPadding="false" class="border-t border-accent-200 py-6 flex items-center justify-between">
      <div class="flex items-center gap-5">
        <NavigationLogo class="m-0 w-28" />
        <UiTypographyP :small_text="true" class="text-secondary text-xs md:text-sm">&copy; Kafinta {{ new Date().getFullYear() }}</UiTypographyP>
      </div>

      <div class="flex items-center gap-5">
        
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-accent-100 hover:bg-accent-200 rounded-md flex justify-center items-center">
            <img src="/images/logos/facebook_f.svg" class="w-6 h-6" alt="">
          </div>
        

        
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-accent-100 hover:bg-accent-200 rounded-md flex justify-center items-center">
            <img src="/images/logos/twitter.svg" class="w-6 h-6" alt="">
          </div>
        

        
          <div class="duration-500 ease-in-out cursor-pointer h-8 w-8 bg-accent-100 hover:bg-accent-200 rounded-md flex justify-center items-center">
            <img src="/images/logos/instagram.svg" class="w-6 h-6" alt="">
          </div>
        
      </div>
    </Container>
  </footer>
</template>