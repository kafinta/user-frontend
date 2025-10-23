import { ref, onBeforeUnmount } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAppToast } from '~/utils/toastify';

export function useEmailVerification() {
  const authStore = useAuthStore();
  const toast = useAppToast();

  // State
  const code = ref('');
  const isLoading = ref(false);
  const resendCooldown = ref(0);
  const cooldownInterval = ref<any>(null);
  const codeError = ref('');
  const userEmail = ref('');
  const updateEmailError = ref('');

  // Clean up intervals on unmount
  onBeforeUnmount(() => {
    if (cooldownInterval.value) {
      clearInterval(cooldownInterval.value);
    }
  });

  // Initialize user email
  function initializeEmail(email?: string) {
    userEmail.value = email || authStore.user?.email || 'your email';
  }

  // Verify email with code
  async function verifyWithCode() {
    if (!code.value || code.value.length !== 6) {
      codeError.value = 'Please enter a valid 6-digit verification code';
      return false;
    }

    isLoading.value = true;
    codeError.value = '';

    try {
      const response = await useCustomFetch<any>('/api/verify-email/code', {
        method: 'POST',
        body: { code: code.value }
      });

      if (response?.status === 'success' || response?.data?.email_verified) {
        // Handle auth success
        const authApi = useAuthApi();
        authApi.handleAuthSuccess(response);

        toast.success(response?.message || 'Email verified successfully');
        code.value = '';
        return true;
      } else {
        // Handle specific error cases
        if (response?.errors?.code) {
          const errorMsg = Array.isArray(response.errors.code) ? response.errors.code.join(' ') : response.errors.code;
          codeError.value = errorMsg;
        } else if (response?.message?.includes('expired')) {
          codeError.value = 'This code has expired. Please request a new one.';
        } else if (response?.message?.includes('invalid')) {
          codeError.value = 'Invalid code. Please check and try again.';
        } else {
          codeError.value = response?.message || 'Verification failed. Please try again.';
        }
        toast.error(response?.message || 'Verification failed');
        code.value = '';
        return false;
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      // Extract backend error message
      if (err?.data?.errors?.code) {
        const errorMsg = Array.isArray(err.data.errors.code) ? err.data.errors.code.join(' ') : err.data.errors.code;
        codeError.value = errorMsg;
      } else if (err?.data?.message?.includes('expired')) {
        codeError.value = 'This code has expired. Please request a new one.';
      } else if (err?.data?.message?.includes('invalid')) {
        codeError.value = 'Invalid code. Please check and try again.';
      } else {
        codeError.value = err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.';
      }
      toast.error(err?.data?.message || err?.message || 'An unexpected error occurred. Please try again.');
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Verify email with token
  async function verifyWithToken(token: string): Promise<{ success: boolean; message: string }> {
    isLoading.value = true;

    try {
      const response = await useCustomFetch<any>('/api/verify-email/token', {
        method: 'POST',
        body: { token }
      });

      if (response?.status === 'success' || response?.data?.email_verified) {
        // Handle auth success
        const authApi = useAuthApi();
        authApi.handleAuthSuccess(response);

        // Fetch user profile to ensure we have username for dashboard navigation
        const authStore = useAuthStore();
        if (!authStore.user?.username) {
          try {
            await authStore.validateSession();
          } catch (error) {
            console.error('Failed to fetch user profile after token verification:', error);
          }
        }

        toast.success(response?.message || 'Email verified successfully');
        return { success: true, message: response?.message || 'Email verified successfully' };
      } else {
        return { success: false, message: response?.message || 'Token verification failed' };
      }
    } catch (err: any) {
      console.error('Token verification error:', err);
      const backendErrorMessage = err?.data?.message || err?.message || 'Token verification failed. The link may be expired or invalid.';
      return { success: false, message: backendErrorMessage };
    } finally {
      isLoading.value = false;
    }
  }

  // Resend verification code
  async function resendCode(onSuccess?: () => void): Promise<boolean> {
    if (resendCooldown.value > 0) return false;

    isLoading.value = true;
    codeError.value = '';

    try {
      const response = await useCustomFetch<any>('/api/user/resend-verification-email', {
        method: 'POST'
      });

      if (response?.status === 'success') {
        toast.success('New verification code sent! Check your email.');
        startCooldown();
        // Clear the current code
        code.value = '';
        if (onSuccess) onSuccess();
        return true;
      } else {
        toast.error(response?.message || 'Failed to send verification email');
        return false;
      }
    } catch (err: any) {
      console.error('Request code error:', err);
      const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  // Start cooldown timer for resend button
  function startCooldown() {
    resendCooldown.value = 60; // Start with 60 seconds

    if (cooldownInterval.value) {
      clearInterval(cooldownInterval.value);
    }

    cooldownInterval.value = setInterval(() => {
      if (resendCooldown.value > 0) {
        resendCooldown.value--;
        // Progressive cooldown: reduce to 30s after first minute
        if (resendCooldown.value === 30) {
          resendCooldown.value = 30;
        }
      } else {
        if (cooldownInterval.value) {
          clearInterval(cooldownInterval.value);
          cooldownInterval.value = null;
        }
      }
    }, 1000);
  }

  // Auto-submit when OTP is complete
  function autoSubmit() {
    if (code.value.length === 6) {
      verifyWithCode();
    }
  }

  // Clear error
  function clearError() {
    codeError.value = '';
  }

  // Reset state
  function reset() {
    code.value = '';
    codeError.value = '';
    isLoading.value = false;
    if (cooldownInterval.value) {
      clearInterval(cooldownInterval.value);
      cooldownInterval.value = null;
    }
    resendCooldown.value = 0;
  }

  // Update email for verification
  async function updateEmail(newEmail: string, password: string) {
    isLoading.value = true;
    updateEmailError.value = '';
    try {
      const response = await useCustomFetch<any>('/api/user/update-email', {
        method: 'PATCH',
        body: { email: newEmail, password }
      });
      if (response?.success === true && response?.status === 'success' && response?.status_code === 200 && response?.data?.email) {
        userEmail.value = response.data.email;
        toast.success(response?.message || 'Email updated successfully. Please check your new email for a verification link.');
        return { success: true, message: response?.message };
      } else if (response?.status_code === 422 && response?.errors) {
        // Validation errors
        updateEmailError.value = Object.values(response.errors).flat().join(' ');
        toast.error(updateEmailError.value);
        return { success: false, message: updateEmailError.value };
      } else {
        updateEmailError.value = response?.message || 'Unable to update email.';
        toast.error(updateEmailError.value);
        return { success: false, message: updateEmailError.value };
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'An unexpected error occurred';
      updateEmailError.value = errorMessage;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    code,
    isLoading,
    resendCooldown,
    codeError,
    userEmail,
    updateEmailError,
    
    // Methods
    initializeEmail,
    verifyWithCode,
    verifyWithToken,
    resendCode,
    autoSubmit,
    clearError,
    reset,
    updateEmail
  };
} 