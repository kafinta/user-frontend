<template>
  <div class="border border-accent-100">
    <div class="bg-accent-100 w-full aspect-video"></div>
    <div class="p-5 flex justify-between items-center">
      <div>
        <UiTypographyH3>{{title}}</UiTypographyH3>
        <UiTypographyP :small_text="true">{{count}} photos uploaded</UiTypographyP>
      </div>
      <UiIconsMore class="w-5 h-5 cursor-pointer"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Project Name'
    },
    count: {
      type: Number,
      default: 7
    },
  },
}
</script>