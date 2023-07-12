<template>
  <button @click="$emit('clicked')" class="font-medium text-sm xl:text-base 2xl:text-lg text-secondary hover:text-primary ease-in-out duration-500 border-b border-transparent hover:border-primary select-none text-left outline-none">
    <slot />
  </button>
</template>