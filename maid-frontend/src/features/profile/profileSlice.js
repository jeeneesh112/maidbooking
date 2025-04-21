import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../profile/profileAPI";

export const fetchProfile = createAsyncThunk(
  "profile/userInfo",
  async (userId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const  data  = await userInfo({ id: userId }, token); // Destructure response
      return data; // Return the actual data
    } catch (err) {
      if (err.response?.data) {
        return rejectWithValue(
          err.response.data.message || "Something went wrong"
        );
      }
      return rejectWithValue(err.message || "Network error: Please try again later");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Add a manual clear reducer
    clearProfile: (state) => {
      state.userData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        
        if (!action.payload) {
          state.error = "Received empty profile data";
          return;
        }
        const { password, __v, createdAt, updatedAt, ...userData } = action.payload;

        state.userData = userData; // Store cleaned data
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 
                     action.error?.message || 
                     "Failed to load profile";
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;