<template>
    <UiTypographyH3>{{ name }}</UiTypographyH3>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            default: 'Product name'
        }
    }
}
</script>