import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest, endpoints, setAuthToken, clearAuthToken } from "@/lib/api";

const initialState = {
  user: null,
  status: "idle",
  error: null,
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
      if (resp?.user?.user_role && resp.user.user_role !== 'user') {
          return rejectWithValue("Access denied: Only users can login.");
      }

      const token = resp?.token || resp?.accessToken || resp?.data?.token;
      if (resp?.requires2FA && !token) {
        return rejectWithValue(resp?.message || "2FA code required");
      }
      return resp;
    } catch (e) {
      return rejectWithValue(e.message);
    }
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
      if (typeof document !== "undefined") {
        document.cookie = "auth=; Max-Age=0; path=/";
      }
      clearAuthToken();
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

export const { logout } = authSlice.actions;

export default authSlice.reducer;



