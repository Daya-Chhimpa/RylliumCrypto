import { BASE_URL, getAuthToken, apiRequest } from "./api";

export const paymentService = {
  async preAuthorize(paymentData) {
    // POST /payments/pre-authorize
    return apiRequest("/payments/pre-authorize", {
      method: "POST",
      body: paymentData
    });
  },
  async capture(paymentId, captureData) {
    // POST /payments/capture/{paymentId}
    return apiRequest(`/payments/capture/${paymentId}`, {
      method: "POST",
      body: captureData
    });
  },
  async getPaymentHistory() {
    // POST /payments/history
    return apiRequest("/payments/history", {
      method: "POST"
    });
  }
};
