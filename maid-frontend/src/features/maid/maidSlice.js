import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as maidAPI from "./maidAPI";

// export const fetchMaid = createAsyncThunk('maid/fetchMaid', maidAPI.getMaidsByArea);

export const fetchMaid = createAsyncThunk(
  "maid/fetchMaid",
  async (bodydata, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const data = await maidAPI.getMaidsByArea(
        {
            area: bodydata?.area,
            page: bodydata?.page,
            limit: bodydata?.limit,
        },
        token
      );
      return data;
    } catch (err) {
      if (err.response?.data) {
        return rejectWithValue(
          err.response.data.message || "Something went wrong"
        );
      }
      return rejectWithValue(
        err.message || "Network error: Please try again later"
      );
    }
  }
);

export const createMaid = createAsyncThunk(
  "maid/createMaid",
  async (maidData, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const data = await maidAPI.addMaid(maidData, token);
      return data;
    } catch (err) {
      if (err.response?.data) {
        return rejectWithValue(
          err.response.data.message || "Something went wrong"
        );
      }
      return rejectWithValue(
        err.message || "Network error: Please try again later"
      );
    }
  }
);

export const deleteMaid = createAsyncThunk(
  "maid/deleteMaid",
  async (id, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    console.log("deleteMaid maidId:", id);
    try {
      const data = await maidAPI.deleteMaid({id : id}, token);
      return data;
    } catch (err) {
      if (err.response?.data) {
        return rejectWithValue(
          err.response.data.message || "Something went wrong"
        );
      }
      return rejectWithValue(
        err.message || "Network error: Please try again later"
      );
    }
  }
);


export const fetchMaidById = createAsyncThunk(
  "maid/fetchMaidById",
  maidAPI.getMaid
);
// export const createMaid = createAsyncThunk("maid/createMaid", maidAPI.addMaid);
export const updateMaid = createAsyncThunk(
  "maid/updateMaid",
  maidAPI.updateMaid
);
// export const deleteMaid = createAsyncThunk(
//   "maid/deleteMaid",
//   maidAPI.deleteMaid
// );
// export const fetchMaidByUserId = createAsyncThunk('maid/fetchMaidByUserId', maidAPI.fetchMaidByUserId);

const maidSlice = createSlice({
  name: "maid",
  initialState: {
    maids: [],
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
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaid.fulfilled, (state, action) => {
        console.log("fetchMaid fulfilled action.payload:", action.payload);
        state.loading = false;
        state.maids = action.payload.maids;
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
        state.maids.push(action.payload.data);
      })
      .addCase(createMaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateMaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMaid.fulfilled, (state, action) => {
        state.loading = false;
        state.maidUpdated = true;
        const index = state.maids.findIndex(
          (maid) => maid.id === action.payload.id
        );
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
      .addCase(deleteMaid.fulfilled, (state,action) => {
        state.loading = false;
        state.maidDeleted = true;
        state.maids = state.maids.filter(
          (maid) => maid._id !== action.payload.maid._id
        );
      })
      .addCase(deleteMaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetMaidState } = maidSlice.actions;
export default maidSlice.reducer;
