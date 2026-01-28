import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalLoading: false,
  toasts: [], // { id, type: 'success'|'error'|'info', message }
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setGlobalLoading(state, action) {
      state.globalLoading = action.payload;
    },
    addToast(state, action) {
      const { type, message } = action.payload;
      state.toasts.push({
        id: Date.now().toString(),
        type,
        message,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const { setGlobalLoading, addToast, removeToast, clearToasts } = uiSlice.actions;
export default uiSlice.reducer;
