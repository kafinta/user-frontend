<template>
  <LayoutsMarketplace>
    <Container :addTopBottomPadding="false">
      <div class="flex gap-16">
        <div class="w-3/5">
          <div class="bg-accent-100 w-full aspect-[3/2]"></div>
          <UiTypographyP>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea odio facilis aliquam adipisci laboriosam fugiat nulla inventore aperiam. Explicabo nulla, quidem voluptate iste vitae sapiente ratione quas ut magnam illo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus atque distinctio repudiandae quae architecto accusamus quas modi recusandae, repellat quidem. Debitis tenetur cupiditate nihil odio. Facilis repellendus id nobis libero. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel vitae veritatis animi maiores, illo quibusdam perspiciatis vero temporibus quae, doloribus adipisci blanditiis quasi architecto officiis saepe maxime doloremque expedita hic!</UiTypographyP>
        </div>

        <div class="sticky top-20">
          <UiTypographyH2>Product Name</UiTypographyH2>
          <UiTypographyP>By Test supplier name</UiTypographyP>
          <div class="flex gap-0.5 items-center mt-3">
            <UiIconsStar v-for="star in 5" class="w-5 text-primary" />
          </div>
        </div>
      </div>
    </Container>

  </LayoutsMarketplace>
</template>