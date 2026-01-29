import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { paymentService } from "@/lib/paymentService";

const initialState = {
  history: [],
  status: "idle",
  error: null,
};

export const preAuthorizeThunk = createAsyncThunk(
  "payment/preAuthorize",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await paymentService.preAuthorize(paymentData);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const capturePaymentThunk = createAsyncThunk(
  "payment/capture",
  async ({ paymentId, captureData }, { rejectWithValue }) => {
    try {
      return await paymentService.capture(paymentId, captureData);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const getPaymentHistoryThunk = createAsyncThunk(
  "payment/getHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getPaymentHistory();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(preAuthorizeThunk.pending, (state) => { state.status = "loading"; })
      .addCase(preAuthorizeThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(preAuthorizeThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(capturePaymentThunk.pending, (state) => { state.status = "loading"; })
      .addCase(capturePaymentThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(capturePaymentThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; })

      .addCase(getPaymentHistoryThunk.pending, (state) => { state.status = "loading"; })
      .addCase(getPaymentHistoryThunk.fulfilled, (state, action) => { 
        state.status = "succeeded"; 
        state.history = action.payload; 
      })
      .addCase(getPaymentHistoryThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.payload; });
  },
});

export default paymentSlice.reducer;
