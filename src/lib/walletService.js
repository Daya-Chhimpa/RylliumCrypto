import { apiRequest } from "./api";

// Fetch user wallets
// Endpoint: POST /users/wallets
export async function getWallets() {
  return await apiRequest("/users/wallets", { method: "POST" });
}

// Create new wallet - CRITICAL FUNCTIONALITY
// Endpoint: POST /users/add-wallet
export async function createWallet(data) {
  return await apiRequest("/users/add-wallet", {
    method: "POST",
    body: {
      walletAddress: data.address, // Must match backend expectation
      network: data.chain        // Must match backend expectation
    },
  });
}

// Get specific wallet
export async function getWallet(id) {
  return apiRequest(`/wallets/${id}`);
}
