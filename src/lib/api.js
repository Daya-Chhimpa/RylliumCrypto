// src/lib/api.js
export const BASE_URL = "https://api.satorem.com"; // Hardcoded for simplicity

const AUTH_TOKEN_KEY = "authToken";

export function setAuthToken(token) {
  try {
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      } else {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  } catch {}
}

export function getAuthToken() {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
    }
  } catch {}
  return "";
}

export function clearAuthToken() {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      // Also clear cookie if possible, but usually handled by server/middleware interaction or distinct function
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  } catch {}
}

export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json"); 

  try {
    const token = getAuthToken();
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  } catch {}

  const init = {
    method: options.method || "GET",
    headers,
    body: typeof options.body === "string" ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  
  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed: ${res.status}`;
    // Attach status to error for easier handling
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const endpoints = {
  ticker: () => "/ticker",
  register: () => "/users/register",
  confirmEmail: () => "/auth/verify_email",
  login: () => "/users/login",
  forgotPassword: () => "/auth/forgot_password",
  forgotPassword2: () => "/auth/update_password",
  
  // KYC / Sumsub
  sumsubAccessToken: () => "/sumsub/access-token",
  getVerificationStatus: () => "/user/verification-status",
  kycStatus: () => "/api/kyc/kycStatus",
  startKyc: () => "/api/kyc/startKyc",

  // 2FA
  getTwoFaStatus: (userId) => `/users/getTwoFaStatus/${userId}`,
  enableTwoFa: () => "/users/twofa/enable",
  verifyTwoFa: () => "/users/twofa/verify",
  disableTwoFaSimple: () => "/users/disableTwoFaSimple",
};



