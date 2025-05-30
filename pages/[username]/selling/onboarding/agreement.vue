<template>
  <LayoutsDashboard mode="seller" pageTitle="Onboarding">
    <main class="w-full lg:w-3/4 2xl:w-2/3 mx-auto">
      <!-- Success Icon (when agreement accepted) -->
      <div v-if="agreementAccepted" class="text-center mb-6">
        <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
          <UiIconsSuccess class="w-16 h-16 text-green-600" />
        </div>
      </div>

      <!-- Header -->
      <UiTypographyH3 class="text-center">Seller Agreement</UiTypographyH3>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <UiLoading />
      </div>

      <!-- Success/Already Accepted State -->
      <div v-else-if="agreementAccepted" class="mt-8 text-center">
        <div class="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <UiTypographyH4 class="text-green-700">Agreement Accepted</UiTypographyH4>
          <UiTypographyP class="text-green-600 mt-2">You have already accepted the seller agreement.</UiTypographyP>
        </div>

        <UiButtonsPrimary
          :url="{ name: 'username-selling-onboarding', params: { username: $route.params.username } }"
          class="max-w-64 mx-auto"
        >
          Continue Onboarding
        </UiButtonsPrimary>
      </div>

      <!-- Agreement Form -->
      <div v-else>
        <div class="bg-accent-50 p-4 rounded-lg border border-accent-200 mb-6">
          <UiTypographyP class="text-accent-700">Please read the following agreement carefully. You must accept these terms to become a seller on our platform.</UiTypographyP>
        </div>

        <div class="border border-accent-200 rounded-lg p-6 max-h-96 overflow-y-auto mb-6">
          <UiTypographyH4>Seller Terms and Conditions</UiTypographyH4>

          <UiTypographyP class="mt-4">
            <strong>1. Introduction</strong><br>
            Welcome to our marketplace. These Seller Terms and Conditions govern your access to and use of our services as a seller.
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>2. Seller Eligibility</strong><br>
            To become a seller, you must:
            <ul class="list-disc pl-5 mt-2">
              <li>Be at least 18 years old</li>
              <li>Have a valid email address and phone number</li>
              <li>Provide accurate personal and business information</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>3. Seller Obligations</strong><br>
            As a seller, you agree to:
            <ul class="list-disc pl-5 mt-2">
              <li>Provide accurate and complete information about your products</li>
              <li>Maintain inventory accuracy and fulfill orders promptly</li>
              <li>Respond to customer inquiries within 24 hours</li>
              <li>Comply with our marketplace policies and guidelines</li>
              <li>Not engage in any fraudulent or deceptive practices</li>
            </ul>
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>4. Fees and Payments</strong><br>
            <ul class="list-disc pl-5 mt-2">
              <li>We charge a commission of 10% on each sale</li>
              <li>Payments are processed within 7 business days after order completion</li>
              <li>You are responsible for all taxes related to your sales</li>
            </ul>
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>5. Product Guidelines</strong><br>
            You may not sell:
            <ul class="list-disc pl-5 mt-2">
              <li>Illegal or prohibited items</li>
              <li>Counterfeit or unauthorized products</li>
              <li>Hazardous materials</li>
              <li>Items that infringe on intellectual property rights</li>
            </ul>
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>6. Account Suspension and Termination</strong><br>
            We reserve the right to suspend or terminate your seller account if:
            <ul class="list-disc pl-5 mt-2">
              <li>You violate these terms or our marketplace policies</li>
              <li>You engage in fraudulent activity</li>
              <li>You receive excessive negative feedback from customers</li>
              <li>You fail to maintain the required seller performance metrics</li>
            </ul>
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>7. Changes to Terms</strong><br>
            We may update these terms from time to time. We will notify you of any significant changes.
          </UiTypographyP>

          <UiTypographyP class="mt-4">
            <strong>8. Governing Law</strong><br>
            These terms are governed by the laws of [Jurisdiction], without regard to its conflict of law principles.
          </UiTypographyP>
        </div>

        <div class="flex items-center mb-6">
          <FormCheckbox
            id="agreement"
            v-model="agreementChecked"
          />
          <label for="agreement" class="ml-2 text-sm">
            I have read and agree to the Seller Terms and Conditions
          </label>
        </div>

        <FormButton
          @click="acceptAgreement"
          :disabled="!agreementChecked || isSubmitting"
          :loading="isSubmitting"
          class="max-w-64 mx-auto"
        >
          Accept Agreement
        </FormButton>
      </div>
    </main>
  </LayoutsDashboard>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCustomFetch } from '~/composables/useCustomFetch';
import { useAppToast } from '~/utils/toastify';

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  requiresVerification: true
});

useHead({
  title: 'Seller Agreement | Kafinta',
  meta: [
    { name: 'description', content: 'Accept the seller agreement to continue with onboarding' }
  ]
});

const router = useRouter();
const route = useRoute();
const toast = useAppToast();

// State variables
const isLoading = ref(true);
const isSubmitting = ref(false);
const agreementChecked = ref(false);
const agreementAccepted = ref(false);

// Check if agreement is already accepted
onMounted(async () => {
  try {
    const response = await useCustomFetch('/api/seller/progress', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data?.completed_steps?.includes('agreement_acceptance')) {
      agreementAccepted.value = true;
    }
  } catch (error) {
    console.error('Failed to check agreement status:', error);
  } finally {
    isLoading.value = false;
  }
});

// Accept the agreement
const acceptAgreement = async () => {
  if (!agreementChecked.value) {
    toast.error('Error', 'You must accept the agreement to continue');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await useCustomFetch('/api/seller/accept-agreement', {
      method: 'POST',
      body: {
        agreement_accepted: true,
        agreement_version: '1.0'
      }
    });

    if (response.status === 'success') {
      agreementAccepted.value = true;
      toast.success('Success', response.message || 'Agreement accepted successfully');

      // Redirect to onboarding page after a brief delay
      setTimeout(() => {
        continueOnboarding();
      }, 1500);
    } else {
      toast.error('Error', response.message || 'Failed to accept agreement');
    }
  } catch (error) {
    toast.error('Error', 'An unexpected error occurred');
  } finally {
    isSubmitting.value = false;
  }
};

// Continue to next onboarding step
const continueOnboarding = () => {
  router.push({
    name: 'username-selling-onboarding',
    params: { username: route.params.username }
  });
};
</script>
