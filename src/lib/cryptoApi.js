// src/lib/cryptoApi.js

export const getCryptoPrices = async (ids = ["bitcoin", "ethereum", "solana"]) => {
  try {
    const idsString = ids.join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd&include_24hr_change=true`;
    
    // Use a standard fetch here as this is external to our main API
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch prices");
    return await res.json();
  } catch (error) {
    console.error("Crypto Price Fetch Error:", error);
    return null;
  }
};
