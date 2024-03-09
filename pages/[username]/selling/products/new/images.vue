<template>
  <LayoutsSellerDashboard page_title="New Product">
    <main class="grid grid-cols-1 place-items-center gap-6 max-w-3xl mx-auto w-full relative">
      <div class="flex items-center">
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">1</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="text-secondary border border-accent-200 h-10 w-10 rounded-full grid place-items-center">2</div>
        <div class="h-0.5 bg-accent-200 w-24"></div>
        <div class="bg-primary text-white h-10 w-10 rounded-full grid place-items-center">3</div>
      </div>
      <UiTypographyH3>Product Images</UiTypographyH3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div v-for="image in images" :key="image.id" class="relative product w-full border border-accent-200 rounded-md">
          <img :src="image.source || '/images/icons/camera.svg'" alt="Product Image Preview" class="product object-cover rounded-md">
          <button @click="deleteImage(image)" class="bg-red-600 p-3 rounded-md flex gap-2 text-white absolute top-2 right-2">
            <UiIconsDelete class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="publishProduct()" action="" class="w-full product relative flex items-center justify-center">
          <input @change="uploadImage($event)" type="file" id="productImageInput" class="hidden" accept="image/*">
          <label for="productImageInput" class="product w-full rounded-md bg-accent-500 bg-opacity-[10%] hover:bg-opacity-50 duration-500 ease-in-out grid place-items-center cursor-pointer absolute">
            <div>
              <div class="w-24 h-24 rounded-full bg-accent-200 flex items-center justify-center p-2 relative mx-auto mb-4">
                <div class="w-1.5 h-8 bg-white"></div>
                <div class="w-1.5 h-8 bg-white rotate-90 absolute"></div>
              </div>
              <UiTypographyP>Click to add new image</UiTypographyP>
            </div>
          </label>
        </form>
      </div>
    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data(){
    return {
      productImageFile: '',
      images: []
    }
  },

  methods: {
    uploadImage(event) {
      const ImageFile = event.target.files[0];
      const productImage = {
        id: Math.floor(Math.random()*1000),
      }
      if (ImageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
          productImage.source = e.target.result;
          // Update the images array after reading is complete
          this.images.push(productImage);
        }.bind(this); // Bind 'this' to the component context
        reader.readAsDataURL(ImageFile);
      }
    },

    addNewImage(){
      this.imageCount +=1;
      console.log(this.imageCount)
    },

    deleteImage(image){
      const index = this.images.findIndex(img => img.id === image.id);
      console.log(index)
      if (index !== -1) {
        this.images.splice(index, 1);
      }
    },

    publishProduct(){
      this.$router.push({name: 'username-selling-products'})
    }
  }
}
</script>