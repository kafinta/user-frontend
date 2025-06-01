<template>
  <LayoutsDashboard mode="seller" pageTitle="KYC Verification">
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <main :class="[
        'w-full mx-auto rounded-xl p-8 border border-accent-200 bg-white space-y-6',
        kycVerified || isLoading ? 'max-w-md' : 'max-w-2xl'
      ]">
        <!-- Success Icon (when KYC verified) -->
        <div v-if="kycVerified" class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <UiTypographyH2 class="font-medium text-3xl text-secondary">KYC Verification</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary mt-2">
            <span v-if="isLoading">Loading your verification status...</span>
            <span v-else-if="kycVerified">Your identity verification has been successfully submitted!</span>
            <span v-else>Upload your identification documents to increase customer trust and unlock higher selling limits.</span>
          </UiTypographyP>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <UiIconsLoading class="w-12 h-12 text-primary" />
        </div>

        <!-- Success/Already Verified State -->
        <div v-else-if="kycVerified" class="space-y-6 text-center">
          <FormButton @click="continueOnboarding" class="w-full">Continue Onboarding</FormButton>
        </div>

        <!-- KYC Form -->
        <div v-else class="space-y-6">
          <!-- Information Notice -->
          <div class="bg-accent-50 p-4 rounded-lg border border-accent-200">
            <UiTypographyP class="text-accent-700 text-sm">
              Please provide your identification documents for verification. This helps us maintain a safe and secure marketplace.
            </UiTypographyP>
          </div>

          <form @submit.prevent="submitKyc" class="space-y-6">
            <FormSelect
              label="ID Type"
              v-model:selectedOption="form.id_type"
              :options="idTypeOptions"
              placeholder="Select the type of ID you're uploading"
              :error="errors.id_type"
              required
            />

            <FormInput
              label="ID Number (Optional)"
              type="text"
              v-model:inputValue="form.id_number"
              placeholder="Enter your ID number"
              :error="errors.id_number"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <UiTypographyP class="text-sm font-medium text-secondary mb-2">Front of ID</UiTypographyP>
                <div class="w-full relative h-52">
                  <input @change="handleFrontImage" type="file" id="frontPictureInput" class="hidden" accept="image/*">

                  <!-- Upload area (always present to maintain layout) -->
                  <label for="frontPictureInput" class="absolute inset-0 w-full h-full rounded-md bg-accent-100 hover:bg-accent-200 duration-300 ease-in-out grid place-items-center cursor-pointer">
                    <img :src="cameraIconPath" class="w-20 block" alt="Camera Icon"/>
                  </label>

                  <!-- Preview image (shows on top when available) -->
                  <img v-if="frontPreviewSrc" :src="frontPreviewSrc" class="absolute inset-0 w-full h-full rounded-md object-cover" alt="Front Image Preview">
                </div>
                <div v-if="errors.id_document_front" class="text-red-500 text-sm mt-1">{{ errors.id_document_front }}</div>
              </div>

              <div>
                <UiTypographyP class="text-sm font-medium text-secondary mb-2">Back of ID</UiTypographyP>
                <div class="w-full relative h-52">
                  <input @change="handleBackImage" type="file" id="backPictureInput" class="hidden" accept="image/*">

                  <!-- Upload area (always present to maintain layout) -->
                  <label for="backPictureInput" class="absolute inset-0 w-full h-full rounded-md bg-accent-100 hover:bg-accent-200 duration-300 ease-in-out grid place-items-center cursor-pointer">
                    <img :src="cameraIconPath" class="w-20 block" alt="Camera Icon"/>
                  </label>

                  <!-- Preview image (shows on top when available) -->
                  <img v-if="backPreviewSrc" :src="backPreviewSrc" class="absolute inset-0 w-full h-full rounded-md object-cover" alt="Back Image Preview">
                </div>
                <div v-if="errors.id_document_back" class="text-red-500 text-sm mt-1">{{ errors.id_document_back }}</div>
              </div>
            </div>

            <FormButton
              type="submit"
              :loading="isSubmitting"
              class="w-full"
            >
              Submit Verification
            </FormButton>
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
  title: 'Identity Verification | Kafinta',
  meta: [
    { name: 'description', content: 'Complete KYC verification to continue with seller onboarding' }
  ]
});

const router = useRouter();
const route = useRoute();
const toast = useAppToast();

// State variables
const isLoading = ref(true);
const isSubmitting = ref(false);
const kycVerified = ref(false);
const frontPreviewSrc = ref('');
const backPreviewSrc = ref('');
const frontImageFile = ref(null);
const backImageFile = ref(null);
const errors = ref({});

// Form data
const form = ref({
  id_type: '',
  id_number: ''
});

// ID Type options
const idTypeOptions = [
  { label: 'National I.D Card', value: 'National I.D Card' },
  { label: 'National Identity Number (N.I.N)', value: 'National Identity Number (N.I.N)' },
  { label: 'International Passport', value: 'International Passport' },
  { label: "Driver's License", value: "Driver's License" }
];



// Camera icon path
const cameraIconPath = '/images/icons/camera.svg';



// Check if KYC is already verified
onMounted(async () => {
  try {
    const response = await useCustomFetch('/api/seller/progress', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data?.completed_steps?.includes('kyc_verification')) {
      kycVerified.value = true;
    }
  } catch (error) {
    console.error('Failed to check KYC status:', error);
  } finally {
    isLoading.value = false;
  }
});

// Handle front image upload
const handleFrontImage = (event) => {
  const file = event.target.files[0];
  frontImageFile.value = file;

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      frontPreviewSrc.value = e.target.result;
    };

    reader.readAsDataURL(file);
  }
};

// Handle back image upload
const handleBackImage = (event) => {
  const file = event.target.files[0];
  backImageFile.value = file;

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      backPreviewSrc.value = e.target.result;
    };

    reader.readAsDataURL(file);
  }
};

// Validate form
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!form.value.id_type) {
    errors.value.id_type = 'Please select an ID type';
    isValid = false;
  }

  if (!frontImageFile.value) {
    errors.value.id_document_front = 'Front image is required';
    isValid = false;
  }

  if (!backImageFile.value) {
    errors.value.id_document_back = 'Back image is required';
    isValid = false;
  }

  return isValid;
};

// Submit KYC verification
const submitKyc = async () => {
  if (!validateForm()) {
    toast.error('Error', 'Please fill in all required fields');
    return;
  }

  isSubmitting.value = true;

  try {
    // Create form data for file upload
    const formData = new FormData();

    // Debug: Log what we're sending
    console.log('Form data being sent:');
    console.log('id_type:', form.value.id_type);
    console.log('id_number:', form.value.id_number);
    console.log('frontImageFile:', frontImageFile.value);
    console.log('backImageFile:', backImageFile.value);

    formData.append('id_type', form.value.id_type);

    if (form.value.id_number) {
      formData.append('id_number', form.value.id_number);
    }

    // Send images as array under id_document field
    formData.append('id_document[]', frontImageFile.value);
    formData.append('id_document[]', backImageFile.value);

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await useCustomFetch('/api/seller/verify-kyc', {
      method: 'POST',
      body: formData
    });

    if (response.status === 'success') {
      kycVerified.value = true;
      toast.success('Success', response.message || 'KYC verification submitted successfully');

      // Redirect to onboarding page after a brief delay
      setTimeout(() => {
        continueOnboarding();
      }, 1500);
    } else {
      toast.error('Error', response.message || 'Failed to submit KYC verification');
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