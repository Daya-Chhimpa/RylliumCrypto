import { addToast, showLoader, hideLoader } from "./slices/uiSlice";

const toastTitles = {
  fulfilled: "Success",
  rejected: "Failed",
};

// Actions to ignore for global loader/toasts (background polling, etc)
const ignoredActions = [
  "auth/checkKycStatus/pending", 
  "auth/checkKycStatus/fulfilled", 
  "auth/checkKycStatus/rejected",
  "ticker/fetch/pending",
  "ticker/fetch/fulfilled",
  "ticker/fetch/rejected"
];

export const toastMiddleware = (store) => (next) => (action) => {
  const isThunk = typeof action.type === "string" && action.type.includes("/") && (action.type.endsWith("/pending") || action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"));
  
  if (ignoredActions.includes(action.type)) {
     return next(action);
  }

  if (isThunk && action.type.endsWith("/pending")) {
    store.dispatch(showLoader());
  }

  const result = next(action);

  if (isThunk && (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"))) {
    store.dispatch(hideLoader());
    const phase = action.type.split("/").pop();
    const type = phase === "fulfilled" ? "success" : "error";
    const title = toastTitles[phase] || "Notice";
    const baseType = action.type.replace(/\/(pending|fulfilled|rejected)$/i, "");

    const successFallback = {
      "auth/login": "Successfully logged in",
      "auth/register": "Registration successful. Please check your email",
      "auth/confirmEmail": "Email confirmed",
      "auth/forgotPassword": "Password reset email sent",
      "auth/resetPassword": "Password updated successfully",
      "auth/startKyc": "KYC Session Started",
      // ... add others as needed
    };

    let description;
    if (phase === "fulfilled") {
      if (typeof action.payload === "string") {
        description = action.payload;
      } else {
        description = action.payload?.message || action.payload?.msg || successFallback[baseType] || "Request completed successfully";
      }
    } else {
      description = action.payload || action.error?.message || action.meta?.arg?.message || "Request failed";
    }

    store.dispatch(addToast({ type, title, description }));
  }

  return result;
};



