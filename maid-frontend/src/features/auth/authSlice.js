import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from './authAPI';

const token = localStorage.getItem('token');

export const signup = createAsyncThunk('auth/signup', authAPI.signup);
export const login = createAsyncThunk('auth/login', authAPI.login);
export const verifyOtp = createAsyncThunk('auth/verifyOtp', authAPI.verifyOtp);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    otpPhase: false,
    apiresponse: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('persist:root');
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.otpPhase = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(login.fulfilled, (state,action) => {
        state.otpPhase = true;
        state.loading = false;
        localStorage.setItem('userId', action.payload.userId);
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpPhase = false;
        state.tokenIssuedAt = Date.now();
        localStorage.setItem('token', action.payload.token);
      })

      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // This now contains the actual error message
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
