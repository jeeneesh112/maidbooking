import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import maidReducer from '../features/maid/maidSlice';
// import bookingReducer from '../features/booking/bookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        maid: maidReducer,
        // booking: bookingReducer,
    },
});

