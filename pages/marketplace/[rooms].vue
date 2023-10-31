<template>
  <LayoutsMarketplace>
    <UiTypographyH2 class="mt-6">What are you looking for?</UiTypographyH2>

    <div class="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8">
      <NuxtLink v-for="room in 12">
        <UiCards backgroundImagePath="https://res.cloudinary.com/dslsh7dej/image/upload/v1674909452/kafinta/marketplace/living-room_jqoixn.jpg" title="Example Room" />
      </NuxtLink>
    </div>
  </LayoutsMarketplace>
</template>
<script>
export default {
  data() {
    return {
      paths: []
    }
  },
  mounted() {
    const test = this.$route.path.split('/')
    this.paths = test
  },
}
</script>