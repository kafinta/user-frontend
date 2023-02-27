<template>
  <div :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="z-100 w-full fixed h-screen left-0 top-[65.5px] duration-500 ease-in-out bg-white md:hidden px-6">
    <Accordion>

      <AccordionItem container_class="py-3 px-2"
        trigger_class="font-medium">

        <template #accordion-trigger>
          <h3>Categories</h3>
        </template>

        <template #accordion-content>
          <div class="py-3 px-2">
            <ul>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
            </ul>
          </div>

        </template>
      </AccordionItem>

      <AccordionItem container_class="py-3 px-2"
        trigger_class="font-medium" >

        <template #accordion-trigger>
          <h3>Professionals</h3>
        </template>

        <template #accordion-content>
          <div class="py-3 px-2">
            <ul>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Link</UiButtonsSecondary>
              </li>
            </ul>

          </div>

        </template>
      </AccordionItem>

      <AccordionItem container_class="py-3 px-2"
        trigger_class="font-medium">
        <template #accordion-trigger>
          <h3>Language</h3>
        </template>

        <template #accordion-content>
          <div class="py-3">
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.</span>
          </div>

        </template>
      </AccordionItem>

      <AccordionItem container_class="py-3 px-2"
        trigger_class="font-medium">
        <template #accordion-trigger>
          <h3>Tags</h3>
        </template>

        <template #accordion-content>
          <div class="py-3">
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.</span>
          </div>

        </template>
      </AccordionItem>

    </Accordion>
  </div>
</template>

<script>
export default {
  props: {
    menu_revealed: false
  }
}
</script>

<style>

</style>