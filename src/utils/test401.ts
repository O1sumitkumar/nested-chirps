// Utility function to test 401 handling
// This can be used for testing purposes or debugging

export const test401Response = async () => {
  try {
    // Make a request that will return 401
    const response = await fetch('/api/test-401', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer invalid-token`,
      },
    });
    
    if (response.status === 401) {
      console.log('401 test response received');
    }
    
    return response;
  } catch (error) {
    console.error('401 test error:', error);
    throw error;
  }
};

// Function to simulate a 401 response for testing
export const simulate401 = () => {
  // This would be used in development to test the 401 handling
  console.log('Simulating 401 response...');
  
  // You can call this from browser console: window.simulate401()
  if (typeof window !== 'undefined') {
    (window as any).simulate401 = () => {
      // Create a mock 401 response
      const mockResponse = new Response('Unauthorized', { 
        status: 401, 
        statusText: 'Unauthorized' 
      });
      
      // This would trigger the interceptor
      fetch('/api/test-401').then(response => {
        if (response.status === 401) {
          console.log('401 detected in test');
        }
      });
    };
  }
};
