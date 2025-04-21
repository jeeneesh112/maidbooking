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
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
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

      .addCase(login.fulfilled, (state) => {
        state.otpPhase = true;
        state.loading = false;
      })

      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpPhase = false;
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
