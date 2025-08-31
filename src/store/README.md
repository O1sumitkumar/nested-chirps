# Redux Store Structure

This directory contains the Redux Toolkit store configuration for the ChirpNest application.

## Structure

```
src/store/
├── index.ts              # Store configuration and setup
├── hooks.ts              # Typed hooks for useDispatch and useSelector
├── devtools.ts           # Redux DevTools configuration
├── slices/               # Redux slices (state + reducers + actions)
│   ├── authSlice.ts      # Authentication state management
│   └── uiSlice.ts        # UI state management
├── middleware/           # Custom middleware
│   └── index.ts          # Auth and network middleware
├── selectors/            # Memoized selectors
│   └── index.ts          # Common selectors
└── README.md            # This file
```

## Key Features

### 1. Modern Redux Toolkit Setup
- Uses `configureStore` for optimal defaults
- Includes Redux DevTools with sanitization
- Production-ready middleware configuration

### 2. Type Safety
- Full TypeScript integration
- Typed hooks (`useAppDispatch`, `useAppSelector`)
- Strongly typed state and actions

### 3. Middleware Stack
- **Redux Logger**: Development-only logging
- **Auth Middleware**: Handles token persistence
- **Network Middleware**: Handles network errors
- **Default RTK Middleware**: Includes thunk, serialization checks

### 4. State Slices

#### Auth Slice (`authSlice.ts`)
- User authentication state
- Login/logout/register async thunks
- Token management
- Session restoration

#### UI Slice (`uiSlice.ts`)
- Theme management
- Sidebar state
- In-app notifications
- Online/offline status

### 5. Selectors
- Memoized selectors for performance
- Computed values (user initials, display names)
- Combined state selectors

## Usage Examples

### Basic Usage
```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginUser, selectIsAuthenticated } from '@/store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };
  
  return <div>{isAuthenticated ? 'Logged in' : 'Not logged in'}</div>;
};
```

### Using Selectors
```typescript
import { useAppSelector } from '@/store/hooks';
import { selectUserProfile, selectUserInitials } from '@/store/selectors';

const UserProfile = () => {
  const { user, isAuthenticated } = useAppSelector(selectUserProfile);
  const initials = useAppSelector(selectUserInitials);
  
  return <div>{initials}</div>;
};
```

### Async Actions
```typescript
// In component
const handleLogin = async () => {
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

## Best Practices

1. **Use Typed Hooks**: Always use `useAppDispatch` and `useAppSelector`
2. **Memoized Selectors**: Use `createSelector` for computed values
3. **Async Thunks**: Use `createAsyncThunk` for API calls
4. **Error Handling**: Handle both fulfilled and rejected cases
5. **State Normalization**: Keep state flat and normalized
6. **Immutable Updates**: RTK uses Immer internally for immutable updates

## Development Tools

- **Redux DevTools**: Configured with action/state sanitization
- **Redux Logger**: Console logging in development
- **Time Travel Debugging**: Full action replay capability
- **State Inspection**: Real-time state monitoring

## Security Considerations

- Sensitive data (passwords, tokens) are sanitized in DevTools
- Tokens are stored securely in localStorage
- Auth middleware handles token lifecycle
- State is cleared on logout

## Performance Optimizations

- Memoized selectors prevent unnecessary re-renders
- Middleware is conditionally loaded (logger only in dev)
- State is normalized to prevent deep nesting
- Selective subscriptions via specific selectors