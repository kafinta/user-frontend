import { toast, type ToastOptions } from 'vue3-toastify'

// Standard toast durations
const TOAST_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000
}

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
    }
  }

  // Default toast options - match plugin configuration
  const defaultOptions: ToastOptions = {
    autoClose: TOAST_DURATIONS.MEDIUM,
    position: toast.POSITION.TOP_CENTER,
    theme: 'colored',
    transition: toast.TRANSITIONS.SLIDE,
    hideProgressBar: true,
    pauseOnHover: false,
    pauseOnFocusLoss: false,
    closeOnClick: true
  }

  /**
   * Show a success toast notification
   */
  const success = (summary: string, detail?: string, duration = TOAST_DURATIONS.SHORT) => {
    const message = detail ? `${summary}: ${detail}` : summary
    toast.success(message, { ...defaultOptions, autoClose: duration })
  }

  /**
   * Show an info toast notification
   */
  const info = (summary: string, detail?: string, duration = TOAST_DURATIONS.MEDIUM) => {
    const message = detail ? `${summary}: ${detail}` : summary
    toast.info(message, { ...defaultOptions, autoClose: duration })
  }

  /**
   * Show a warning toast notification
   */
  const warn = (summary: string, detail?: string, duration = TOAST_DURATIONS.MEDIUM) => {
    const message = detail ? `${summary}: ${detail}` : summary
    toast.warning(message, { ...defaultOptions, autoClose: duration })
  }

  /**
   * Show an error toast notification
   */
  const error = (summary: string, detail?: string, duration = TOAST_DURATIONS.MEDIUM) => {
    const message = detail ? `${summary}: ${detail}` : summary
    toast.error(message, { ...defaultOptions, autoClose: duration })
  }

  /**
   * Show an access denied toast notification
   */
  const accessDenied = (detail = 'You do not have the required permissions to access this page', duration = TOAST_DURATIONS.MEDIUM) => {
    toast.error(`Access Denied: ${detail}`, { ...defaultOptions, autoClose: duration })
  }

  /**
   * Show an authentication error toast notification
   */
  const authError = (detail = 'Authentication error', duration = TOAST_DURATIONS.MEDIUM) => {
    toast.error(`Authentication Error: ${detail}`, { ...defaultOptions, autoClose: duration })
  }

  /**
   * Show a session expired toast notification
   */
  const sessionExpired = (detail = 'Your session has expired. Please login again.', duration = TOAST_DURATIONS.MEDIUM) => {
    toast.error(`Session Expired: ${detail}`, { ...defaultOptions, autoClose: duration })
  }

  return {
    success,
    info,
    warn,
    error,
    accessDenied,
    authError,
    sessionExpired
  }
}
