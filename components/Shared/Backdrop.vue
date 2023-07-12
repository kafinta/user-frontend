<template>
    <transition name="fade">
        <div v-show="show" @click="$emit('close')"
            class="fixed h-screen w-full bg-secondary bg-opacity-80 z-50 cursor-pointer backdrop-blur-sm">
        </div>
        <slot />
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            default: false,
            type: Boolean
        }
    }

}
</script>

<style>
</style>