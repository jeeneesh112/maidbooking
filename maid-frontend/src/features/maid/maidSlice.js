import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as maidAPI from './maidAPI';   

const token = localStorage.getItem('token');

export const fetchMaid = createAsyncThunk('maid/fetchMaid', maidAPI.getMaidsByArea);
export const fetchMaidById = createAsyncThunk('maid/fetchMaidById', maidAPI.getMaid);
export const createMaid = createAsyncThunk('maid/createMaid', maidAPI.addMaid);
export const updateMaid = createAsyncThunk('maid/updateMaid', maidAPI.updateMaid);
export const deleteMaid = createAsyncThunk('maid/deleteMaid', maidAPI.deleteMaid);
// export const fetchMaidByUserId = createAsyncThunk('maid/fetchMaidByUserId', maidAPI.fetchMaidByUserId);

const maidSlice = createSlice({
    name: 'maid',
    initialState: {
        maids: [
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
        maid: null,
        loading: false,
        error: null,
        maidCreated: false,
        maidUpdated: false,
        maidDeleted: false,
    },
    reducers: {
        resetMaidState: (state) => {
        state.maidCreated = false;
        state.maidUpdated = false;
        state.maidDeleted = false;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchMaid.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchMaid.fulfilled, (state, action) => {
            state.loading = false;
            state.maids = action.payload;
        })
        .addCase(fetchMaid.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchMaidById.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchMaidById.fulfilled, (state, action) => {
            state.loading = false;
            state.maid = action.payload;
        })
        .addCase(fetchMaidById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(createMaid.pending, (state) => {
            state.loading = true;
        })
        .addCase(createMaid.fulfilled, (state, action) => {
            state.loading = false;
            state.maidCreated = true;
            state.maids.push(action.payload);
        })
        .addCase(createMaid.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(updateMaid.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateMaid.fulfilled, (state, action) => {
            state.loading = false;
            state.maidUpdated = true;
            const index = state.maids.findIndex((maid) => maid.id === action.payload.id);
            if (index !== -1) {
                state.maids[index] = action.payload;
            }
        })
        .addCase(updateMaid.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(deleteMaid.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteMaid.fulfilled, (state, action) => {
            state.loading = false;
            state.maidDeleted = true;
            state.maids = state.maids.filter((maid) => maid.id !== action.payload.id);
        })
        .addCase(deleteMaid.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
});

export const { resetMaidState } = maidSlice.actions;
export default maidSlice.reducer;