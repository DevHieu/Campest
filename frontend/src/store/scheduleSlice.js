import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllItineraries } from "../services/itineraryService";

export const fetchSchedule = createAsyncThunk(
  "schedule/fetch",
  async ({ userId, page, size }) => {
    const res = await getAllItineraries(userId, page, size);
    return res.data;
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default scheduleSlice.reducer;
