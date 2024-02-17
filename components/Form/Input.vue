<template>
    <div class="w-full">
      <label :for="label" class="text-sm text-secondary mb-1 block">{{label}}</label>
      <input @input="$emit('update:inputValue', $event.target.value)" @focus="focus()" :class="{'border-red-600 focus:border-red-600 active:border-red-600' : error, 'text-center placeholder-center' : centerText, }"  class="w-full py-3 px-4 border text-sm outline-none border-secondary ring-0 focus:outline-none focus:border-primary active:border-primary rounded-md active:text-primary focus:text-primary text-secondary border-opacity-20 active:border-opacity-100 focus:border-opacity-100 duration-300 ease-out bg-white" autocomplete="off"
    :type="type" :disabled="disabled" :placeholder="placeholder" :value="inputValue" ref="input" :id="label">
    </div>
</template>

<script>
  export default {
    name:"TextInput",
    props: {
      extraClass: String,
      error: Boolean,
      label: String,
      inputValue: String,
      type: String,
      disabled: Boolean,
      placeholder:String,
      centerText: {
        default: false,
        type: Boolean
      }
    },

    methods: {
      focus() {
        this.$refs.input.focus()
      },
    }
  }
</script>

