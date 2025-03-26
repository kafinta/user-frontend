import { useWindowSize } from "@vueuse/core";

// composables/useTruncate.ts
export function useTruncate() {
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

    // Check current viewport width
    const { width } = useWindowSize()

    // Breakpoint definitions (adjust as needed for your design)
    const breakpointSizes = {
      mobile: 640,   // Small phones
      tablet: 768,   // Tablets
      desktop: 1024, // Desktops
      large: 1280,
    }

    // Determine if truncation should be disabled based on current viewport
    const enableTruncation = (
      (width.value <= breakpointSizes.mobile && breakpoints.mobile === true) ||
      (width.value <= breakpointSizes.tablet && breakpoints.tablet === true) ||
      (width.value >= breakpointSizes.desktop && breakpoints.desktop === true)||
      (width.value >= breakpointSizes.large && breakpoints.large === true)
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