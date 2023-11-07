<template>
    <li class="flex border border-accent-100 items-center h-20">
        <UserProductsImage :imagePath="image" class="h-full" />
        <aside class="p-4">
            <UserProductsName :name="title"/>
            <UserProductsPrice></UserProductsPrice>
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