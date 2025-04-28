import { ref, onMounted, onUnmounted } from 'vue';

// composables/useTruncate.ts
export function useTruncate() {
  // Create a reactive window width reference
  const windowWidth = ref(0);
  
  // Update window width function
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth;
  };
  
  // Simple debounce implementation
  let debounceTimer: number | null = null;
  const debouncedUpdateWidth = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = window.setTimeout(() => {
      updateWindowWidth();
    }, 100);
  };

  // Set up event listeners when the composable is used in a component
  if (typeof window !== 'undefined') {
    onMounted(() => {
      updateWindowWidth();
      window.addEventListener('resize', debouncedUpdateWidth);
    });
    
    onUnmounted(() => {
      window.removeEventListener('resize', debouncedUpdateWidth);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    });
  }

  const truncateText = (
    text: string, 
    options: {
      maxWidth?: number;
      maxLines?: number;
      ellipsis?: string;
      breakpoints?: {
        // Disable truncation at specific breakpoints
        mobile?: boolean;
        tablet?: boolean;
        desktop?: boolean;
        large?: boolean;
      };
    } = {}
  ): string => {
    // Default options
    const {
      maxWidth = 50,
      maxLines = 1,
      ellipsis = '...',
      breakpoints = {}
    } = options;

    // Breakpoint definitions (adjust as needed for your design)
    const breakpointSizes = {
      mobile: 640,   // Small phones
      tablet: 768,   // Tablets
      desktop: 1024, // Desktops
      large: 1280,
    }

    // Determine if truncation should be disabled based on current viewport
    const enableTruncation = (
      (windowWidth.value <= breakpointSizes.mobile && breakpoints.mobile === true) ||
      (windowWidth.value <= breakpointSizes.tablet && breakpoints.tablet === true) ||
      (windowWidth.value >= breakpointSizes.desktop && breakpoints.desktop === true)||
      (windowWidth.value >= breakpointSizes.large && breakpoints.large === true)
    )

    // If truncation is disabled for current viewport, return full text
    if (!enableTruncation) {
      return text;
    }

    // Original truncation logic
    if (text.length <= maxWidth && maxLines === 1) {
      return text;
    }

    if (maxLines > 1) {
      const lines = text.split('\n');
      if (lines.length <= maxLines) {
        return text;
      }
      return lines.slice(0, maxLines).join('\n') + ellipsis;
    }

    if (text.length <= maxWidth) {
      return text;
    }

    return text.slice(0, maxWidth - ellipsis.length).trim() + ellipsis;
  }

  return { truncateText }
}