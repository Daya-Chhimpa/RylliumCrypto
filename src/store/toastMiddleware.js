import { addToast, showLoader, hideLoader } from "./slices/uiSlice";

const toastTitles = {
  fulfilled: "Success",
  rejected: "Failed",
};

export const toastMiddleware = (store) => (next) => (action) => {
  const isThunk = typeof action.type === "string" && action.type.includes("/") && (action.type.endsWith("/pending") || action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"));

  if (isThunk && action.type.endsWith("/pending")) {
    store.dispatch(showLoader());
  }

  const result = next(action);

  if (isThunk && (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"))) {
    store.dispatch(hideLoader());
    const phase = action.type.split("/").pop();
    const type = phase === "fulfilled" ? "success" : "error";
    const title = toastTitles[phase] || "Notice";
    const description = action.payload || action.error?.message || action.meta?.arg?.message;
    store.dispatch(addToast({ type, title, description }));
  }

  return result;
};



