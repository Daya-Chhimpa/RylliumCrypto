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

// 2FA
export const preEnable2faThunk = createAsyncThunk(
  "auth/preEnable2fa",
  async (_payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.preEnable2fa(), { method: "GET" });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const enable2faThunk = createAsyncThunk(
  "auth/enable2fa",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.enable2fa(), { method: "PUT", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const disable2faThunk = createAsyncThunk(
  "auth/disable2fa",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.disable2fa(), { method: "PUT", body: payload });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// Fetch 2FA status
export const twoFAStatusThunk = createAsyncThunk(
  "auth/twoFAStatus",
  async (_payload, { rejectWithValue }) => {
    try {
      return await apiRequest(endpoints.twoFAStatus(), { method: "GET" });
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

      // 2FA
      .addCase(preEnable2faThunk.pending, pending)
      .addCase(preEnable2faThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(preEnable2faThunk.rejected, rejected)

      .addCase(enable2faThunk.pending, pending)
      .addCase(enable2faThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(enable2faThunk.rejected, rejected)

      .addCase(disable2faThunk.pending, pending)
      .addCase(disable2faThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(disable2faThunk.rejected, rejected)

      // twoFA status
      .addCase(twoFAStatusThunk.pending, pending)
      .addCase(twoFAStatusThunk.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(twoFAStatusThunk.rejected, rejected);
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;


