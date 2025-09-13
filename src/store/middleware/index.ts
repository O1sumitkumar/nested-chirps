import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Custom middleware for handling auth token persistence
export const authMiddleware: Middleware<{}, RootState> = (store) => (next) => (action: any) => {
  const result = next(action);

  // Listen for auth actions and sync with localStorage
  if (action.type === 'auth/loginUser/fulfilled') {
    const state = store.getState();
    if (state.auth.token) {
      localStorage.setItem('token', state.auth.token);
    }
  }

  if (action.type === 'auth/logout') {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any additional app-specific localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('app_') || key.startsWith('chirp_') || key.startsWith('user_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage as well
    sessionStorage.clear();
  }

  return result;
};

// Network status middleware
export const networkMiddleware: Middleware<{}, RootState> = () => (next) => (action: any) => {
  const result = next(action);

  // Handle network-related actions
  if (action.type?.includes('rejected') && action.error?.message?.includes('fetch')) {
    // Could dispatch a network error action here
    console.warn('Network request failed:', action.error.message);
  }

  return result;
};