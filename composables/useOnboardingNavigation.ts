import { useRouter, useRoute } from 'vue-router';
import { useOnboarding } from '~/composables/useOnboarding';

/**
 * Composable for handling onboarding navigation
 * Provides consistent redirect behavior across all onboarding pages
 */
export const useOnboardingNavigation = () => {
  const router = useRouter();
  const route = useRoute();
  const onboarding = useOnboarding();

  /**
   * Navigate back to the main onboarding page
   * Automatically refetches progress to show updated completion status
   */
  const continueOnboarding = async () => {
    // Refetch progress to show updated completion status
    await onboarding.fetchProgress();

    // Navigate back to onboarding index
    await router.push({
      name: 'username-selling-onboarding',
      params: { username: route.params.username }
    });
  };

  /**
   * Navigate to a specific onboarding step
   */
  const goToStep = async (stepId: string) => {
    const stepRoutes: Record<string, string> = {
      'email_verification': 'username-selling-onboarding-email',
      'phone_verification': 'username-selling-onboarding-phone',
      'profile_completion': 'username-selling-onboarding-profile',
      'agreement_acceptance': 'username-selling-onboarding-agreement',
      'kyc_verification': 'username-selling-onboarding-kyc',
      'payment_information': 'username-selling-onboarding-payment',
      'social_media': 'username-selling-onboarding-social'
    };

    const routeName = stepRoutes[stepId];
    if (routeName) {
      await router.push({
        name: routeName,
        params: { username: route.params.username }
      });
    }
  };

  /**
   * Navigate to seller dashboard after onboarding completion
   */
  const goToDashboard = async () => {
    await router.push({
      name: 'username-selling-dashboard',
      params: { username: route.params.username }
    });
  };

  return {
    continueOnboarding,
    goToStep,
    goToDashboard
  };
};

