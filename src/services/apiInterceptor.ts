import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

// Global API interceptor to handle 401 responses
export class ApiInterceptor {
  private static instance: ApiInterceptor;
  private isLoggingOut = false;

  private constructor() {}

  public static getInstance(): ApiInterceptor {
    if (!ApiInterceptor.instance) {
      ApiInterceptor.instance = new ApiInterceptor();
    }
    return ApiInterceptor.instance;
  }

  // Handle API response and check for 401
  public async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401 && !this.isLoggingOut) {
      console.warn('401 Unauthorized detected, logging out user');
      await this.handleUnauthorized();
      throw new Error('Unauthorized - Session expired');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Handle unauthorized access
  private async handleUnauthorized(): Promise<void> {
    if (this.isLoggingOut) {
      return; // Prevent multiple simultaneous logout attempts
    }

    this.isLoggingOut = true;

    try {
      // Clear all authentication data
      store.dispatch(logout());
      
      // Clear any additional localStorage items if needed
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Clear any session storage
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = '/login';
      
      console.log('User logged out due to 401 Unauthorized');
    } catch (error) {
      console.error('Error during logout process:', error);
    } finally {
      this.isLoggingOut = false;
    }
  }

  // Reset the logout flag (useful for testing or manual reset)
  public resetLogoutFlag(): void {
    this.isLoggingOut = false;
  }
}

// Export singleton instance
export const apiInterceptor = ApiInterceptor.getInstance();
