<template>
  <LayoutsDashboard mode="seller" pageTitle="Onboarding">
    <div class="p-5 border rounded-lg border-accent-200 flex justify-between flex-wrap items-center">
      <div>
        <UiTypographyH3>Seller Onboarding</UiTypographyH3>
        <UiTypographyP>Complete all required steps to start selling on our platform.</UiTypographyP>
      </div>

      <!-- Progress Summary (mobile) -->
        <UiTypographyH2 color="primary" class="font-bold">
          {{ completionSummary.required_completed }}/{{ completionSummary.required_total }}
        </UiTypographyH2>
    </div>

    <!-- Required Steps -->
    <div class="mt-8">
      <UiTypographyH3 class="mb-4">Required Steps</UiTypographyH3>
      <ul class="grid gap-6 lg:grid-cols-2">
        <!-- Loading skeletons -->
        <template v-if="isLoading">
          <UiSkeleton v-for="i in 4" :key="i" height="10rem" />
        </template>

        <!-- Required step cards -->
        <template v-else>
          <!-- Email Verification -->
          <li class="p-5 rounded-lg border border-accent-200">
            <div class="flex justify-between items-center mb-3">
              <UiTypographyH3>Verify Email</UiTypographyH3>
              <div class="flex items-center gap-2">
                <UiIconsSuccess v-if="emailVerified" class="text-green-600 w-5 h-5" />
                <span v-else class="bg-gray-400 w-5 h-5 rounded-full"></span>
              </div>
            </div>
            <UiTypographyP class="text-sm text-gray-600 mb-4">We need to verify your access to the email you used during registration.</UiTypographyP>
            <ClientOnly>
              <UiButtonsPrimary v-if="emailVerified" disabled :flexdisplay="true">Verified</UiButtonsPrimary>
              <UiButtonsPrimary :url="{ name: 'username-selling-onboarding-email', params: { username: $route.params.username } }" v-else :flexdisplay="true">Verify Email</UiButtonsPrimary>
            </ClientOnly>
          </li>

          <!-- Phone Verification -->
          <li class="p-5 rounded-lg border border-accent-200">
            <div class="flex justify-between items-center mb-3">
              <UiTypographyH3>Verify Phone</UiTypographyH3>
              <div class="flex items-center gap-2">
                <UiIconsSuccess v-if="phoneVerified" class="text-green-600 w-5 h-5" />
                <span v-else class="bg-gray-400 w-5 h-5 rounded-full"></span>
              </div>
            </div>
            <UiTypographyP class="text-sm text-gray-600 mb-4">Please verify your phone number to ensure secure communication.</UiTypographyP>
            <ClientOnly>
              <UiButtonsPrimary v-if="phoneVerified" disabled :flexdisplay="true">Verified</UiButtonsPrimary>
              <UiButtonsPrimary :url="{ name: 'username-selling-onboarding-phone', params: { username: $route.params.username } }" v-else :flexdisplay="true">Verify Phone</UiButtonsPrimary>
            </ClientOnly>
          </li>

          <!-- Business Profile -->
          <li class="p-5 rounded-lg border border-accent-200">
            <div class="flex justify-between items-center mb-3">
              <UiTypographyH3>Business Profile</UiTypographyH3>
              <div class="flex items-center gap-2">
                <UiIconsSuccess v-if="profileCreated" class="text-green-600 w-5 h-5" />
                <span v-else class="bg-gray-400 w-5 h-5 rounded-full"></span>
              </div>
            </div>
            <UiTypographyP class="text-sm text-gray-600 mb-4">Provide your business information so that customers can learn more about you.</UiTypographyP>
            <ClientOnly>
              <UiButtonsPrimary v-if="profileCreated" disabled :flexdisplay="true">Completed</UiButtonsPrimary>
              <UiButtonsPrimary :url="{ name: 'username-selling-onboarding-profile', params: { username: $route.params.username } }" v-else :flexdisplay="true">Complete Profile</UiButtonsPrimary>
            </ClientOnly>
          </li>

          <!-- Seller Agreement -->
          <li class="p-5 rounded-lg border border-accent-200">
            <div class="flex justify-between items-center mb-3">
              <UiTypographyH3>Seller Agreement</UiTypographyH3>
              <div class="flex items-center gap-2">
                <UiIconsSuccess v-if="agreementAccepted" class="text-green-600 w-5 h-5" />
                <span v-else class="bg-gray-400 w-5 h-5 rounded-full"></span>
              </div>
            </div>
            <UiTypographyP class="text-sm text-gray-600 mb-4">Review and accept our seller terms and conditions to start selling on our platform.</UiTypographyP>
            <ClientOnly>
              <UiButtonsPrimary v-if="agreementAccepted" disabled :flexdisplay="true">Accepted</UiButtonsPrimary>
              <UiButtonsPrimary :url="{ name: 'username-selling-onboarding-agreement', params: { username: $route.params.username } }" v-else :flexdisplay="true">Review Agreement</UiButtonsPrimary>
            </ClientOnly>
          </li>
        </template>
      </ul>
    </div>

    <!-- Optional Steps Enhancement (shown after required steps are complete) -->
    <div v-if="!isLoading && canComplete" class="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
      <div class="text-center mb-6">
        <div class="text-4xl mb-2">🎉</div>
        <UiTypographyH3 class="text-green-700 mb-2">Ready to start selling!</UiTypographyH3>
        <UiTypographyP class="text-green-600">You can also complete these optional steps to enhance your seller profile:</UiTypographyP>
      </div>

      <div class="grid gap-4 md:grid-cols-2 mb-6">
        <!-- KYC Verification -->
        <div class="p-4 bg-white rounded-lg border border-green-200">
          <div class="flex items-center justify-between mb-2">
            <UiTypographyH4 class="text-gray-700">KYC Verification</UiTypographyH4>
            <span v-if="kycVerified" class="text-green-600">✅</span>
            <span v-else class="text-gray-400">⚪</span>
          </div>
          <UiTypographyP class="text-sm text-gray-600 mb-3">Increase buyer trust and unlock higher transaction limits.</UiTypographyP>
          <UiButtonsSecondary v-if="!kycVerified" @clicked="goToKycVerification" size="small" class="w-full">
            Verify Identity
          </UiButtonsSecondary>
          <UiButtonsSecondary v-else disabled size="small" class="w-full">
            Verified
          </UiButtonsSecondary>
        </div>

        <!-- Payment Information -->
        <div class="p-4 bg-white rounded-lg border border-green-200">
          <div class="flex items-center justify-between mb-2">
            <UiTypographyH4 class="text-gray-700">Payment Setup</UiTypographyH4>
            <span v-if="paymentInfoUpdated" class="text-green-600">✅</span>
            <span v-else class="text-gray-400">⚪</span>
          </div>
          <UiTypographyP class="text-sm text-gray-600 mb-3">Set up payment details to receive payments from sales.</UiTypographyP>
          <UiButtonsSecondary v-if="!paymentInfoUpdated" @clicked="goToPaymentInfo" size="small" class="w-full">
            Set Up Payment
          </UiButtonsSecondary>
          <UiButtonsSecondary v-else disabled size="small" class="w-full">
            Completed
          </UiButtonsSecondary>
        </div>
      </div>

      <!-- Complete Onboarding Button -->
      <div class="text-center">
        <UiButtonsPrimary @clicked="completeOnboarding" :loading="isCompletingOnboarding" class="w-full max-w-md mx-auto">
          Complete Onboarding & Start Selling
        </UiButtonsPrimary>
      </div>
    </div>

    <!-- Missing Requirements -->
    <div v-else-if="!isLoading && missingRequiredSteps.length > 0" class="mt-8 p-4 border border-accent-200  rounded-lg">
      <UiTypographyH3 class="text-secondary">Complete These Required Steps:</UiTypographyH3>
      <ul class="list-disc pl-5 mt-2">
        <li v-for="requirement in missingRequiredSteps" :key="requirement" class="text-secondary">
          {{ formatRequirement(requirement) }}
        </li>
      </ul>
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

import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboarding } from "@/composables/useOnboarding.ts";
import { useAuthStore } from '~/stores/auth';
import { useAuthApi } from '~/composables/useAuthApi';
import { useCustomFetch } from '~/composables/useCustomFetch';
import { useAppToast } from '~/utils/toastify';

const router = useRouter();
const auth = useAuthStore();
const onboarding = useOnboarding();
const authApi = useAuthApi();
const toast = useAppToast();

// Local state
const isLoading = ref(false);
const isCompletingOnboarding = ref(false);

// Computed properties from onboarding composable
const canComplete = computed(() => onboarding.canComplete.value);
const completionSummary = computed(() => onboarding.completionSummary.value);
const missingRequiredSteps = computed(() => onboarding.missingRequiredSteps.value);
const emailVerified = computed(() => onboarding.emailVerified.value);
const phoneVerified = computed(() => onboarding.phoneVerified.value);
const profileCreated = computed(() => onboarding.profileCreated.value);
const agreementAccepted = computed(() => onboarding.agreementAccepted.value);
const kycVerified = computed(() => onboarding.kycVerified.value);
const paymentInfoUpdated = computed(() => onboarding.paymentInfoUpdated.value);

// Fetch progress from API (page handles its own API call)
async function fetchProgress() {
  isLoading.value = true;

  try {
    const response = await useCustomFetch('/api/seller/progress', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data) {
      // Update the onboarding composable state
      onboarding.progress.value = response.data;
    }

    return response;
  } catch (error) {
    console.error('Failed to fetch seller progress:', error);
    toast.error('Error', 'Failed to load onboarding progress');
  } finally {
    isLoading.value = false;
  }
}

// Initialize auth and fetch progress
onMounted(async () => {
  // If user is already a seller, they've completed onboarding
  if (auth.isSeller) {
    // Redirect to seller dashboard
    router.push({
      name: 'username-selling-dashboard',
      params: { username: router.currentRoute.value.params.username }
    });
  } else {
    // Fetch seller progress from the API
    await fetchProgress();
  }
});

// Format requirement text for display
function formatRequirement(requirement) {
  // Convert snake_case to readable text
  const formatted = requirement
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return formatted;
}

// Navigation methods for optional steps (still need click handlers for these)
function goToKycVerification() {
  router.push({
    name: 'username-selling-onboarding-kyc',
    params: { username: router.currentRoute.value.params.username }
  });
}

function goToPaymentInfo() {
  router.push({
    name: 'username-selling-onboarding-payment',
    params: { username: router.currentRoute.value.params.username }
  });
}



// Complete onboarding and redirect to dashboard (page handles its own API call)
async function completeOnboarding() {
  isCompletingOnboarding.value = true;

  try {
    const response = await useCustomFetch('/api/seller/complete-onboarding', {
      method: 'POST'
    });

    if (response.status === 'success') {
      toast.success('Success', response.message || 'Onboarding completed successfully');

      // Refresh auth store to update roles
      await authApi.fetchRoles();

      // Redirect to seller dashboard
      router.push({
        name: 'username-selling-dashboard',
        params: { username: router.currentRoute.value.params.username }
      });
    } else {
      toast.error('Error', response.message || 'Failed to complete onboarding');
    }
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
    toast.error('Error', 'An unexpected error occurred');
  } finally {
    isCompletingOnboarding.value = false;
  }
}
</script>
