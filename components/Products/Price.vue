<template>
    <UiTypographyP>&dollar;{{ price }}</UiTypographyP>
</template>
<script>
export default {
    props: {
        price: {
            type: Number,
            default: 999999
        },
        currency: {
            type: String,
            default: `&dollar;`
        }
    }
}
</script>