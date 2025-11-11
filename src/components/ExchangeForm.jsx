"use client";

import { useMemo, useState } from "react";

const FIAT_OPTIONS = ["USD", "EUR", "GBP", "INR"];
const CRYPTO_OPTIONS = ["BTC", "ETH", "SOL", "USDT"];

export default function ExchangeForm() {
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

  return (
    <section className="rl-exchange">
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid rgba(76, 64, 247, 0.1)',
        boxShadow: '0 10px 40px rgba(76, 64, 247, 0.08)'
      }}>
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
          <button className="rl-btn rl-btn-primary rl-buy" style={{
            height: '52px',
            padding: '0 32px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '15px',
            boxShadow: '0 8px 24px rgba(76, 64, 247, 0.3)',
            border: 'none'
          }}>Buy Crypto</button>
        </div>
        <p className="rl-rate" style={{
          marginTop: 20,
          padding: '16px',
          background: 'rgba(76, 64, 247, 0.05)',
          borderRadius: '12px',
          fontWeight: 600
        }}>
          Exchange Rate: 1 {crypto} ≈ {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiat}
        </p>
      </div>
    </section>
  );
}



