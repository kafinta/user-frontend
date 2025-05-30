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
          <UiSkeleton v-for="i in 4" :key="i" height="12rem" />
        </template>

        <!-- Dynamic required step cards -->
        <template v-else>
          <li
            v-for="step in requiredSteps"
            :key="step.id"
            class="p-5 rounded-lg border border-accent-200"
          >
            <div class="flex justify-between items-center mb-3">
              <UiTypographyH3>{{ step.name }}</UiTypographyH3>
              <div class="flex items-center gap-2">
                <UiIconsSuccess v-if="step.completed" class="text-green-600 w-5 h-5" />
                <span v-else class="bg-accent-400 w-5 h-5 rounded-full"></span>
              </div>
            </div>

            <!-- Benefit description -->
            <UiTypographyP class="text-sm text-accent-600 mb-2">{{ step.benefit }}</UiTypographyP>

            <!-- Estimated time -->
            <UiTypographyP class="text-xs text-accent-500 mb-4">
              <span class="inline-flex items-center gap-1">
                <UiIconsClock class="w-3 h-3" />
                {{ step.estimated_time }}
              </span>
            </UiTypographyP>

            <ClientOnly>
              <UiButtonsPrimary
                v-if="step.completed"
                disabled
                :flexdisplay="true"
              >
                {{ getCompletedButtonText(step.id) }}
              </UiButtonsPrimary>
              <UiButtonsPrimary
                v-else
                :url="getStepUrl(step.id)"
                :flexdisplay="true"
              >
                {{ getActionButtonText(step.id) }}
              </UiButtonsPrimary>
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

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <!-- Dynamic optional step cards -->
        <div
          v-for="step in optionalSteps"
          :key="step.id"
          class="p-4 bg-white rounded-lg border border-green-200"
        >
          <div class="flex items-center justify-between mb-2">
            <UiTypographyH3 class="text-accent-700">{{ step.name }}</UiTypographyH3>
            <UiIconsSuccess v-if="step.completed" class="text-green-600 w-5 h-5" />
            <span v-else class="bg-accent-400 w-5 h-5 rounded-full"></span>
          </div>

          <!-- Benefit description -->
          <UiTypographyP class="text-sm text-accent-600 mb-2 h-[3lh]">{{ step.benefit }}</UiTypographyP>

          <!-- Estimated time -->
          <UiTypographyP class="text-xs text-accent-500 mb-3">
            <span class="inline-flex items-center gap-1">
              <UiIconsClock class="w-3 h-3 text-secondary" />
              {{ step.estimated_time }}
            </span>
          </UiTypographyP>

          <UiButtonsPrimary
            v-if="!step.completed"
            :url="getOptionalStepUrl(step.id)"
            size="small"
            class="w-full"
          >
            {{ getOptionalActionButtonText(step.id) }}
          </UiButtonsPrimary>
          <UiButtonsPrimary v-else disabled size="small" class="w-full">
            {{ getOptionalCompletedButtonText(step.id) }}
          </UiButtonsPrimary>
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

useHead({
  title: 'Seller Onboarding | Kafinta',
  meta: [
    { name: 'description', content: 'Complete your seller onboarding to start selling on Kafinta' }
  ]
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
const toast = useAppToast();

// Local state
const isLoading = ref(false);
const isCompletingOnboarding = ref(false);

// Computed properties from onboarding composable
const canComplete = computed(() => onboarding.canComplete.value);
const completionSummary = computed(() => onboarding.completionSummary.value);
const missingRequiredSteps = computed(() => onboarding.missingRequiredSteps.value);
const requiredSteps = computed(() => onboarding.requiredSteps.value);
const optionalSteps = computed(() => onboarding.optionalSteps.value);

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
    } else {
      // If API fails, show a helpful message
      toast.error('Error', 'Failed to load onboarding progress. Please refresh the page.');
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

// Helper methods for step URLs and button text
function getStepUrl(stepId) {
  const routeMap = {
    'email_verification': { name: 'username-selling-onboarding-email', params: { username: router.currentRoute.value.params.username } },
    'phone_verification': { name: 'username-selling-onboarding-phone', params: { username: router.currentRoute.value.params.username } },
    'profile_completion': { name: 'username-selling-onboarding-profile', params: { username: router.currentRoute.value.params.username } },
    'agreement_acceptance': { name: 'username-selling-onboarding-agreement', params: { username: router.currentRoute.value.params.username } }
  };

  return routeMap[stepId] || { name: 'username-selling-onboarding', params: { username: router.currentRoute.value.params.username } };
}

function getActionButtonText(stepId) {
  const textMap = {
    'email_verification': 'Verify Email',
    'phone_verification': 'Verify Phone',
    'profile_completion': 'Complete Profile',
    'agreement_acceptance': 'Review Agreement'
  };

  return textMap[stepId] || 'Continue';
}

function getCompletedButtonText(stepId) {
  const textMap = {
    'email_verification': 'Verified',
    'phone_verification': 'Verified',
    'profile_completion': 'Completed',
    'agreement_acceptance': 'Accepted'
  };

  return textMap[stepId] || 'Completed';
}

function getOptionalStepUrl(stepId) {
  const routeMap = {
    'kyc_verification': { name: 'username-selling-onboarding-kyc', params: { username: router.currentRoute.value.params.username } },
    'payment_information': { name: 'username-selling-onboarding-payment', params: { username: router.currentRoute.value.params.username } },
    'social_media': { name: 'username-selling-onboarding-social', params: { username: router.currentRoute.value.params.username } }
  };

  return routeMap[stepId] || { name: 'username-selling-onboarding', params: { username: router.currentRoute.value.params.username } };
}

function getOptionalActionButtonText(stepId) {
  const textMap = {
    'kyc_verification': 'Verify Identity',
    'payment_information': 'Set Up Payment',
    'social_media': 'Add Social Media'
  };

  return textMap[stepId] || 'Complete';
}

function getOptionalCompletedButtonText(stepId) {
  const textMap = {
    'kyc_verification': 'Verified',
    'payment_information': 'Completed',
    'social_media': 'Completed'
  };

  return textMap[stepId] || 'Completed';
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

      // Update auth store with new user data (including seller role)
      if (response.data?.user) {
        auth.setUser(response.data.user);
      }
      if (response.data?.roles) {
        auth.setRoles(response.data.roles);
      } else {
        // If roles not in response, fetch them separately
        try {
          const authApi = useAuthApi();
          await authApi.fetchRoles();
        } catch (error) {
          console.error('Failed to fetch roles after onboarding:', error);
        }
      }

      // Wait a moment for auth store to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to seller dashboard automatically
      await router.push({
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
