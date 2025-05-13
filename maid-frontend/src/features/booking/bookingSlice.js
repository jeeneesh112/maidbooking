import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingAPI from "./bookingAPI";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { getState, rejectWithValue }) => {
    console.log("createBooking bookingData:", bookingData);
    const { token } = getState().auth;
    try {
      const data = await bookingAPI.createBooking(bookingData, token);
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

export const getBookingsByUser = createAsyncThunk(
  "booking/getBookingsByUser",
  async (bodydata, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    console.log("getBookingsByUser bodydata:", bodydata);
    try {
      const data = await bookingAPI.getBookingsByUser(
        {
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

export const getallBookings = createAsyncThunk(
  "booking/getallBookings",
  async (bodydata, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    console.log("getallBookings bodydata:", bodydata);
    try {
      const data = await bookingAPI.getallBookings(
        {
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

export const getmaidviseBookings = createAsyncThunk(
  "booking/getmaidviseBookings",
  async (bodydata, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const data = await bookingAPI.getmaidviseBookings(
        {
          maidId: bodydata?.maidId,
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

export const updateBookingStatus = createAsyncThunk(
  "booking/updateBookingStatus",
  async (bodydata, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const data = await bookingAPI.chnageBookingStatus(
        {
          maidId: bodydata?.maidId,
          userId: bodydata?.userId,
          bookingId: bodydata?.bookingId,
          status: bodydata?.status,
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

export const giveRating = createAsyncThunk(
  "booking/giveRating",
  async (bodydata, { getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const data = await bookingAPI.giveRating(
        {
          bookingId: bodydata?.bookingId,
          rating: bodydata?.rating,
          review: bodydata?.review,
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

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    booking: null,
    loading: false,
    error: null,
    bookingCreated: false,
    bookingUpdated: false,
    bookingDeleted: false,
  },
  reducers: {
    resetBookingState: (state) => {
      state.bookings = [];
      state.booking = null;
      state.loading = false;
      state.error = null;
      state.bookingCreated = false;
      state.bookingUpdated = false;
      state.bookingDeleted = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingsByUser.pending, (state) => {
        state.loading = true;
        state.location = null;
      })
      .addCase(getBookingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
      })
      .addCase(getBookingsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getallBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getallBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
      })
      .addCase(getallBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateBookingStatus.fulfilled, (state) => {
        state.loading = false;
        state.bookingUpdated = true;
      })

      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(giveRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(giveRating.fulfilled, (state) => {
        state.loading = false;
        state.bookingUpdated = true;
      })

      .addCase(giveRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingCreated = true;
        state.bookings.push(action.payload.data);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
