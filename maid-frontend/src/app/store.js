import {combineReducers, configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import maidReducer from '../features/maid/maidSlice';
import profileReducer from '../features/profile/profileSlice';
import bookingReducer from '../features/booking/bookingSlice';
// import bookingReducer from '../features/booking/bookingSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'profile','maid'], // specify which reducers you want to persist
  };

  const rootReducer = {
    auth: authReducer,
    profile: profileReducer,
    maid : maidReducer,
    booking: bookingReducer,
    // add other reducers here
  };

  const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
  
  const persistor = persistStore(store);
  
  export { store, persistor };

// export const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         maid: maidReducer,
//         profile : profileReducer,
//         // booking: bookingReducer,
//     },
// });

