import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "@/lib/paymentService";
import { BASE_URL, getAuthToken } from "@/lib/api";

// Helper fetch for payment endpoints
async function payFetch(url, body = null) {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: body !== null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const t = await res.text();
    let msg;
    try { msg = JSON.parse(t).message; } catch { msg = t; }
    throw new Error(msg || "Request failed");
  }
  return res.json();
}

export const preAuthorizePayment = createAsyncThunk(
  "payment/preAuthorize",
  async (paymentData, { rejectWithValue }) => {
    try { return await paymentService.preAuthorize(paymentData); } 
    catch (error) { return rejectWithValue(error.message); }
  }
);

export const capturePayment = createAsyncThunk(
  "payment/capture",
  async ({ paymentId, captureData }, { rejectWithValue }) => {
    try { return await paymentService.capture(paymentId, captureData); } 
    catch (error) { return rejectWithValue(error.message); }
  }
);

export const initiateTransfer = createAsyncThunk(
  "payment/transfer",
  async (transferData, { rejectWithValue }) => {
    try { return await paymentService.initiateTransfer(transferData); }
    catch (error) { return rejectWithValue(error.message); }
  }
);

// NEW: Fetch payment history from real API
// Endpoint: POST /payments/history?limit=50&offset=0
// Response: [ { id, paymentId, amount, currency, status, createdAt } ]
export const fetchPaymentHistory = createAsyncThunk(
  "payment/fetchHistory",
  async (_, { rejectWithValue }) => {
    try { return await payFetch(`${BASE_URL}/payments/history?limit=50&offset=0`, {}); }
    catch (error) { return rejectWithValue(error.message); }
  }
);

// NEW: Cancel a payment order
// Endpoint: POST /payments/request-cancel/:paymentId
export const cancelPayment = createAsyncThunk(
  "payment/cancel",
  async (paymentId, { rejectWithValue, dispatch }) => {
    try {
      const res = await payFetch(`${BASE_URL}/payments/request-cancel/${paymentId}`);
      dispatch(fetchPaymentHistory()); // refresh list
      return res;
    } catch (error) { return rejectWithValue(error.message); }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: { 
    loading: false, 
    error: null, 
    paymentId: null, 
    paymentStatus: "idle",
    transferStatus: "idle",
    history: [],           // NEW: payment history list
    cancellationLoading: false, // NEW
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false; 
      state.error = null; 
      state.paymentId = null; 
      state.paymentStatus = "idle";
      state.transferStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Pre-Auth
      .addCase(preAuthorizePayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(preAuthorizePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentId = action.payload.paymentId || action.payload.id;
        state.paymentStatus = "authorized";
      })
      .addCase(preAuthorizePayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Capture
      .addCase(capturePayment.pending, (state) => { 
          state.loading = true; 
          state.paymentStatus = "capturing"; 
      })
      .addCase(capturePayment.fulfilled, (state) => { state.loading = false; state.paymentStatus = "captured"; })
      .addCase(capturePayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Transfer
      .addCase(initiateTransfer.pending, (state) => { state.loading = true; state.transferStatus = "loading"; })
      .addCase(initiateTransfer.fulfilled, (state) => { state.loading = false; state.transferStatus = "success"; })
      .addCase(initiateTransfer.rejected, (state, action) => { state.loading = false; state.transferStatus = "failed"; state.error = action.payload; })

      // NEW: Payment History
      .addCase(fetchPaymentHistory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data || action.payload || [];
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // NEW: Cancel Order
      .addCase(cancelPayment.pending, (state) => { state.cancellationLoading = true; })
      .addCase(cancelPayment.fulfilled, (state) => { state.cancellationLoading = false; })
      .addCase(cancelPayment.rejected, (state, action) => { state.cancellationLoading = false; state.error = action.payload; });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export const selectPaymentState = (state) => state.payment;
export default paymentSlice.reducer;
