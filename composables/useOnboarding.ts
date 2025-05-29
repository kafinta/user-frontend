import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Updated types for new onboarding system
export interface OnboardingStep {
  id: string
  name: string
  completed: boolean
  required: boolean
  completion_date?: string | null
}

export interface OnboardingProgress {
  can_complete: boolean
  required_steps: OnboardingStep[]
  optional_steps: OnboardingStep[]
  missing_required_steps: string[]
  completed_steps: string[]
  next_recommended_step?: string
  completion_summary: {
    required_completed: number
    required_total: number
    optional_completed: number
    optional_total: number
  }
}

export const useOnboarding = () => {
  const auth = useAuthStore();

  // Simplified reactive state
  const isLoading = ref(false);
  const progress = ref<OnboardingProgress | null>(null);

  // Computed properties for step completion status
  const emailVerified = computed(() => {
    // Use API response as the source of truth for email verification
    return progress.value?.completed_steps.includes('email_verification') || false;
  });

  const phoneVerified = computed(() => {
    return progress.value?.completed_steps.includes('phone_verification') || false;
  });

  const profileCreated = computed(() => {
    return progress.value?.completed_steps.includes('profile_completion') || false;
  });

  const kycVerified = computed(() => {
    return progress.value?.completed_steps.includes('kyc_verification') || false;
  });

  const agreementAccepted = computed(() => {
    return progress.value?.completed_steps.includes('agreement_acceptance') || false;
  });

  const paymentInfoUpdated = computed(() => {
    return progress.value?.completed_steps.includes('payment_information') || false;
  });

  // New system computed properties
  const canComplete = computed(() => {
    return progress.value?.can_complete || false;
  });

  const requiredSteps = computed(() => {
    return progress.value?.required_steps || [];
  });

  const optionalSteps = computed(() => {
    return progress.value?.optional_steps || [];
  });

  const missingRequiredSteps = computed(() => {
    return progress.value?.missing_required_steps || [];
  });

  const completionSummary = computed(() => {
    // Handle both completion_summary and progress_summary from API
    const summary = progress.value?.completion_summary || progress.value?.progress_summary;

    if (summary) {
      return {
        required_completed: summary.required_completed || 0,
        required_total: summary.required_total || 0,
        optional_completed: summary.optional_completed || 0,
        optional_total: summary.optional_total || 0
      };
    }

    // Fallback: calculate from steps if summary not available
    if (progress.value) {
      const requiredCompleted = progress.value.required_steps?.filter(step => step.completed).length || 0;
      const requiredTotal = progress.value.required_steps?.length || 0;
      const optionalCompleted = progress.value.optional_steps?.filter(step => step.completed).length || 0;
      const optionalTotal = progress.value.optional_steps?.length || 0;

      return {
        required_completed: requiredCompleted,
        required_total: requiredTotal,
        optional_completed: optionalCompleted,
        optional_total: optionalTotal
      };
    }

    return {
      required_completed: 0,
      required_total: 0,
      optional_completed: 0,
      optional_total: 0
    };
  });

  const nextRecommendedStep = computed(() => {
    return progress.value?.next_recommended_step;
  });

  // Check if onboarding is active (user is not a seller and has incomplete required steps)
  const isOnboardingActive = computed(() => {
    // If user is already a seller, onboarding is not active
    if (auth.isSeller) {
      return false;
    }

    // If we have progress data, check if there are missing required steps
    if (progress.value) {
      return progress.value.missing_required_steps.length > 0;
    }

    // If no progress data and user is not a seller, assume onboarding is active
    return !auth.isSeller;
  });

  // Fetch seller progress (simplified - mainly for shared state)
  const fetchProgress = async () => {
    isLoading.value = true;

    try {
      const response = await useCustomFetch('/api/seller/progress', {
        method: 'GET'
      });

      if (response.status === 'success' && response.data) {
        progress.value = response.data;
      } else {
        // If API fails, create a minimal progress structure for testing
        console.warn('API failed, using fallback progress data');
        progress.value = {
          can_complete: false,
          required_steps: [
            { id: 'email_verification', name: 'Email Verification', completed: false, required: true },
            { id: 'phone_verification', name: 'Phone Verification', completed: false, required: true },
            { id: 'profile_completion', name: 'Business Profile', completed: false, required: true },
            { id: 'agreement_acceptance', name: 'Seller Agreement', completed: false, required: true }
          ],
          optional_steps: [
            { id: 'kyc_verification', name: 'KYC Verification', completed: false, required: false },
            { id: 'payment_information', name: 'Payment Information', completed: false, required: false }
          ],
          missing_required_steps: ['email_verification', 'phone_verification', 'profile_completion', 'agreement_acceptance'],
          completed_steps: [],
          completion_summary: {
            required_completed: 0,
            required_total: 4,
            optional_completed: 0,
            optional_total: 2
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Failed to fetch seller progress:', error);

      // Create fallback data on error
      progress.value = {
        can_complete: false,
        required_steps: [
          { id: 'email_verification', name: 'Email Verification', completed: false, required: true },
          { id: 'phone_verification', name: 'Phone Verification', completed: false, required: true },
          { id: 'profile_completion', name: 'Business Profile', completed: false, required: true },
          { id: 'agreement_acceptance', name: 'Seller Agreement', completed: false, required: true }
        ],
        optional_steps: [
          { id: 'kyc_verification', name: 'KYC Verification', completed: false, required: false },
          { id: 'payment_information', name: 'Payment Information', completed: false, required: false }
        ],
        missing_required_steps: ['email_verification', 'phone_verification', 'profile_completion', 'agreement_acceptance'],
        completed_steps: [],
        completion_summary: {
          required_completed: 0,
          required_total: 4,
          optional_completed: 0,
          optional_total: 2
        }
      };

      return {
        status: 'error',
        message: 'Failed to fetch progress'
      };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    isLoading,
    progress,

    // Step completion status
    emailVerified,
    phoneVerified,
    profileCreated,
    kycVerified,
    agreementAccepted,
    paymentInfoUpdated,

    // New system properties
    canComplete,
    requiredSteps,
    optionalSteps,
    missingRequiredSteps,
    completionSummary,
    nextRecommendedStep,
    isOnboardingActive,

    // Methods (minimal - pages should handle their own API calls)
    fetchProgress
  };
};