// ===============================
// RETRY CONFIGURATION UTILITIES
// ===============================

/**
 * Smart retry configuration for React Query
 * Handles different types of errors with appropriate retry strategies
 */
export const retryConfig = {
  /**
   * Determines whether to retry based on error type and failure count
   * @param failureCount - Number of previous failed attempts
   * @param error - The error object from the failed request
   * @returns boolean - Whether to retry the request
   */
  shouldRetry: (failureCount: number, error: any): boolean => {
    // Don't retry client errors (4xx status codes)
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    
    // Don't retry network errors after too many attempts
    if (failureCount >= 3) {
      return false;
    }
    
    // Retry server errors (5xx) and network errors
    return true;
  },

  /**
   * Exponential backoff delay calculation
   * @param attemptIndex - Current attempt number (0-based)
   * @returns number - Delay in milliseconds
   */
  getRetryDelay: (attemptIndex: number): number => {
    // Exponential backoff: 1s, 2s, 4s, 8s...
    // Cap at 30 seconds to avoid extremely long delays
    return Math.min(1000 * 2 ** attemptIndex, 30000);
  },

  /**
   * Linear backoff delay calculation (alternative strategy)
   * @param attemptIndex - Current attempt number (0-based)
   * @returns number - Delay in milliseconds
   */
  getLinearRetryDelay: (attemptIndex: number): number => {
    // Linear backoff: 1s, 2s, 3s, 4s...
    return Math.min(1000 * (attemptIndex + 1), 10000);
  },

  /**
   * Custom retry configuration for critical operations
   */
  critical: {
    maxRetries: 5,
    shouldRetry: (failureCount: number, error: any): boolean => {
      // More aggressive retry for critical operations
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 5;
    },
    getRetryDelay: (attemptIndex: number): number => {
      return Math.min(500 * 2 ** attemptIndex, 15000);
    },
  },

  /**
   * Conservative retry configuration for non-critical operations
   */
  conservative: {
    maxRetries: 1,
    shouldRetry: (failureCount: number, error: any): boolean => {
      // Only retry once for non-critical operations
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 1;
    },
    getRetryDelay: (): number => 2000, // Fixed 2-second delay
  },
};

/**
 * Error type checking utilities
 */
export const errorUtils = {
  isClientError: (error: any): boolean => {
    return error?.status >= 400 && error?.status < 500;
  },

  isServerError: (error: any): boolean => {
    return error?.status >= 500 && error?.status < 600;
  },

  isNetworkError: (error: any): boolean => {
    return !error?.status || error?.name === 'NetworkError';
  },

  isTimeoutError: (error: any): boolean => {
    return error?.name === 'TimeoutError' || error?.code === 'TIMEOUT';
  },
};

/**
 * Predefined retry configurations for common use cases
 */
export const retryPresets = {
  // Default configuration for most API calls
  default: {
    retry: retryConfig.shouldRetry,
    retryDelay: retryConfig.getRetryDelay,
  },

  // For critical operations that must succeed
  critical: {
    retry: retryConfig.critical.shouldRetry,
    retryDelay: retryConfig.critical.getRetryDelay,
  },

  // For non-critical operations where speed is preferred
  fast: {
    retry: retryConfig.conservative.shouldRetry,
    retryDelay: retryConfig.conservative.getRetryDelay,
  },

  // No retry for operations that should fail fast
  noRetry: {
    retry: false,
    retryDelay: 0,
  },
};