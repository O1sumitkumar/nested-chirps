import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import logger from 'redux-logger';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import { authMiddleware, networkMiddleware } from './middleware';
import { devToolsConfig } from './devtools';

const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(authMiddleware)
      .concat(networkMiddleware);
    
    return isDevelopment ? middleware.concat(logger) : middleware;
  },
  devTools: isDevelopment ? devToolsConfig : false,
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;