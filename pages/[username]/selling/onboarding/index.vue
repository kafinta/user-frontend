<template>
  <LayoutsSellerDashboard page_title="Onboarding">
    <div class="flex justify-between items-center p-5 border rounded-xl border-accent-200">
      <div>
        <UiTypographyH3>Percentage Completed</UiTypographyH3>
        <UiTypographyP>You need at least 80% to become a seller. Complete some or all of the tasks below to complete your onboarding.</UiTypographyP>
      </div>

      <ChartPie :value="percentage" :max="100" :isPercent="true" />
    </div>

    <ul class="grid gap-8 lg:grid-cols-2 mt-8">
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Verify Email</UiTypographyH3>
        <UiTypographyP>We need to verify your access to the email you used during registration.</UiTypographyP>
        <UiButtonsPrimary v-if="email_verified" disabled class="mt-6">Verified</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="$router.push({name: 'username-selling-onboarding-email'})" v-else class="mt-6">Verify Email</UiButtonsPrimary >
      </li>
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Create Profile</UiTypographyH3>
        <UiTypographyP>You need to create a profile so that we can get to know you better.</UiTypographyP>
        <UiButtonsPrimary v-if="profile_created" disabled class="mt-6">Created</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="$router.push({name: 'username-selling-onboarding-profile'})" v-else class="mt-6">Create profile</UiButtonsPrimary >
      </li>
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Verify Identity</UiTypographyH3>
        <UiTypographyP>To keep the platform safe and secure for everyone, identity verification is required. Please complete the simple KYC process.</UiTypographyP>
        <UiButtonsPrimary v-if="kyc_verified" disabled class="mt-6">Verified</UiButtonsPrimary>
        <UiButtonsPrimary @clicked="$router.push({name: 'username-selling-onboarding-kyc'})" v-else class="mt-6">Verify KYC</UiButtonsPrimary >
      </li>
    </ul>
  </LayoutsSellerDashboard>
</template>
<script>
import { useOnboarding } from "@/composables/useOnboarding.ts";
import onboarding from "~/middleware/onboarding";
export default {
  data(){
    return {
      email_verified: true,
      profile_created: false,
      kyc_verified: false,
      percentage: onboarding.percentage
    }
  },      

  mounted(){
    const {onboarding} = useOnboarding();
    document.documentElement.style.setProperty('--percent', `${onboarding.percentage}%`);
    if (this.email_verified === true) {
      onboarding.percentage =+ 20
      this.percentage =+ 20
    }
    if (this.profile_created === true) {
      this.percentage =+ 40
    }
    if (this.kyc_verified === true) {
      this.percentage =+ 40
    }
    if (this.percentage == 100) {
      this.$router.push({name: 'username-selling-dashboard'})
    }
  },
}
</script>
