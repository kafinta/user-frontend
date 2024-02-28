<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <div class="flex justify-between items-center p-5 border rounded-xl border-accent-100">
      <div>
        <UiTypographyH3>Percentage Completed</UiTypographyH3>
        <UiTypographyP>You need at least 80% to become a seller. Complete some or all of the tasks below to complete your onboarding.</UiTypographyP>
      </div>

      <div class="relative flex items-center justify-center">
        <div class="h-20 w-20 rounded-full p-1.5 radial bg-primary">
          <div class="bg-white rounded-full h-full w-full grid place-items-center">
            <UiTypographyP>{{percentage}}%</UiTypographyP>
          </div>
        </div>
      </div>
    </div>

    <ul class="grid gap-8 lg:grid-cols-2 mt-8">
      <li class="p-5 rounded-xl border border-accent-100">
        <UiTypographyH3>Verify Email</UiTypographyH3>
        <UiTypographyP>We need to verify your access to the email you used during registration.</UiTypographyP>
        <UiButtonsPrimary v-if="email_verified" disabled class="mt-6">Verified</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="$router.push({name: 'username-selling-onboarding-email'})" v-else class="mt-6">Verify Email</UiButtonsPrimary >
      </li>
      <li class="p-5 rounded-xl border border-accent-100">
        <UiTypographyH3>Create Profile</UiTypographyH3>
        <UiTypographyP>You need to create a profile so that we can get to know you better.</UiTypographyP>
        <UiButtonsPrimary v-if="profile_created" disabled class="mt-6">Created</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="$router.push({name: 'username-selling-onboarding-profile'})" v-else class="mt-6">Create profile</UiButtonsPrimary >
      </li>
      <li class="p-5 rounded-xl border border-accent-100">
        <UiTypographyH3>Verify Identity</UiTypographyH3>
        <UiTypographyP>To keep the platform safe and secure for everyone, identity verification is required. Please complete the simple KYC process.</UiTypographyP>
        <UiButtonsPrimary v-if="kyc_verified" disabled class="mt-6">Verified</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="$router.push({name: 'username-selling-onboarding-kyc'})" v-else class="mt-6">Verify KYC</UiButtonsPrimary >
      </li>
    </ul>
  </LayoutsSellerDashboard>
</template>
<script>
export default {
  data(){
    return {
      email_verified: false,
      profile_created: false,
      kyc_verified: false,
      percentage: 0
    }
  },      

  mounted(){
    document.documentElement.style.setProperty('--percent', `${this.percentage}%`);
    if (this.email_verified === true) {
      this.percentage = this.percentage + 20
      document.documentElement.style.setProperty('--percent', `${this.percentage}%`);
    }
    if (this.profile_created === true) {
      this.percentage = this.percentage + 40
      document.documentElement.style.setProperty('--percent', `${this.percentage}%`);
    }
    if (this.kyc_verified === true) {
      this.percentage = this.percentage + 40
      document.documentElement.style.setProperty('--percent', `${this.percentage}%`);
    }
    if (this.percentage == 100) {
      this.$router.push({name: 'usernamw-selling-dashboard'})
    }
  },
}
</script>
<style>
.radial {
  background: conic-gradient(#C9B14F var(--percent), #eaeaea 0deg);
}
</style>