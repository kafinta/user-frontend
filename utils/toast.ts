import { useToast } from 'primevue/usetoast';

// Standard toast durations
const TOAST_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000
};

// Toast group used throughout the application
const TOAST_GROUP = 'br';

/**
 * Utility for displaying toast notifications consistently across the application
 */
export const useAppToast = () => {
  // Only run on client side
  if (import.meta.server) {
    // Return dummy functions for SSR
    return {
      success: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      accessDenied: () => {},
      authError: () => {},
      sessionExpired: () => {}
    };
  }

  // Get the toast service
  let toast;
  try {
    toast = useToast();
    if (!toast) {
      console.error('Toast service not available from useToast()');
      // Return dummy functions if toast service is not available
      return {
        success: () => { console.error('Toast service not available'); },
        info: () => { console.error('Toast service not available'); },
        warn: () => { console.error('Toast service not available'); },
        error: () => { console.error('Toast service not available'); },
        accessDenied: () => { console.error('Toast service not available'); },
        authError: () => { console.error('Toast service not available'); },
        sessionExpired: () => { console.error('Toast service not available'); }
      };
    }
  } catch (error) {
    console.error('Error initializing toast service:', error);
    // Return dummy functions if toast service is not available
    return {
      success: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      accessDenied: () => {},
      authError: () => {},
      sessionExpired: () => {}
    };
  }

  /**
   * Show a success toast notification
   */
  const success = (summary: string, detail: string, duration = TOAST_DURATIONS.SHORT) => {
    if (!toast) {
      console.error('Toast service not available in success method');
      return;
    }

    console.log('Showing success toast:', summary, detail);

    try {
      toast.add({
        severity: 'success',
        summary,
        detail,
        life: duration,
        group: TOAST_GROUP
      });
    } catch (error) {
      console.error('Error showing success toast:', error);
    }
  };

  /**
   * Show an info toast notification
   */
  const info = (summary: string, detail: string, duration = TOAST_DURATIONS.MEDIUM) => {
    if (!toast) return;

    toast.add({
      severity: 'info',
      summary,
      detail,
      life: duration,
      group: TOAST_GROUP
    });
  };

  /**
   * Show a warning toast notification
   */
  const warn = (summary: string, detail: string, duration = TOAST_DURATIONS.MEDIUM) => {
    if (!toast) return;

    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: duration,
      group: TOAST_GROUP
    });
  };

  /**
   * Show an error toast notification
   */
  const error = (summary: string, detail: string, duration = TOAST_DURATIONS.MEDIUM) => {
    if (!toast) {
      console.error('Toast service not available in error method');
      return;
    }

    console.log('Showing error toast:', summary, detail);

    try {
      toast.add({
        severity: 'error',
        summary,
        detail,
        life: duration,
        group: TOAST_GROUP
      });
    } catch (error) {
      console.error('Error showing error toast:', error);
    }
  };

  /**
   * Show an access denied toast notification
   */
  const accessDenied = (detail = 'You do not have the required permissions to access this page', duration = TOAST_DURATIONS.MEDIUM) => {
    if (!toast) {
      console.error('Toast service not available in accessDenied');
      return;
    }

    try {
      toast.add({
        severity: 'error',
        summary: 'Access Denied',
        detail,
        life: duration,
        group: TOAST_GROUP
      });
    } catch (error) {
      console.error('Error adding toast notification:', error);
    }
  };

  /**
   * Show an authentication error toast notification
   */
  const authError = (detail = 'Authentication error', duration = TOAST_DURATIONS.MEDIUM) => {
    if (!toast) return;

    toast.add({
      severity: 'error',
      summary: 'Authentication Error',
      detail,
      life: duration,
      group: TOAST_GROUP
    });
  };

  /**
   * Show a session expired toast notification
   */
  const sessionExpired = (detail = 'Your session has expired. Please login again.', duration = TOAST_DURATIONS.MEDIUM) => {
    if (!toast) return;

    toast.add({
      severity: 'error',
      summary: 'Session Expired',
      detail,
      life: duration,
      group: TOAST_GROUP
    });
  };

  return {
    success,
    info,
    warn,
    error,
    accessDenied,
    authError,
    sessionExpired
  };
};
