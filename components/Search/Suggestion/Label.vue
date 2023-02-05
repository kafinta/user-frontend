<template>
  <li class="bg-accent2-100 dark:bg-accent1-600 p-2 my-2 w-auto">Found {{count}} in <b>{{location}}</b></li>
</template>

<script>
export default {
    props: {
        count: {
            type: Number,
            default: 0
        },
        location: {
            type: String
        }
    }
}
</script>

<style>

</style>