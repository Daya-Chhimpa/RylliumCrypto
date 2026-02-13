"use client";

import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkKycStatusThunk } from "@/store/slices/authSlice"; 
import { addToast } from "@/store/slices/uiSlice";

const FIAT_OPTIONS = ["USD", "EUR", "GBP", "INR"];
const CRYPTO_OPTIONS = ["BTC", "ETH", "SOL", "USDT"];

export default function ExchangeForm({ onBuy }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Use local state or from user if available
  const kycStatus = user?.kycStatus;

  useEffect(() => {
    dispatch(checkKycStatusThunk());
  }, [dispatch]);

  const [fiatAmount, setFiatAmount] = useState(0);
  const [fiat, setFiat] = useState("USD");
  const [crypto, setCrypto] = useState("BTC");

  // Fake prices for demo
  const price = useMemo(() => {
    const base = {
      BTC: 111124.8,
      ETH: 3450.25,
      SOL: 175.4,
      USDT: 1,
    }[crypto];

    const fx = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83,
    }[fiat];

    return base * fx;
  }, [crypto, fiat]);

  const cryptoAmount = useMemo(() => {
    const amt = Number(fiatAmount) || 0;
    return amt <= 0 || price <= 0 ? 0 : amt / price;
  }, [fiatAmount, price]);

  const handleBuy = () => {
    // Check KYC
    const statusSafe = typeof kycStatus === "string" ? kycStatus.toLowerCase() : "";
    // Note: In real app, "approved" or similar. For demo/unverified, we might block.
    // However, if user is testing, we might want to allow provided they know.
    // Let"s strict check if context implies strictness, or loose for demo.
    // The user"s guide used: if (statusSafe !== "approved")
    
    // For now, let"s use valid check, but log it.
    // If NO User, maybe just proceed for UI demo if that"s the intent? 
    // User instruction: "Dashboard KYC Status Integration... if approved... else error"
    // So stick to that.
    
    if (statusSafe !== "approved") {
        dispatch(addToast({
            type: "error",
            title: "Authentication Required",
            description: "Please complete your KYC verification first."
        }));
        return;
    }

    if (!fiatAmount || Number(fiatAmount) <= 0) {
        dispatch(addToast({ type: "error", title: "Invalid Amount", description: "Please enter an amount." }));
        return;
    }

    if (onBuy) {
        onBuy({
            fiatAmount,
            fiatCurrency: fiat,
            cryptoAmount: cryptoAmount.toFixed(8),
            cryptoCurrency: crypto
        });
    }
  };

  return (
    <section className="rl-exchange">
      <div className="rl-row">
        <div className="rl-col">
          <label className="rl-label">FIAT:</label>
          <div className="rl-input-group">
            <input
              type="number"
              min="0"
              step="0.01"
              className="rl-input"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              placeholder="0.00"
            />
            <select
              className="rl-select"
              value={fiat}
              onChange={(e) => setFiat(e.target.value)}
            >
              {FIAT_OPTIONS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="rl-arrow" aria-hidden>
          →
        </div>
        <div className="rl-col">
          <label className="rl-label">CRYPTO:</label>
          <div className="rl-input-group">
            <input
              type="text"
              className="rl-input"
              value={cryptoAmount.toFixed(8)}
              readOnly
            />
            <select
              className="rl-select"
              value={crypto}
              onChange={(e) => setCrypto(e.target.value)}
            >
              {CRYPTO_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="rl-btn rl-btn-primary rl-buy" onClick={handleBuy}>Buy crypto</button>
      </div>
      <p className="rl-rate">
        Exchange Rate: 1 {crypto} ≈ {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiat}
      </p>
    </section>
  );
}



