import { addToast, setGlobalLoading } from "./slices/uiSlice";

const ignoredActions = [
  "auth/checkKycStatus",
  "ticker/fetchPrices",
  "payment/history"
];

const isIgnored = (type) => ignoredActions.some((prefix) => type.startsWith(prefix));

export const toastMiddleware = (store) => (next) => (action) => {
  if (isIgnored(action.type)) {
    return next(action);
  }

  if (action.type.endsWith("/pending")) {
    store.dispatch(setGlobalLoading(true));
  } else if (action.type.endsWith("/fulfilled")) {
    store.dispatch(setGlobalLoading(false));
  } else if (action.type.endsWith("/rejected")) {
    store.dispatch(setGlobalLoading(false));
    const message = action.payload || action.error?.message || "An error occurred";
    store.dispatch(addToast({ type: "error", message }));
  }

  return next(action);
};
