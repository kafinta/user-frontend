<template>
  <LayoutsDashboard mode="seller" pageTitle="Business Profile">
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <main class="w-full max-w-2xl mx-auto rounded-xl p-8 border border-accent-200 bg-white space-y-6">
        <!-- Success Icon (when profile created) -->
        <div v-if="profileCreated" class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Business Profile</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary mt-2">
            <span v-if="isLoading">Loading your profile information...</span>
            <span v-else-if="profileCreated">Your business profile has been successfully created!</span>
            <span v-else>Provide your business information to help customers learn more about you.</span>
          </UiTypographyP>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <UiLoading />
        </div>

        <!-- Success/Already Created State -->
        <div v-else-if="profileCreated" class="space-y-6 text-center">
          <UiButtonsPrimary
            :url="{ name: 'username-selling-onboarding', params: { username: $route.params.username } }"
            class="w-full"
          >
            Continue Onboarding
          </UiButtonsPrimary>
        </div>

        <!-- Profile Creation Form -->
        <div v-else class="space-y-6">
          <form @submit.prevent="submitProfile" class="flex flex-col lg:grid lg:grid-cols-2 gap-6 w-full">
            <FormInput
              label="Business Name"
              type="text"
              v-model:inputValue="form.business_name"
              :error="errors.business_name"
              required
            />

            <FormSelect
              label="Business Category"
              v-model:selectedOption="form.business_category"
              :options="businessCategories"
              :error="errors.business_category"
              required
            />

            <FormInput
              label="Business Address"
              type="text"
              v-model:inputValue="form.business_address"
              :error="errors.business_address"
              required
            />

            <FormInput
              label="Business Website"
              type="url"
              v-model:inputValue="form.business_website"
              :error="errors.business_website"
            />

            <FormTextarea
              label="Business Description"
              v-model:inputValue="form.business_description"
              placeholder="Write a few words to describe your business or brand."
              class="lg:col-span-2"
              :error="errors.business_description"
              required
              :rows="10"
            />

            <div class="col-span-2">
              <FormButton
                type="submit"
                :loading="isSubmitting"
                class="w-full"
              >
                Create Profile
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

const router = useRouter();
const route = useRoute();
const toast = useAppToast();

// State variables
const isLoading = ref(true);
const isSubmitting = ref(false);
const profileCreated = ref(false);
const errors = ref({});

// Business category options
const businessCategories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Books & Media',
  'Food & Beverages',
  'Health & Wellness',
  'Other'
];

// Form data
const form = ref({
  business_name: '',
  business_description: '',
  business_address: '',
  business_category: '',
  business_website: ''
});

// Check if profile is already created
onMounted(async () => {
  try {
    const response = await useCustomFetch('/api/seller/progress', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data?.completed_steps?.includes('profile_completion')) {
      profileCreated.value = true;
    }
  } catch (error) {
    console.error('Failed to check profile status:', error);
  } finally {
    isLoading.value = false;
  }
});



// Validate form
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.business_name) {
    errors.value.business_name = 'Business name is required';
    isValid = false;
  }

  if (!form.value.business_description) {
    errors.value.business_description = 'Business description is required';
    isValid = false;
  }

  if (!form.value.business_address) {
    errors.value.business_address = 'Business address is required';
    isValid = false;
  }

  if (!form.value.business_category) {
    errors.value.business_category = 'Business category is required';
    isValid = false;
  }

  if (form.value.business_website && !/^https?:\/\/.*/.test(form.value.business_website)) {
    errors.value.business_website = 'Please enter a valid URL starting with http:// or https://';
    isValid = false;
  }

  return isValid;
};

// Submit profile
const submitProfile = async () => {
  if (!validateForm()) {
    toast.error('Error', 'Please fill in all required fields correctly');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await useCustomFetch('/api/seller/update-profile', {
      method: 'POST',
      body: form.value
    });

    if (response.status === 'success') {
      profileCreated.value = true;
      toast.success('Success', response.message || 'Profile created successfully');
      router.push({
        name: 'username-selling-onboarding',
        params: { username: route.params.username }
      });
    } else {
      toast.error('Error', response.message || 'Failed to create profile');
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