import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, endpoints, setAuthToken, clearAuthToken } from "@/lib/api";

const initialState = {
  user: null,
  status: "idle",
  error: null,
  // 2FA Login Flow
  requiresTwoFa: false,
  tempToken: null,
  twoFaMethods: [],
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.register(), { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const confirmEmailThunk = createAsyncThunk(
  "auth/confirmEmail",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.confirmEmail(), { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const resp = await apiRequest(endpoints.login(), { method: "POST", body: payload });
      
      // Check for user role
      const user = resp?.user || resp?.data?.user;
      if (user?.user_role && String(user.user_role).toLowerCase() !== 'user') {
          return rejectWithValue("Access denied: Only users can login.");
      }

      // Check for 2FA requirement (NEW response format)
      if (resp?.requiresTwoFa) {
        return resp; // handled in fulfilled
      }

      return resp;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// NEW: Send OTP to email during 2FA login
export const sendLoginOtpThunk = createAsyncThunk(
  "auth/sendLoginOtp",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      return await apiRequest(endpoints.sendLoginOtp(), {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.tempToken}` }
      });
    } catch (e) { return rejectWithValue(e.message); }
  }
);

// NEW: Verify 2FA code during login
export const verifyTwoFaThunk = createAsyncThunk(
  "auth/verifyTwoFa",
  async (payload, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      return await apiRequest(endpoints.loginTwoFa(), {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.tempToken}` },
        body: payload  // { code, method }
      });
    } catch (e) { return rejectWithValue(e.message); }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.forgotPassword(), { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.forgotPassword2(), { method: "POST", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// KYC / Sumsub Thunks
export const startKycThunk = createAsyncThunk(
  "auth/startKyc",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.startKyc(), { method: "POST" });
    } catch (e) {
      // Fallback or specific error handling
      console.error("KYC Start Error", e);
      return rejectWithValue(e.message);
    }
  }
);

export const checkKycStatusThunk = createAsyncThunk(
  "auth/checkKycStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.kycStatus());
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.requiresTwoFa = false;
      state.tempToken = null;
      state.twoFaMethods = [];
      if (typeof document !== "undefined") {
        document.cookie = "auth=; Max-Age=0; path=/";
      }
      clearAuthToken();
    },
    // NEW: Clear 2FA state (used when user clicks Back on 2FA screen)
    clearTwoFa(state) {
      state.requiresTwoFa = false;
      state.tempToken = null;
      state.twoFaMethods = [];
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.status = "loading"; state.error = null; };
    const rejected = (state, action) => { state.status = "failed"; state.error = action.payload || action.error.message; };

    builder
      .addCase(registerThunk.pending, pending)
      .addCase(registerThunk.fulfilled, (state, action) => { state.status = "succeeded"; })
      .addCase(registerThunk.rejected, rejected)

      .addCase(confirmEmailThunk.pending, pending)
      .addCase(confirmEmailThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(confirmEmailThunk.rejected, rejected)

      .addCase(loginThunk.pending, pending)
      .addCase(loginThunk.fulfilled, (state, action) => {
        // 2FA required — save tempToken and methods, don't login yet
        if (action.payload?.requiresTwoFa) {
          state.status = "idle";
          state.requiresTwoFa = true;
          state.tempToken = action.payload.tempToken;
          state.twoFaMethods = action.payload.methods || [];
          return;
        }
        // Direct login success
        state.status = "succeeded";
        state.user = action.payload?.user || { email: action.meta.arg?.email };
        const token = action.payload?.token || action.payload?.accessToken || action.payload?.data?.token;
        if (token) {
          if (typeof document !== "undefined") {
            document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
          }
          setAuthToken(token);
        }
      })
      .addCase(loginThunk.rejected, rejected)

      // NEW: Send OTP
      .addCase(sendLoginOtpThunk.pending, pending)
      .addCase(sendLoginOtpThunk.fulfilled, (state) => { state.status = "idle"; })
      .addCase(sendLoginOtpThunk.rejected, rejected)

      // NEW: Verify 2FA code → complete login
      .addCase(verifyTwoFaThunk.pending, pending)
      .addCase(verifyTwoFaThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.requiresTwoFa = false;
        state.tempToken = null;
        state.user = action.payload?.user;
        const token = action.payload?.token || action.payload?.accessToken;
        if (token) {
          if (typeof document !== "undefined") {
            document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
          }
          setAuthToken(token);
        }
      })
      .addCase(verifyTwoFaThunk.rejected, rejected)


      .addCase(forgotPasswordThunk.pending, pending)
      .addCase(forgotPasswordThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(forgotPasswordThunk.rejected, rejected)

      .addCase(resetPasswordThunk.pending, pending)
      .addCase(resetPasswordThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(resetPasswordThunk.rejected, rejected)

      // KYC
      .addCase(startKycThunk.pending, pending)
      .addCase(startKycThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(startKycThunk.rejected, rejected)
      
      .addCase(checkKycStatusThunk.pending, (state) => { /* Don't set global loading necessary for polling */ })
      .addCase(checkKycStatusThunk.fulfilled, (state, action) => { 
          // Update user status if available
          if(state.user && action.payload?.kycStatus) {
              state.user.kycStatus = action.payload.kycStatus;
          }
      })
      .addCase(checkKycStatusThunk.rejected, (state, action) => { /* Silent failure acceptable for polling */ });
  },
});

export const { logout, clearTwoFa } = authSlice.actions;

export default authSlice.reducer;



