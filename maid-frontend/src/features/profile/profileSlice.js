import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as profileAPI from './profileAPI';


export const fetchProfile = createAsyncThunk('profile/userInfo', profileAPI.userInfo);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        users : [
            {
              id: 1,
              name: 'Rani Sharma',
              mobile: '9876543210',
              city: 'Delhi',
              state: 'Delhi',
              area: 'Lajpat Nagar',
              pincode: '110024',
              salary: '15000',
            },
          ],
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetProfileState: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;