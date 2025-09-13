import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authenticateUser, registerUser } from '@/services/api';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  verified?: boolean;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check stored auth
  error: null,
  token: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authenticateUser(credentials.email, credentials.password);

      if (!response.success || !response.data || !response.token) {
        return rejectWithValue(response.message || 'Login failed');
      }

      console.log('Login response:', response);

      // Store token in localStorage
      localStorage.setItem('token', response.token);

      return {
        user: response.data,
        token: response.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUserAsync = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string; username: string; name: string },
  { rejectValue: string }
>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(
        userData.email,
        userData.password,
        userData.username,
        userData.name
      );

      if (!response.success || !response.data || !response.token) {
        return rejectWithValue(response.message || 'Registration failed');
      }
      
      console.log('Registration response:', response);
      return {
        user: response.data,
        token: response.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const initializeAuth = createAsyncThunk<
  { user: User; token: string } | null,
  void,
  { rejectValue: string }
>(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      console.log('InitializeAuth: Stored data', { storedUser, storedToken });

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser) as User;
        console.log('InitializeAuth: Parsed user data', userData);

        // Validate user data structure
        if (userData && typeof userData === 'object' && userData.id) {
          return {
            user: userData,
            token: storedToken,
          };
        } else {
          console.warn('InitializeAuth: Invalid user data structure', userData);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return null;
        }
      }

      return null;
    } catch (error: any) {
      console.error('InitializeAuth: Error parsing stored data', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return rejectWithValue('Failed to restore session');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.isLoading = false;
      
      // Clear all localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
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
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.isLoading = false;
      
      // Clear all localStorage items
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
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
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login fulfilled with payload:', action.payload);
        console.log('Action payload user:', action.payload?.user);
        console.log('Action payload user type:', typeof action.payload?.user);
        state.isLoading = false;

        // Validate user data
        if (action.payload?.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;

          // Store user in localStorage
          console.log('Storing user in localStorage:', action.payload.user);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          console.log('Auth state after login:', { user: state.user, isAuthenticated: state.isAuthenticated });
        } else {
          console.error('Invalid user data received:', action.payload?.user);
          console.error('Full payload:', action.payload);
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.error = 'Invalid user data received';
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Don't auto-login after registration, redirect to login
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        console.log('InitializeAuth fulfilled with payload:', action.payload);
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          console.log('Auth state after initialization:', {
            isAuthenticated: state.isAuthenticated,
            user: state.user
          });
        } else {
          console.log('No stored auth data found');
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, updateUser, clearError, resetAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;