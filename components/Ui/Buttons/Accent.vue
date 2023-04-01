<template>
  <button @click="$emit('clicked')" class="font-medium text-sm xl:text-base 2xl:text-lg text-secondary hover:text-primary ease-in-out duration-500 bg-accent-50 hover:bg-accent-100 select-none py-3 w-full focus:bg-accent-100 focus:text-primary outline-none">
    <slot />
  </button>
</template>