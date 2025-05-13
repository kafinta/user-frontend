import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

export const useOnboarding = () => {
  const auth = useAuthStore();

  // Create a reactive state that persists across component instances
  const isOnboardingActive = ref(true);
  const phoneVerified = ref(false);
  const profileCreated = ref(false);
  const kycVerified = ref(false);
  const isClient = ref(false);

  // Create a computed property for email verification that properly tracks auth state
  const emailVerified = computed(() => {
    if (!isClient.value) return false;
    return auth.isVerified === true;
  });

  // Computed percentage that automatically updates when any verification state changes
  const percentage = computed(() => {
    if (!isClient.value) return 0;

    const steps = [
      emailVerified.value,
      phoneVerified.value,
      profileCreated.value,
      kycVerified.value
    ];
    
    const completedSteps = steps.filter(step => step === true).length;
    return (completedSteps / steps.length) * 100;
  });

  // Set isClient to true on mount
  onMounted(() => {
    isClient.value = true;
    console.log('Onboarding composable mounted, auth state:', {
      isVerified: auth.isVerified,
      isAuthenticated: auth.isAuthenticated,
      user: auth.user
    });
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
};