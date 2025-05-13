import { ref, computed, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

export function useOnboarding() {
  const auth = useAuthStore();

  // Create a reactive state that persists across component instances
  const isOnboardingActive = ref(true);
  const phoneVerified = ref(false);
  const profileCreated = ref(false);
  const kycVerified = ref(false);

  // Create a computed property for email verification that properly tracks auth state
  const emailVerified = computed(() => {
    console.log('Computing emailVerified, auth.isVerified:', auth.isVerified);
    return auth.isVerified === true;
  });

  // Debug auth state
  console.log('Auth store state:', {
    isVerified: auth.isVerified,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user
  });

  // Computed percentage that automatically updates when any verification state changes
  const percentage = computed(() => {
    let total = 0;

    console.log('Calculating percentage with states:', {
      emailVerified: emailVerified.value,
      phoneVerified: phoneVerified.value,
      profileCreated: profileCreated.value,
      kycVerified: kycVerified.value
    });

    if (emailVerified.value) {
      total += 15; // Email verification is 15%
    }

    if (phoneVerified.value) {
      total += 15; // Phone verification is 15%
    }

    if (profileCreated.value) {
      total += 35; // Basic info is 35%
    }

    if (kycVerified.value) {
      total += 35; // Identity verification is 35%
    }

    console.log('Final calculated percentage:', total);
    return total;
  });

  // Watch for changes in auth verification state
  watch(() => auth.isVerified, (newValue) => {
    console.log('Auth verification state changed:', newValue);
  }, { immediate: true });

  // Computed property to check if onboarding is complete
  const isOnboardingComplete = computed(() => percentage.value >= 100);

  // Function to update a specific step
  const updateStep = (step: 'email' | 'phone' | 'profile' | 'kyc', value: boolean) => {
    switch (step) {
      case 'email':
        // Email verification is now handled by auth store
        break;
      case 'phone':
        phoneVerified.value = value;
        break;
      case 'profile':
        profileCreated.value = value;
        break;
      case 'kyc':
        kycVerified.value = value;
        break;
    }
  };

  // Function to reset onboarding state
  const resetOnboarding = () => {
    phoneVerified.value = false;
    profileCreated.value = false;
    kycVerified.value = false;
    isOnboardingActive.value = true;
  };

  // Function to complete onboarding
  const completeOnboarding = () => {
    isOnboardingActive.value = false;
  };

  return {
    // State
    percentage,
    isOnboardingActive,
    emailVerified,
    phoneVerified,
    profileCreated,
    kycVerified,

    // Computed
    isOnboardingComplete,

    // Methods
    updateStep,
    resetOnboarding,
    completeOnboarding
  };
}