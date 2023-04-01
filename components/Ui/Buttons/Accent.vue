<template>
  <button @click="$emit('clicked')" class="font-medium text-sm xl:text-base 2xl:text-lg text-secondary hover:text-primary ease-in-out duration-500 text-left bg-accent-50 hover:bg-accent-100 select-none py-2 w-full focus:bg-accent-100 focus:text-primary outline-none px-5">
    <slot />
  </button>
</template>