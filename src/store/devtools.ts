import { DevToolsEnhancerOptions } from '@reduxjs/toolkit';

export const devToolsConfig: DevToolsEnhancerOptions = {
  name: 'ChirpNest App',
  trace: true,
  traceLimit: 25,
  actionSanitizer: (action: any) => {
    // Sanitize sensitive data in actions
    if (action.type?.includes('login') || action.type?.includes('register')) {
      return {
        ...action,
        payload: action.payload ? { ...action.payload, password: '[REDACTED]' } : action.payload,
      };
    }
    return action;
  },
  stateSanitizer: (state: any) => {
    // Sanitize sensitive data in state
    return {
      ...state,
      auth: state.auth ? {
        ...state.auth,
        token: state.auth.token ? '[REDACTED]' : null,
      } : state.auth,
    };
  },
};