"use client";

import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToast } from "@/store/slices/uiSlice";

const FIAT_OPTIONS = ["USD", "EUR", "GBP", "INR"];
const CRYPTO_OPTIONS = ["BTC", "ETH", "SOL", "USDT"];

// Fetch live prices from CoinGecko (free, no key needed)
async function fetchLivePrices() {
  try {
    const ids = "bitcoin,ethereum,solana,tether";
    const vs = "usd,eur,gbp,inr";
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return {
      BTC:  { USD: data.bitcoin?.usd,  EUR: data.bitcoin?.eur,  GBP: data.bitcoin?.gbp,  INR: data.bitcoin?.inr },
      ETH:  { USD: data.ethereum?.usd, EUR: data.ethereum?.eur, GBP: data.ethereum?.gbp, INR: data.ethereum?.inr },
      SOL:  { USD: data.solana?.usd,   EUR: data.solana?.eur,   GBP: data.solana?.gbp,   INR: data.solana?.inr },
      USDT: { USD: data.tether?.usd,   EUR: data.tether?.eur,   GBP: data.tether?.gbp,   INR: data.tether?.inr },
    };
  } catch {
    return null;
  }
}

export default function ExchangeForm({ onBuy }) {
  const dispatch = useDispatch();

  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [fiatAmount, setFiatAmount] = useState(0);
  const [fiat, setFiat] = useState("EUR");
  const [crypto, setCrypto] = useState("BTC");
  const [prices, setPrices] = useState(null);

  // Fetch live prices on mount
  useEffect(() => {
    fetchLivePrices().then((data) => {
      if (data) setPrices(data);
    });
  }, []);

  const price = useMemo(() => prices?.[crypto]?.[fiat] || 0, [prices, crypto, fiat]);

  const cryptoAmount = useMemo(() => {
    const amt = Number(fiatAmount) || 0;
    return amt <= 0 || price <= 0 ? 0 : amt / price;
  }, [fiatAmount, price]);

  const handleBuy = () => {
    // Validate amount first
    if (!fiatAmount || Number(fiatAmount) <= 0) {
      dispatch(addToast({
        type: "error",
        title: "Amount Required",
        description: "Please enter a valid amount to purchase crypto."
      }));
      return;
    }

    // KYC check: MUST be approved to proceed
    if (user?.kycStatus !== 'APPROVED') {
      dispatch(addToast({
        type: "warning",
        title: "KYC Required",
        description: "Please complete your Identity Verification to buy crypto."
      }));
      router.push("/settings");
      return;
    }

    // Proceed to checkout
    if (onBuy) {
      onBuy({
        fiatAmount,
        fiatCurrency: fiat,
        cryptoAmount: cryptoAmount.toFixed(8),
        cryptoCurrency: crypto,
      });
    }
  };

  return (
    <section className="rl-exchange">
      <div className="rl-row">
        <div className="rl-col">
          <label className="rl-label">I PAY:</label>
          <div className="rl-input-group">
            <input
              type="number"
              min="0"
              step="0.01"
              className="rl-input"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              placeholder="100.00"
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

        <div className="rl-arrow" aria-hidden>→</div>

        <div className="rl-col">
          <label className="rl-label">I GET:</label>
          <div className="rl-input-group">
            <input
              type="number"
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

        <button className="rl-btn rl-btn-primary rl-buy" onClick={handleBuy}>
          Buy crypto
        </button>
      </div>

      <p className="rl-rate">
        {price > 0 ? (
          <>Exchange Rate: 1 {crypto} ≈ {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiat}</>
        ) : (
          <>Loading live rates...</>
        )}
      </p>
    </section>
  );
}
