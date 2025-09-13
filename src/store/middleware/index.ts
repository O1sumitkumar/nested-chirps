import { Middleware } from '@reduxjs/toolkit';

// Custom middleware for handling auth token persistence
export const authMiddleware: Middleware = (store) => (next) => (action: any) => {
  const result = next(action);

  // Listen for auth actions and sync with localStorage
  if (action.type === 'auth/loginUser/fulfilled') {
    const state = store.getState();
    if (state.auth.token) {
      localStorage.setItem('token', state.auth.token);
    }
  }

  if (action.type === 'auth/logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }



  return result;
};

// Network status middleware
export const networkMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

  // Handle network-related actions
  if (action.type?.includes('rejected') && action.error?.message?.includes('fetch')) {
    // Could dispatch a network error action here
    console.warn('Network request failed:', action.error.message);
  }

  return result;
};