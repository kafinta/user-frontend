<template>
    <li class="border border-accent-200 rounded-xl cursor-pointer">
        <ProductsImage :imagePath="image" class="rounded-t-xl" />
        <aside class="p-4">
            <ProductsName class="text-secondary text-xl">{{ title }}</ProductsName>
            <div class="flex items-center justify-between mt-3">
                <ProductsRating :rating="review" />
                <ProductsPrice></ProductsPrice>
            </div>
        </aside>
    </li>
</template>
<script>
export default {
    props: {
        image: String,
        title: String,
        review: {
            default: 4.3,
            type: Number
        }
    },
}
</script>