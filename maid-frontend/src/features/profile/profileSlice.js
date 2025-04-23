import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../profile/profileAPI";

export const fetchProfile = createAsyncThunk(
  "profile/userInfo",
  async (userId, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const  data  = await userInfo({ id: userId }, token);
      return data;
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
    userData: {
      name: "Jeeneesh Patel",
      email: "pateljinish0112@gmail.com",
      mobile: "9725487353",
      area: "aurum sky",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380060",
      pic: "https://media-hosting.imagekit.io/01d51a6530cc472f/download.jpeg?Expires=1839836883&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mrSDtKCqi5lzR-hM0PpVqnfH0LrVrnIhm2biYJapfFxYj71B7Nva8skz0POjh1zrTm6PqMToGmyVla3GuItbU8d4InCTIdtr7qv8tihwSjriWOYDAQ8Qb1IrMLUR~2vBYxhVOUCCD29Wfzq9RhLfWBH7U3eyDbc0dkfbclGqtaik2qI8lqVjkcRpGsB3YB95xGVdKXDY7-70tLq19F0GT1hLA5dZteGF87Jt9j2jB~ODyiIOb5NYuktsm~2pAtBjAztJGkLqlBJK5c1MvlVNF7DffbhJsj38SSWP7BIacNKErABZEHRY-yrxOO9ZVf2HRpjlARNxrnHoZFyVgJCGTQ__",
    },
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
        const { ...userData } = action.payload;

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