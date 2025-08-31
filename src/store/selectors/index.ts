import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Auth selectors
export const selectAuthState = (state: RootState) => state.auth;
export const selectUIState = (state: RootState) => state.ui;

// Individual auth selectors
export const selectCurrentUser = (state: RootState) => {
  const user = state.auth.user;
  // Ensure user is either a valid object or null, never false
  return (user && typeof user === 'object' && user.id) ? user : null;
};
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;

// Memoized selectors
export const selectUserProfile = createSelector(
  [selectAuthState],
  (auth) => ({
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
  })
);

export const selectUserDisplayName = createSelector(
  [selectAuthState],
  (auth) => auth.user?.name || auth.user?.username || 'Anonymous'
);

export const selectUserInitials = createSelector(
  [selectAuthState],
  (auth) => {
    if (!auth.user?.name) return 'AN';
    return auth.user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
);

export const selectAppTheme = createSelector(
  [selectUIState],
  (ui) => ui.theme
);

export const selectUnreadNotifications = createSelector(
  [selectUIState],
  (ui) => ui.notifications.filter(n => !n.read).length
);

// Combined selectors
export const selectAppStatus = createSelector(
  [selectAuthState, selectUIState],
  (auth, ui) => ({
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isOnline: ui.isOnline,
    theme: ui.theme,
  })
);