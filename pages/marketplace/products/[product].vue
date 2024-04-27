<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div class="grid lg:grid-cols-5 gap-10">
        <div class="col-span-1 lg:col-span-3">
          <ProductsPageCarousel />
          <ProductsPageSidebar v-if="!isDesktop" class="my-5" /> 
          <hr class="lg:hidden">

          <div class="py-5">
            <UiTypographyH2>Product Details</UiTypographyH2>
            <UiTypographyP>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti, nisi placeat corrupti veritatis facilis molestias mollitia! Id in doloremque doloribus eaque quasi quisquam velit eligendi unde, molestias, maiores sint odit. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum adipisci libero veniam, ad eum quae aliquam. Maiores ipsam nisi dolor autem officia sint atque ipsa cumque necessitatibus nihil? Vero, culpa. <br> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio repudiandae magnam, rerum natus voluptas reiciendis, quasi expedita nostrum optio obcaecati similique quisquam. Delectus odit autem commodi ducimus eos quasi fugiat. <br>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Enim laboriosam veniam tenetur quidem natus, magni dolorem rerum debitis reprehenderit repellat iste et! Doloremque dignissimos repellendus modi blanditiis eius, repellat consequatur.</UiTypographyP>
          </div>
          <div class="py-5">
            <UiTypographyH2>Product Specifications</UiTypographyH2>
            <table class="border border-accent-200 border-collapse table-fixed mt-3 w-full">
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Product ID</td>
                <td class="border border-accent-200 px-5 py-3">83763656752</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Manufactured by</td>
                <td class="border border-accent-200 px-5 py-3">Test brand name</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Sold by</td>
                <td class="border border-accent-200 px-5 py-3">Test brand name</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Size</td>
                <td class="border border-accent-200 px-5 py-3">W 77.25" / D 31.5" / H 33.75"</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Weight</td>
                <td class="border border-accent-200 px-5 py-3">114.2 lb.</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Color</td>
                <td class="border border-accent-200 px-5 py-3">Beige + Dark Walnut</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Assembly Required</td>
                <td class="border border-accent-200 px-5 py-3">Yes</td>
              </tr>
              <tr>
                <td class="border border-accent-200 bg-accent-100 px-5 py-3 font-medium">Category</td>
                <td class="border border-accent-200 px-5 py-3">Category name</td>
              </tr>
            </table>
          </div>

          <hr>
          <div class="py-4">
            <UiTypographyH2>Customer Reviews</UiTypographyH2>
            <div class="p-5 border border-accent-200 rounded-md mt-2 ">
              <div class="flex gap-5 lg:gap-10 items-center">
                <div>
                  <UiTypographyH2>{{this.review}} out of 5</UiTypographyH2>
                  <div class="flex gap-2 items-center">
                    <UiIconsStar v-for="n in 5" :key="n" :opacity="getStarOpacity(n)" class="w-7 text-primary" />
                  </div>
                  <UiTypographyP class="mt-2">{{review_count}} ratings and reviews</UiTypographyP>
                </div>

                <div class="grid gap-1">
                  <div class="flex gap-2 items-center">
                    <UiTypographyP>5</UiTypographyP>
                    <UiIconsStar class="w-5 text-primary" />
                    <div class="h-2 rounded-md w-36 bg-accent-100">
                      <div class="w-[75%] h-2 bg-primary rounded-md"></div>
                    </div>
                    <UiTypographyP>75%</UiTypographyP>
                  </div>

                  <div class="flex gap-2 items-center">
                    <UiTypographyP>4</UiTypographyP>
                    <UiIconsStar class="w-5 text-primary" />
                    <div class="h-2 rounded-md w-36 bg-accent-100">
                      <div class="w-[75%] h-2 bg-primary rounded-md"></div>
                    </div>
                    <UiTypographyP>75%</UiTypographyP>
                  </div>

                  <div class="flex gap-2 items-center">
                    <UiTypographyP>3</UiTypographyP>
                    <UiIconsStar class="w-5 text-primary" />
                    <div class="h-2 rounded-md w-36 bg-accent-100">
                      <div class="w-[75%] h-2 bg-primary rounded-md"></div>
                    </div>
                    <UiTypographyP>75%</UiTypographyP>
                  </div>

                  <div class="flex gap-2 items-center">
                    <UiTypographyP>2</UiTypographyP>
                    <UiIconsStar class="w-5 text-primary" />
                    <div class="h-2 rounded-md w-36 bg-accent-100">
                      <div class="w-[75%] h-2 bg-primary rounded-md"></div>
                    </div>
                    <UiTypographyP>75%</UiTypographyP>
                  </div>

                  <div class="flex gap-2 items-center">
                    <UiTypographyP>1</UiTypographyP>
                    <UiIconsStar class="w-5 text-primary" />
                    <div class="h-2 rounded-md w-36 bg-accent-100">
                      <div class="w-[75%] h-2 bg-primary rounded-md"></div>
                    </div>
                    <UiTypographyP>75%</UiTypographyP>
                  </div>
                  
                </div>
              </div>
              <hr class="border-accent-200 my-5">
              <ul class="grid gap-5 divide-y divide-accent-200">
                <li>
                  <article class="grid gap-2">
                    <div class="flex gap-2">
                      <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
                    </div>
                    <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
                    <div class="flex justify-between items-center">
                      <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
                      <div class="text-green-500 flex items-center gap-2">
                        <UiIconsBadge />
                        <UiTypographyP>Verified purchase</UiTypographyP>
                      </div>

                    </div>
                  </article>
                </li>
                <li class="pt-5">
                  <article class="grid gap-2">
                    <div class="flex gap-2">
                      <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
                    </div>
                    <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
                    <div class="flex justify-between items-center">
                      <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
                      <div class="text-green-500 flex items-center gap-2">
                        <UiIconsBadge />
                        <UiTypographyP>Verified purchase</UiTypographyP>
                      </div>

                    </div>
                  </article>
                </li>
                <li class="pt-5">
                  <article class="grid gap-2">
                    <div class="flex gap-2">
                      <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
                    </div>
                    <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
                    <div class="flex justify-between items-center">
                      <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
                      <div class="text-green-500 flex items-center gap-2">
                        <UiIconsBadge />
                        <UiTypographyP>Verified purchase</UiTypographyP>
                      </div>

                    </div>
                  </article>
                </li>
                <li class="pt-5">
                  <article class="grid gap-2">
                    <div class="flex gap-2">
                      <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
                    </div>
                    <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
                    <div class="flex justify-between items-center">
                      <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
                      <div class="text-green-500 flex items-center gap-2">
                        <UiIconsBadge />
                        <UiTypographyP>Verified purchase</UiTypographyP>
                      </div>

                    </div>
                  </article>
                </li>
                <li class="pt-5">
                  <article class="grid gap-2">
                    <div class="flex gap-2">
                      <UiIconsStar v-for="$ in 5" class="w-7 text-primary" />
                    </div>
                    <UiTypographyP>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio, ullam ex. Culpa, dolores alias. In excepturi natus eaque dolorem fuga sint rerum facilis! Unde id blanditiis modi impedit doloremque rerum.</UiTypographyP>
                    <div class="flex justify-between items-center">
                      <UiTypographyP>{{ new Date().toLocaleDateString() }} by Reviewer</UiTypographyP>
                      <div class="text-green-500 flex items-center gap-2">
                        <UiIconsBadge />
                        <UiTypographyP>Verified purchase</UiTypographyP>
                      </div>

                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ProductsPageSidebar v-if="isDesktop" />
      </div>
    </Container>

  </LayoutsMarketplace>
</template>
<script>
export default {
  data(){
    return {
      isDesktop: false,
      review: 3.5,
      review_count: 50
    }
  },

  methods: {
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024;
    },

    getStarOpacity(index) {
      if (this.review % 1 > 0.7) {
        return Math.round(this.review) >= index ? 1 : 0.4;
      } else {
        return Math.floor(this.review) >= index ? 1 : 0.4;
      }
    },
  },

  mounted() {
    this.isDesktop = window.innerWidth >= 1024;
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>