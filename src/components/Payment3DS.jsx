"use client";

import { useState } from "react";
import { apiRequest, endpoints } from "@/lib/api";

export default function Payment3DS() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, processing, requires_action, succeeded, failed
  const [actionUrl, setActionUrl] = useState(null);
  const [paymentId, setPaymentId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("processing");

    try {
      // In a real scenario, you would collect card details via Stripe/Adyen Elements
      // specific SDKs generate a token. Here we simulate a backend call directly.
      
      // MOCK CALL for demonstration if backend is not ready:
      // Remove this block when backend is ready
      /*
      await new Promise(r => setTimeout(r, 1000));
      if (parseFloat(amount) > 100) {
        setStatus("requires_action");
        setActionUrl("https://example.com/3ds-challenge"); // Mock URL
        setLoading(false);
        return;
      }
      */

      const res = await apiRequest(endpoints.initiatePayment(), {
        method: "POST",
        body: { amount, currency }
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
      // Mocking a 3DS challenge for amounts > 100
      if (parseFloat(amount) > 100) {
         setStatus("requires_action");
         setActionUrl("#"); // dummy
      } else {
         setStatus("succeeded");
      }
    } finally {
      if (status !== "requires_action") setLoading(false);
    }
  };

  const handleSimulate3DS = async () => {
    // This function simulates the user completing the 3DS verification
    setLoading(true);
    setTimeout(() => {
        setStatus("succeeded");
        setLoading(false);
    }, 2000);
  };

  return (
    <div className="card" style={{padding: '24px', maxWidth: '500px'}}>
      <h3 style={{fontSize: '20px', fontWeight: 700, marginBottom: '20px'}}>Add Funds (3D Secure)</h3>
      
      {status === "succeeded" ? (
        <div style={{textAlign: 'center', padding: '20px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>🎉</div>
          <h4 style={{fontSize: '18px', fontWeight: 600, color: '#10b981'}}>Payment Successful!</h4>
          <p style={{color: 'var(--muted)', marginTop: '8px'}}>Your wallet has been funded.</p>
          <button 
            className="rl-btn rl-btn-outline" 
            style={{marginTop: '20px'}}
            onClick={() => { setStatus("idle"); setAmount(""); }}
          >
            Add More
          </button>
        </div>
      ) : status === "requires_action" ? (
        <div style={{textAlign: 'center', padding: '10px'}}>
          <h4 style={{fontSize: '18px', fontWeight: 600, marginBottom: '16px'}}>Security Check Required</h4>
          <p style={{marginBottom: '20px', color: 'var(--muted)'}}>
            Your bank requires additional verification for this transaction.
          </p>
          
          {/* Simulation of 3DS Iframe/Modal */}
          <div style={{
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            padding: '24px', 
            background: '#f9fafb',
            marginBottom: '20px'
          }}>
            <p style={{fontWeight: 600, marginBottom: '12px'}}>Bank Verification (Mock)</p>
            <p style={{fontSize: '14px', marginBottom: '16px'}}>Please confirm the payment of <strong>{currency} {amount}</strong></p>
            <button 
              className="rl-btn rl-btn-primary" 
              onClick={handleSimulate3DS}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Confirm Identity"}
            </button>
          </div>
          <p style={{fontSize: '12px', color: '#6b7280'}}>
            (In a real integration, this would display the bank's 3DS page or redirect you)
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '16px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px'}}>Amount</label>
            <div style={{position: 'relative'}}>
              <span style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}}>$</span>
              <input 
                type="number" 
                className="auth-input" 
                style={{paddingLeft: '32px'}}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="1"
              />
            </div>
          </div>

          <div style={{marginBottom: '24px'}}>
             <label style={{display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px'}}>Card Information</label>
             <div style={{
               border: '1px solid rgba(0,0,0,0.1)', 
               borderRadius: '12px', 
               padding: '12px', 
               background: '#f9fafb'
             }}>
                <div style={{display: 'flex', gap: '12px', marginBottom: '12px'}}>
                  <input placeholder="Card number" className="auth-input" style={{flex: 1, background:'white'}} />
                </div>
                <div style={{display: 'flex', gap: '12px'}}>
                  <input placeholder="MM / YY" className="auth-input" style={{flex: 1, background:'white'}} />
                  <input placeholder="CVC" className="auth-input" style={{flex: 1, background:'white'}} />
                </div>
             </div>
             <p style={{fontSize: '12px', color: '#6b7280', marginTop: '8px'}}>
               * Payments over $100 will trigger 3DS verification mock.
             </p>
          </div>

          <button 
            type="submit" 
            className="rl-btn rl-btn-primary" 
            style={{width: '100%'}}
            disabled={loading || !amount}
          >
            {loading ? "Processing..." : `Pay $${amount || '0.00'}`}
          </button>
        </form>
      )}
    </div>
  );
}
