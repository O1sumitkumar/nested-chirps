import { apiInterceptor } from './apiInterceptor';

// Store the original fetch function
const originalFetch = window.fetch;

// Create a wrapper around fetch to intercept all API calls
export const setupGlobalFetchInterceptor = () => {
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      const response = await originalFetch(input, init);
      
      // Check for 401 status and handle it
      if (response.status === 401) {
        console.warn('401 Unauthorized detected in global fetch interceptor');
        await apiInterceptor.handleResponse(response);
        return response; // Return the response even though we're logging out
      }
      
      return response;
    } catch (error) {
      console.error('Global fetch interceptor error:', error);
      throw error;
    }
  };
};

// Function to restore original fetch (useful for testing)
export const restoreOriginalFetch = () => {
  window.fetch = originalFetch;
};
