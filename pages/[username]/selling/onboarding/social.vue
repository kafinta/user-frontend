<template>
  <LayoutsDashboard mode="seller" pageTitle="Onboarding">
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <main :class="[
        'w-full mx-auto rounded-xl p-8 border border-accent-200 bg-white space-y-6',
        socialMediaCompleted || isLoading ? 'max-w-md' : 'max-w-2xl'
      ]">
        <!-- Success Icon (when social media completed) -->
        <div v-if="socialMediaCompleted" class="text-center">
          <div class="w-20 h-20 mx-auto bg-green-200 rounded-full flex items-center justify-center mb-6">
            <UiIconsSuccess class="w-16 h-16 text-green-600" />
          </div>
        </div>

        <!-- Header -->
        <div class="text-center">
          <UiTypographyH2 class="font-medium text-3xl text-secondary">Business Social Media</UiTypographyH2>
          <UiTypographyP class="text-sm text-secondary mt-2">
            <span v-if="isLoading">Loading your social media information...</span>
            <span v-else-if="socialMediaCompleted">Your social media information has been successfully saved.</span>
            <span v-else>Add your social media accounts to help customers connect with your brand.</span>
          </UiTypographyP>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-10">
          <UiLoading />
        </div>

        <!-- Success/Already Completed State -->
        <div v-else-if="socialMediaCompleted" class="space-y-6 text-center">
          <FormButton @click="continueOnboarding" class="w-full">Continue Onboarding</FormButton>
        </div>

        <!-- Social Media Form -->
        <div v-else class="space-y-6">
          <div class="bg-accent-50 p-4 rounded-lg border border-accent-200">
            <UiTypographyP class="text-accent-700">Add your social media accounts to showcase your business and build customer trust. All fields are optional.</UiTypographyP>
          </div>

        <form @submit.prevent="submitSocialMedia" class="mt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Instagram -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-secondary mb-2">Instagram Handle</label>
              <FormInputGroup :error="!!errors.instagram_handle">
                <FormInputGroupAddon>
                  <img src="/images/logos/instagram-color.svg" class="w-5 h-5" alt="Instagram" />
                </FormInputGroupAddon>
                <FormInputText
                  v-model="form.instagram_handle"
                  placeholder="@nike"
                  type="text"
                  aria-describedby="instagram-help"
                />
              </FormInputGroup>
              <div v-if="errors.instagram_handle" class="text-red-500 text-sm">{{ errors.instagram_handle }}</div>
            </div>

            <!-- Facebook -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-secondary mb-2">Facebook Page</label>
              <FormInputGroup :error="!!errors.facebook_page">
                <FormInputGroupAddon>
                  <img src="/images/logos/facebook-color.svg" class="w-5 h-5" alt="Facebook" />
                </FormInputGroupAddon>
                <FormInputText
                  v-model="form.facebook_page"
                  placeholder="https://facebook.com/nike"
                  type="url"
                  aria-describedby="facebook-help"
                />
              </FormInputGroup>
              <div v-if="errors.facebook_page" class="text-red-500 text-sm">{{ errors.facebook_page }}</div>
            </div>

            <!-- X -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-secondary mb-2">X Handle</label>
              <FormInputGroup :error="!!errors.twitter_handle">
                <FormInputGroupAddon>
                  <img src="/images/logos/x.svg" class="w-5 h-5" alt="X (Twitter)" />
                </FormInputGroupAddon>
                <FormInputText
                  v-model="form.twitter_handle"
                  placeholder="@nike"
                  type="text"
                  aria-describedby="twitter-help"
                />
              </FormInputGroup>
              <div v-if="errors.twitter_handle" class="text-red-500 text-sm">{{ errors.twitter_handle }}</div>
            </div>

            <!-- LinkedIn -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-secondary mb-2">LinkedIn Page</label>
              <FormInputGroup :error="!!errors.linkedin_page">
                <FormInputGroupAddon>
                  <img src="/images/logos/linkedin.svg" class="w-5 h-5" alt="LinkedIn" />
                </FormInputGroupAddon>
                <FormInputText
                  v-model="form.linkedin_page"
                  placeholder="https://linkedin.com/company/nike"
                  type="url"
                  aria-describedby="linkedin-help"
                />
              </FormInputGroup>
              <div v-if="errors.linkedin_page" class="text-red-500 text-sm">{{ errors.linkedin_page }}</div>
            </div>

            <!-- TikTok -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-secondary mb-2">TikTok Handle</label>
              <FormInputGroup :error="!!errors.tiktok_handle">
                <FormInputGroupAddon>
                  <img src="/images/logos/tiktok.svg" class="w-5 h-5" alt="TikTok" />
                </FormInputGroupAddon>
                <FormInputText
                  v-model="form.tiktok_handle"
                  placeholder="@nike"
                  type="text"
                  aria-describedby="tiktok-help"
                />
              </FormInputGroup>
              <div v-if="errors.tiktok_handle" class="text-red-500 text-sm">{{ errors.tiktok_handle }}</div>
            </div>

            <!-- YouTube -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-secondary mb-2">YouTube Channel</label>
              <FormInputGroup :error="!!errors.youtube_channel">
                <FormInputGroupAddon>
                  <img src="/images/logos/youtube.svg" class="w-5 h-5" alt="YouTube" />
                </FormInputGroupAddon>
                <FormInputText
                  v-model="form.youtube_channel"
                  placeholder="https://youtube.com/@nike"
                  type="url"
                  aria-describedby="youtube-help"
                />
              </FormInputGroup>
              <div v-if="errors.youtube_channel" class="text-red-500 text-sm">{{ errors.youtube_channel }}</div>
            </div>
          </div>

          <div class="mt-8">
            <FormButton
              type="submit"
              :loading="isSubmitting"
              class="w-full"
            >
              Save Social Media
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
  title: 'Social Media Setup | Kafinta',
  meta: [
    { name: 'description', content: 'Add your social media accounts to showcase your business' }
  ]
});

const router = useRouter();
const route = useRoute();
const toast = useAppToast();

// State variables
const isLoading = ref(true);
const isSubmitting = ref(false);
const socialMediaCompleted = ref(false);
const errors = ref({});

// Form data
const form = ref({
  instagram_handle: '',
  facebook_page: '',
  twitter_handle: '',
  linkedin_page: '',
  tiktok_handle: '',
  youtube_channel: ''
});

// Check if social media is already completed
onMounted(async () => {
  try {
    const response = await useCustomFetch('/api/seller/progress', {
      method: 'GET'
    });

    if (response.status === 'success' && response.data?.completed_steps?.includes('social_media')) {
      socialMediaCompleted.value = true;
    }
  } catch (error) {
    console.error('Failed to check social media status:', error);
  } finally {
    isLoading.value = false;
  }
});

// Validate form
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // Validate URLs if provided
  const urlFields = ['facebook_page', 'linkedin_page', 'youtube_channel'];
  urlFields.forEach(field => {
    if (form.value[field]) {
      // Check if URL starts with http/https
      if (!/^https?:\/\/.*/.test(form.value[field])) {
        errors.value[field] = 'Please enter a valid URL starting with http:// or https://';
        isValid = false;
      }
      // Check for platform-specific domains
      else if (field === 'facebook_page' && !form.value[field].includes('facebook.com')) {
        errors.value[field] = 'Please enter a valid Facebook URL';
        isValid = false;
      }
      else if (field === 'linkedin_page' && !form.value[field].includes('linkedin.com')) {
        errors.value[field] = 'Please enter a valid LinkedIn URL';
        isValid = false;
      }
      else if (field === 'youtube_channel' && !form.value[field].includes('youtube.com')) {
        errors.value[field] = 'Please enter a valid YouTube URL';
        isValid = false;
      }
    }
  });

  // Validate handles if provided (should start with @)
  const handleFields = ['instagram_handle', 'twitter_handle', 'tiktok_handle'];
  handleFields.forEach(field => {
    if (form.value[field] && !form.value[field].startsWith('@')) {
      form.value[field] = '@' + form.value[field];
    }
  });

  return isValid;
};

// Submit social media
const submitSocialMedia = async () => {
  if (!validateForm()) {
    toast.error('Error', 'Please check your social media links');
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await useCustomFetch('/api/seller/update-social-media', {
      method: 'POST',
      body: form.value
    });

    if (response.status === 'success') {
      socialMediaCompleted.value = true;
      toast.success('Success', response.message || 'Social media information saved successfully');

      // Redirect to onboarding page after a brief delay
      setTimeout(() => {
        continueOnboarding();
      }, 1500);
    } else {
      toast.error('Error', response.message || 'Failed to save social media information');
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
