<template>
  <LayoutsDashboard mode="seller" pageTitle="Onboarding">
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <main :class="[
        'w-full mx-auto rounded-xl p-8 border border-accent-200 bg-white space-y-6',
        paymentInfoUpdated || isLoading ? 'max-w-md' : 'max-w-2xl'
      ]">
        <!-- Success Icon (when payment info updated) -->
        <div v-if="paymentInfoUpdated" class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Payment Information</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary mt-2">
            <span v-if="isLoading">Loading your payment information...</span>
            <span v-else-if="paymentInfoUpdated">Your payment information has been successfully saved.</span>
            <span v-else>Provide your payment information to receive payments from your sales.</span>
          </UiTypographyP>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <UiLoading />
        </div>

        <!-- Success/Already Updated State -->
        <div v-else-if="paymentInfoUpdated" class="space-y-6 text-center">
          <FormButton @click="continueOnboarding" class="w-full">Continue Onboarding</FormButton>
        </div>

        <!-- Payment Form -->
        <div v-else class="space-y-6">
          <div class="bg-accent-50 p-4 rounded-lg border border-accent-200">
            <UiTypographyP class="text-accent-700">Please provide your payment information to receive payments from your sales.</UiTypographyP>
          </div>

        <form @submit.prevent="submitPaymentInfo" class="mt-6">
          <div class="mb-6 flex justify-center">
            <FormRadio
              label="Payment Method"
              v-model:selectedValue="paymentMethod"
              :options="paymentMethodOptions"
              :error="errors.payment_method"
              layout="horizontal"
              required
            />
          </div>

          <div v-if="paymentMethod === 'bank_transfer'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Bank Name"
              type="text"
              v-model:inputValue="bankTransferInfo.bank_name"
              placeholder="Enter your bank name"
              :error="errors.bank_name"
              required
            />
            <FormInput
              label="Account Holder Name"
              type="text"
              v-model:inputValue="bankTransferInfo.bank_account_name"
              placeholder="Enter account holder name"
              :error="errors.bank_account_name"
              required
            />
            <FormInput
              label="Account Number"
              type="text"
              v-model:inputValue="bankTransferInfo.bank_account_number"
              placeholder="Enter account number"
              :error="errors.bank_account_number"
              required
            />
            <FormInput
              label="Routing Number"
              type="text"
              v-model:inputValue="bankTransferInfo.bank_routing_number"
              placeholder="Enter routing number"
              :error="errors.bank_routing_number"
              required
            />
          </div>

          <div v-else-if="paymentMethod === 'paypal'" class="grid grid-cols-1 gap-6">
            <FormInput
              label="PayPal Email"
              type="email"
              v-model:inputValue="paypalInfo.paypal_email"
              placeholder="Enter your PayPal email address"
              :error="errors.paypal_email"
              required
            />
          </div>

          <div class="mt-8 flex justify-center">
            <FormButton
              type="submit"
              :loading="isSubmitting"
              class="w-full"
            >
              Save Payment Information
            </FormButton>
          </div>
        </form>
        </div>
      </main>
    </div>
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
  title: 'Payment Setup | Kafinta',
  meta: [
    { name: 'description', content: 'Set up your payment information to receive earnings' }
  ]
});

const router = useRouter();
const route = useRoute();
const toast = useAppToast();

// State variables
const isLoading = ref(true);
const isSubmitting = ref(false);
const paymentMethod = ref('bank_transfer');
const paymentInfoUpdated = ref(false);
const errors = ref({});

// Bank transfer information
const bankTransferInfo = ref({
  bank_name: '',
  bank_account_name: '',
  bank_account_number: '',
  bank_routing_number: ''
});

// PayPal information
const paypalInfo = ref({
  paypal_email: ''
});

// Payment method options
const paymentMethodOptions = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' }
];

// Check if payment info is already updated
onMounted(async () => {
  try {
    const response = await useCustomFetch('/api/seller/progress', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data?.completed_steps?.includes('payment_information')) {
      paymentInfoUpdated.value = true;
    }
  } catch (error) {
    console.error('Failed to check payment status:', error);
  } finally {
    isLoading.value = false;
  }
});

// Validate form based on payment method
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (paymentMethod.value === 'bank_transfer') {
    if (!bankTransferInfo.value.bank_name) {
      errors.value.bank_name = 'Bank name is required';
      isValid = false;
    }

    if (!bankTransferInfo.value.bank_account_name) {
      errors.value.bank_account_name = 'Account holder name is required';
      isValid = false;
    }

    if (!bankTransferInfo.value.bank_account_number) {
      errors.value.bank_account_number = 'Account number is required';
      isValid = false;
    }

    if (!bankTransferInfo.value.bank_routing_number) {
      errors.value.bank_routing_number = 'Routing number is required';
      isValid = false;
    }
  } else if (paymentMethod.value === 'paypal') {
    if (!paypalInfo.value.paypal_email) {
      errors.value.paypal_email = 'PayPal email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalInfo.value.paypal_email)) {
      errors.value.paypal_email = 'Please enter a valid email address';
      isValid = false;
    }
  }

  return isValid;
};

// Submit payment information
const submitPaymentInfo = async () => {
  if (!validateForm()) {
    toast.error('Error', 'Please fill in all required fields correctly');
    return;
  }

  isSubmitting.value = true;

  try {
    let paymentData;

    if (paymentMethod.value === 'bank_transfer') {
      paymentData = {
        payment_method: 'bank_transfer',
        ...bankTransferInfo.value
      };
    } else if (paymentMethod.value === 'paypal') {
      paymentData = {
        payment_method: 'paypal',
        ...paypalInfo.value
      };
    }

    const response = await useCustomFetch('/api/seller/update-payment-info', {
      method: 'POST',
      body: paymentData
    });

    if (response.status === 'success') {
      paymentInfoUpdated.value = true;
      toast.success('Success', response.message || 'Payment information updated successfully');

      // Redirect to onboarding page after a brief delay (consistent with other pages)
      setTimeout(() => {
        continueOnboarding();
      }, 1500);
    } else {
      toast.error('Error', response.message || 'Failed to update payment information');
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
