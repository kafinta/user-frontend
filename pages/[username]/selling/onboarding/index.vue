<template>
  <LayoutsDashboard mode="seller" page_title="Onboarding">
    <div class="flex justify-between items-center p-5 border rounded-xl border-accent-200">
      <div>
        <UiTypographyH3>Percentage Completed</UiTypographyH3>
        <UiTypographyP>You need at least 80% to become a seller. Complete some or all of the tasks below to complete your onboarding.</UiTypographyP>
      </div>

      <ChartPie :value="Number(onboardingState.percentage)" :max="100" :isPercent="true" />
    </div>

    <ul class="grid gap-8 lg:grid-cols-2 mt-8">
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Verify Email</UiTypographyH3>
        <UiTypographyP>We need to verify your access to the email you used during registration.</UiTypographyP>
        <ClientOnly>
          <UiButtonsPrimary v-if="onboardingState.emailVerified.value" disabled class="mt-6">Verified</UiButtonsPrimary>
          <UiButtonsPrimary :url="{path: 'email'}" v-else class="mt-6">Verify Email</UiButtonsPrimary >
        </ClientOnly>
      </li>
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Verify Phone</UiTypographyH3>
        <UiTypographyP>Please verify your phone number to ensure secure communication.</UiTypographyP>
        <ClientOnly>
          <UiButtonsPrimary v-if="onboardingState.phoneVerified.value" disabled class="mt-6">Verified</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="goToPhoneVerification" v-else class="mt-6">Verify Phone</UiButtonsPrimary >
        </ClientOnly>
      </li>
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Basic Information</UiTypographyH3>
        <UiTypographyP>You need to provide your basic information so that we can get to know you better.</UiTypographyP>
        <ClientOnly>
          <UiButtonsPrimary v-if="onboardingState.profileCreated.value" disabled class="mt-6">Completed</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="goToProfileCreation" v-else class="mt-6">Complete Profile</UiButtonsPrimary >
        </ClientOnly>
      </li>
      <li class="p-5 rounded-xl border border-accent-200">
        <UiTypographyH3>Verify Identity</UiTypographyH3>
        <UiTypographyP>To keep the platform safe and secure for everyone, identity verification is required. Please complete the simple KYC process.</UiTypographyP>
        <ClientOnly>
          <UiButtonsPrimary v-if="onboardingState.kycVerified.value" disabled class="mt-6">Verified</UiButtonsPrimary>
          <UiButtonsPrimary @clicked="goToKycVerification" v-else class="mt-6">Verify KYC</UiButtonsPrimary >
        </ClientOnly>
      </li>
    </ul>

    <div class="mt-8" v-if="onboardingState.percentage >= 80">
      <UiButtonsPrimary @clicked="completeOnboarding" class="w-full">Complete Onboarding</UiButtonsPrimary>
    </div>
  </LayoutsDashboard>
</template>
<script setup>
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
  // Note: We don't require seller role for onboarding since this is where users become sellers
});

import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboarding } from "@/composables/useOnboarding.ts";
import { useAuthStore } from '~/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const onboardingState = useOnboarding();

// Initialize auth store
onMounted(() => {
  console.log("Onboarding page mounted, auth state:", {
    isVerified: auth.isVerified,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user
  });

  // Initialize auth store
  auth.initialize();

  // If user is already a seller, they've completed onboarding
  if (auth.isSeller) {
    console.log("User is a seller, completing onboarding");
    onboardingState.completeOnboarding();

    // For demo purposes, we'll set all steps as completed
    onboardingState.updateStep('profile', true);
    onboardingState.updateStep('kyc', true);
  } else {
    console.log("User is not a seller, activating onboarding");
    // Make sure onboarding is active
    onboardingState.isOnboardingActive.value = true;
  }

  console.log("Onboarding state:", {
    isActive: onboardingState.isOnboardingActive.value,
    percentage: onboardingState.percentage,
    emailVerified: onboardingState.emailVerified,
    profileCreated: onboardingState.profileCreated.value,
    kycVerified: onboardingState.kycVerified.value
  });
});

// Watch for changes in email verification status
watch(() => onboardingState.emailVerified, () => {
  // No need to call calculatePercentage anymore as it's computed
});

// Navigation methods
function goToEmailVerification() {
  router.push({
    name: 'username-selling-onboarding-email',
    params: { username: router.currentRoute.value.params.username }
  });
}

function goToPhoneVerification() {
  router.push({
    name: 'username-selling-onboarding-phone',
    params: { username: router.currentRoute.value.params.username }
  });
}

function goToProfileCreation() {
  router.push({
    name: 'username-selling-onboarding-profile',
    params: { username: router.currentRoute.value.params.username }
  });
}

function goToKycVerification() {
  router.push({
    name: 'username-selling-onboarding-kyc',
    params: { username: router.currentRoute.value.params.username }
  });
}

// Complete onboarding and redirect to dashboard
function completeOnboarding() {
  // In a real app, you would make an API call to update the user's role
  // For demo purposes, we'll just update the local state
  onboardingState.completeOnboarding();

  // Redirect to seller dashboard
  router.push({
    name: 'username-selling-dashboard',
    params: { username: router.currentRoute.value.params.username }
  });
}
</script>
