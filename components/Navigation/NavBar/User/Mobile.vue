<template>
  <div :class="menu_revealed ? 'translate-x-0' : '-translate-x-full'" class="z-100 w-full fixed h-screen left-0 top-[65.5px] duration-150 ease-in-out bg-white md:hidden px-6">
    <Accordion>

      <AccordionItem container_class="py-3 px-2"
        trigger_class="font-medium">
        <template #accordion-trigger>
          <h3>Account</h3>
        </template>

        <template #accordion-content>
          <div class="py-3">
            <ul v-if="!signedIn" class="flex flex-col gap-3">
              <li>
                <UiButtonsSecondary>Sign In</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsPrimary>Sign Up</UiButtonsPrimary>
              </li>
            </ul>

            <ul v-if="signedIn">
              <li>
                <UiButtonsSecondary>Profile</UiButtonsSecondary>
              </li>
              <li>
                <UiButtonsSecondary>Dashboard</UiButtonsSecondary>
              </li>
            </ul>
          </div>

        </template>
      </AccordionItem>

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
    menu_revealed: false,
    signedIn: true
  }
}
</script>

<style>

</style>