"use client";

import { useMemo, useState } from "react";
import { apiRequest, endpoints } from "@/lib/api";

const FIAT_OPTIONS = ["USD", "EUR", "GBP", "INR"];
const CRYPTO_OPTIONS = ["BTC", "ETH", "SOL", "USDT"];

export default function ExchangeForm() {
  const [fiatAmount, setFiatAmount] = useState("");
  const [fiat, setFiat] = useState("USD");
  const [crypto, setCrypto] = useState("BTC");
  
  // Payment State
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, collect_card, processing, requires_action, succeeded, failed
  const [actionUrl, setActionUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

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

  const handleInitiateFlow = (e) => {
    e.preventDefault();
    if (!fiatAmount || Number(fiatAmount) <= 0) return;
    setStatus("collect_card");
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("processing");

    try {
      // Mock / Real API Call
      const res = await apiRequest(endpoints.initiatePayment(), {
        method: "POST",
        body: { amount: fiatAmount, currency: fiat }
      });

      if (res.requires_action) {
        setStatus("requires_action");
        setActionUrl(res.redirect_url);
        setPaymentId(res.payment_id);
      } else if (res.status === "succeeded") {
        setStatus("succeeded");
      } else {
        setStatus("failed");
      }
    } catch (err) {
      console.error("Payment failed", err);
      // Fallback for demo purposes if backend isn't ready
      // Always trigger 3DS for demo flow as requested
      // Mocking a 3DS challenge
       setStatus("requires_action");
       setActionUrl("#"); // dummy
    } finally {
      if (status !== "requires_action") setLoading(false);
    }
  };

  const handleSimulate3DS = async () => {
    setLoading(true);
    // Simulate async verification
    setTimeout(() => {
        setStatus("succeeded");
        setLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setStatus("idle");
    setFiatAmount("");
    setLoading(false);
  };

  if (status === "succeeded") {
    return (
      <section className="rl-exchange">
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(76, 64, 247, 0.1)',
          boxShadow: '0 10px 40px rgba(76, 64, 247, 0.08)',
          textAlign: 'center'
        }}>
           <div style={{fontSize: '48px', marginBottom: '16px'}}>🎉</div>
           <h4 style={{fontSize: '24px', fontWeight: 700, color: '#10b981', marginBottom: '8px'}}>Purchase Successful!</h4>
           <p style={{color: 'var(--muted)', fontSize: '16px', marginBottom: '24px'}}>
             You have successfully purchased {cryptoAmount.toFixed(8)} {crypto}.
           </p>
           <button 
             className="rl-btn rl-btn-outline" 
             onClick={resetForm}
             style={{padding: '12px 32px', borderRadius: '12px'}}
           >
             Make Another Purchase
           </button>
        </div>
      </section>
    );
  }

  if (status === "requires_action") {
    return (
      <section className="rl-exchange">
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(76, 64, 247, 0.1)',
          boxShadow: '0 10px 40px rgba(76, 64, 247, 0.08)',
          textAlign: 'center'
        }}>
          <h4 style={{fontSize: '20px', fontWeight: 700, marginBottom: '16px'}}>Security Check Required</h4>
          <p style={{marginBottom: '24px', color: 'var(--muted)'}}>
            Your bank requires additional verification for this transaction.
          </p>
          
          <div style={{
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            padding: '24px', 
            background: '#f9fafb',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <p style={{fontWeight: 600, marginBottom: '12px', color: '#374151'}}>Bank Verification (Mock)</p>
            <p style={{fontSize: '14px', marginBottom: '20px', color: '#6b7280'}}>
              Please confirm the payment of <strong>{fiat} {fiatAmount}</strong> for {crypto}.
            </p>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
               <button 
                 className="rl-btn rl-btn-primary" 
                 onClick={handleSimulate3DS}
                 disabled={loading}
                 style={{padding: '10px 24px', borderRadius: '8px'}}
               >
                 {loading ? "Verifying..." : "Confirm Identity"}
               </button>
            </div>
          </div>
          <p style={{fontSize: '12px', color: '#9ca3af'}}>
            (In a real integration, this would redirect you to your bank's 3DS page)
          </p>
        </div>
      </section>
    );
  }

  if (status === "collect_card") {
    return (
      <section className="rl-exchange">
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(76, 64, 247, 0.1)',
          boxShadow: '0 10px 40px rgba(76, 64, 247, 0.08)'
        }}>
          <div style={{marginBottom: '24px', textAlign: 'center'}}>
             <h4 style={{fontSize: '20px', fontWeight: 700, marginBottom: '8px'}}>Enter Card Details</h4>
             <p style={{color: 'var(--muted)', fontSize: '14px'}}>Secure Payment for {cryptoAmount.toFixed(8)} {crypto}</p>
          </div>

          <form onSubmit={handleProcessPayment}>
            <div style={{marginBottom: '20px'}}>
               <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#374151'}}>Card Number</label>
               <input 
                 type="text" 
                 placeholder="0000 0000 0000 0000" 
                 className="rl-input" 
                 style={{width: '100%', padding: '12px 16px', background: '#f9fafb'}}
                 required
               />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px'}}>
               <div>
                 <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#374151'}}>Expiry Date</label>
                 <input 
                   type="text" 
                   placeholder="MM / YY" 
                   className="rl-input" 
                   style={{width: '100%', padding: '12px 16px', background: '#f9fafb'}}
                   required 
                 />
               </div>
               <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#374151'}}>CVC</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="rl-input" 
                    style={{width: '100%', padding: '12px 16px', background: '#f9fafb'}}
                    required 
                  />
               </div>
            </div>

            <div style={{display: 'flex', gap: '16px'}}>
              <button 
                type="button"
                className="rl-btn rl-btn-outline" 
                onClick={() => setStatus("idle")}
                style={{flex: 1, padding: '14px', borderRadius: '12px'}}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="rl-btn rl-btn-primary" 
                disabled={loading}
                style={{
                  flex: 2, 
                  padding: '14px', 
                  borderRadius: '12px',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(76, 64, 247, 0.3)',
                  border: 'none',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Processing..." : `Pay ${fiat} ${fiatAmount}`}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // IDLE STATE
  return (
    <section className="rl-exchange">
      <div style={{
        background: '#fff',
        borderRadius: '20px', // Matches dashboard card style
        padding: '32px',
        border: '1px solid rgba(76, 64, 247, 0.1)',
        boxShadow: '0 10px 40px rgba(76, 64, 247, 0.08)' // Matches dashboard shadow
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
                disabled={loading}
              />
              <select
                className="rl-select"
                value={fiat}
                onChange={(e) => setFiat(e.target.value)}
                disabled={loading}
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
                disabled
              />
              <select
                className="rl-select"
                value={crypto}
                onChange={(e) => setCrypto(e.target.value)}
                disabled={loading}
              >
                {CRYPTO_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            className="rl-btn rl-btn-primary rl-buy" 
            onClick={handleInitiateFlow}
            disabled={loading || !fiatAmount || Number(fiatAmount) <= 0}
            style={{
              height: '52px',
              padding: '0 32px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              boxShadow: '0 8px 24px rgba(76, 64, 247, 0.3)',
              border: 'none',
              cursor: (loading || !fiatAmount) ? 'not-allowed' : 'pointer',
              opacity: (loading || !fiatAmount) ? 0.7 : 1
            }}
          >
            Buy Crypto
          </button>
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



