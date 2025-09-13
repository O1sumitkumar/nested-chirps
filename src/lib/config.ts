// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    QUERY: '/ai-agent/query',
    LOGIN: '/login',
    SIGNUP: '/signup',
  },
  DEFAULT_DB: {
    URL: import.meta.env.VITE_LIVE_DB_URL || 'mongodb://localhost:27017/chirps',
    TYPE: import.meta.env.VITE_DB_TYPE || 'mongodb',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};