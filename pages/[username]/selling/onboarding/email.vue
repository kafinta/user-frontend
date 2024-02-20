<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <main class="w-full lg:w-1/2 2xl:w-1/2 mx-auto">
      <UiTypographyH3 class="text-center">Email Verification</UiTypographyH3>
      <img src="/images/open_email.svg" alt="Open Email Icon" class="w-56 mx-auto mt-6">
      <UiTypographyP class="mt-4">We've sent a new verification to your email. Enter the code to verify your email.</UiTypographyP>
      <form action="" class="grid gap-6 w-full mt-6">
        <FormInput :centerText="true" label="Verification code" v-model:inputValue="code" placeholder="X X X X X X"></FormInput>
        <FormButton class="max-w-64 mx-auto">Verify Email</FormButton>
      </form>
    </main>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data() {
    return {
      code: ''
    };
  },
  methods: {
  },
}
</script>