# 401 Unauthorized Handling Implementation

This document describes the global 401 error handling implementation that automatically logs out users and redirects them to the login page when any API returns a 401 status code.

## Overview

The implementation consists of several components that work together to provide comprehensive 401 handling:

1. **API Interceptor Service** (`apiInterceptor.ts`)
2. **Global Fetch Wrapper** (`fetchWrapper.ts`)
3. **Enhanced Logout Actions** (in `authSlice.ts`)
4. **Middleware Updates** (in `middleware/index.ts`)

## Components

### 1. API Interceptor Service (`src/services/apiInterceptor.ts`)

A singleton service that handles 401 responses globally:

- **Purpose**: Intercepts API responses and checks for 401 status codes
- **Features**:
  - Prevents multiple simultaneous logout attempts
  - Clears all authentication data
  - Redirects to login page
  - Clears localStorage and sessionStorage

### 2. Global Fetch Wrapper (`src/services/fetchWrapper.ts`)

Wraps the global `fetch` function to catch any API calls that don't go through the main API service:

- **Purpose**: Ensures all fetch calls are monitored for 401 responses
- **Features**:
  - Intercepts all fetch calls globally
  - Handles 401 responses consistently
  - Can be restored for testing purposes

### 3. Enhanced Logout Actions

Updated the Redux store actions to clear all data:

- **logout**: Clears user data, tokens, and app-specific localStorage items
- **resetAuth**: Same as logout but also resets loading state
- **Middleware**: Ensures localStorage is cleared when logout actions are dispatched

## How It Works

1. **API Call Made**: Any API call goes through either `queryApi` or the global fetch wrapper
2. **Response Check**: The interceptor checks if the response status is 401
3. **Logout Triggered**: If 401 is detected, the logout process begins
4. **Data Cleared**: All authentication data, localStorage, and sessionStorage are cleared
5. **Redirect**: User is redirected to the login page

## Usage

The implementation is automatically active once the app starts. No additional configuration is needed.

### Testing

You can test the 401 handling by:

1. **Browser Console**: Open browser dev tools and run:
   ```javascript
   // This will trigger a 401 response
   fetch('/api/test-401', { headers: { 'Authorization': 'Bearer invalid-token' } });
   ```

2. **Manual Token Expiry**: Wait for your JWT token to expire naturally

3. **Server-Side**: Configure your backend to return 401 for expired tokens

## Files Modified

- `src/services/apiInterceptor.ts` (new)
- `src/services/fetchWrapper.ts` (new)
- `src/services/api.ts` (updated)
- `src/App.tsx` (updated)
- `src/store/slices/authSlice.ts` (updated)
- `src/store/middleware/index.ts` (updated)

## Security Considerations

- **Token Validation**: The implementation assumes your backend properly validates JWT tokens
- **Automatic Logout**: Users are logged out immediately upon 401 detection
- **Data Clearing**: All sensitive data is cleared from localStorage and sessionStorage
- **Redirect Safety**: Uses `window.location.href` for reliable redirects

## Error Handling

- **Network Errors**: Network errors are not treated as 401 responses
- **Multiple 401s**: The interceptor prevents multiple simultaneous logout attempts
- **Console Logging**: 401 detection is logged to console for debugging

## Browser Compatibility

- **Modern Browsers**: Works in all modern browsers that support ES6+
- **Fetch API**: Requires fetch API support (available in all modern browsers)
- **localStorage**: Requires localStorage support (available in all modern browsers)

## Troubleshooting

If 401 handling is not working:

1. **Check Console**: Look for error messages in browser console
2. **Verify Interceptor**: Ensure `setupGlobalFetchInterceptor()` is called in App.tsx
3. **Check Network**: Verify that 401 responses are actually being returned by the API
4. **Token Format**: Ensure your API expects `Bearer` token format

## Future Enhancements

Potential improvements to consider:

1. **Custom Redirect URL**: Allow configuration of redirect destination
2. **Retry Logic**: Implement retry logic for transient 401 errors
3. **User Notification**: Show toast notification before redirect
4. **Analytics**: Track 401 occurrences for monitoring
5. **Conditional Handling**: Skip 401 handling for certain endpoints
