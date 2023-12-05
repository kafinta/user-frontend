<template>
    <li class="border border-accent-100 rounded-xl">
        <ProductsImage :imagePath="image" class="rounded-t-xl" />
        <aside class="p-4">
            <h3 class="text-secondary text-xl">{{ title }}</h3>
            <ProductsPrice></ProductsPrice>
        </aside>
    </li>
</template>
<script>
export default {
    props: {
        image: String,
        title: String
    }
}
</script>