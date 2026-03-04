"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import ExchangeForm from "@/components/ExchangeForm";
import CardPaymentForm from "@/components/CardPaymentForm";
import { resetPaymentState } from "@/store/slices/paymentSlice";
import { getWallets } from "@/lib/walletService";

export default function DashboardHome() {
  const dispatch = useDispatch();

  const [step, setStep] = useState("exchange"); // "exchange" | "payment" | "success"
  const [txnData, setTxnData] = useState(null);
  const [successTimer, setSuccessTimer] = useState(4); // countdown seconds
  const [wallets, setWallets] = useState([]); 

  useEffect(() => {
    dispatch(resetPaymentState());
    getWallets()
      .then((data) => setWallets(data || []))
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (step !== "success") return;
    setSuccessTimer(4);
    const countdown = setInterval(() => {
      setSuccessTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleReset();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [step]);

  const handleBuy = (data) => {
    const matchedWallet = wallets.find(
      (w) => (w.network || w.chain || "").toUpperCase() === data.cryptoCurrency.toUpperCase()
    ) || wallets.find(
      (w) => (w.network || w.chain || "").toUpperCase() === "ERC20"
    ) || wallets[0] || null;

    setTxnData({
      ...data,
      walletAddress: matchedWallet ? (matchedWallet.walletAddress || matchedWallet.address || "") : "",
      network: matchedWallet ? (matchedWallet.network || matchedWallet.chain || "ERC20") : "ERC20",
    });
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  const handleReset = () => {
    dispatch(resetPaymentState());
    setStep("exchange");
    setTxnData(null);
  };

  return (
    <div className="rl-content animate-fade-in">
      <h1 className="rl-page-title">Buy <span>Crypto</span></h1>
      
      <div id="exchange" style={{ height: 24 }} />

      {/* STEP 1: Exchange Form */}
      {step === "exchange" && (
        <ExchangeForm onBuy={handleBuy} />
      )}

      {/* STEP 2: Card Payment */}
      {step === "payment" && txnData && (
        <div className="animate-slide-up">
          <style>{`
            .pay-layout { display: grid; grid-template-columns: 1fr 400px; gap: 24px; align-items: start; max-width: 1040px; }
            @media (max-width: 900px) { .pay-layout { grid-template-columns: 1fr; } .pay-right { order: -1; } }
          `}</style>
          <button
            onClick={() => { dispatch(resetPaymentState()); setStep("exchange"); }}
            className="rl-btn rl-btn-secondary"
            style={{ marginBottom: "1.25rem" }}
          >
            ← Back
          </button>

          {/* 2-column: form left, summary right */}
          <div className="pay-layout">
            <CardPaymentForm
              amount={txnData.fiatAmount}
              currency={txnData.fiatCurrency}
              cryptoAmount={txnData.cryptoAmount}
              cryptoCurrency={txnData.cryptoCurrency}
              walletAddress={txnData.walletAddress}
              network={txnData.network}
              onSuccess={handlePaymentSuccess}
            />

            {/* RIGHT PANEL */}
            <div className="pay-right" style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 20 }}>
              {/* Order Summary */}
              <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 18 }}>Order Summary</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "linear-gradient(135deg,#f59332,#e07000)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#fff", boxShadow: "0 4px 12px rgba(245,147,50,0.4)" }}>B</div>
                  <div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>Receiving</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{txnData.cryptoAmount} {txnData.cryptoCurrency}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Currency</span>
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{txnData.fiatCurrency}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Network</span>
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{txnData.network}</span>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Total Due</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>{txnData.fiatCurrency} {txnData.fiatAmount}</span>
                </div>
              </div>

              {/* Payment Badges */}
              <div style={{ background: "#ffffff", borderRadius: 16, padding: "16px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: 14 }}>
                  <svg width="38" height="26" viewBox="0 0 40 28" fill="none"><circle cx="15" cy="14" r="11" fill="#EB001B"/><circle cx="25" cy="14" r="11" fill="#F79E1B"/><path d="M20 6.5a11 11 0 0 1 0 15A11 11 0 0 1 20 6.5z" fill="#FF5F00"/></svg>
                  <span style={{ fontWeight: 900, fontSize: 16, color: "#1434CB", fontStyle: "italic", letterSpacing: -0.5 }}>VISA</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "#202124" }}>Pay</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <svg width="12" height="15" viewBox="0 0 14 17" fill="#000"><path d="M11.76 8.9c-.02-1.96 1.6-2.9 1.67-2.95-.91-1.33-2.33-1.51-2.84-1.53-1.2-.12-2.36.71-2.97.71-.62 0-1.56-.7-2.57-.68-1.31.02-2.53.77-3.2 1.94-1.38 2.38-.35 5.89.97 7.82.66.94 1.43 1.99 2.45 1.95.99-.04 1.36-.63 2.56-.63 1.19 0 1.53.63 2.57.61 1.06-.02 1.72-.95 2.37-1.9.75-1.08 1.06-2.14 1.07-2.19-.02-.01-2.06-.79-2.08-3.15zM9.8 2.9c.54-.66.92-1.58.82-2.52-.82.04-1.8.56-2.35 1.21-.5.58-.94 1.52-.82 2.42.91.07 1.85-.46 2.35-1.11z"/></svg>
                    <span style={{ fontWeight: 600, fontSize: 12, color: "#000" }}>Pay</span>
                  </div>
                </div>
                <div style={{ fontSize: 9, color: "#9ca3af", lineHeight: 1.5, marginBottom: 12 }}>Cardholders are responsible for retaining transaction records and complying with all local laws and regulatory requirements related to virtual currency transactions.</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 700 }}>SSL Encrypted &amp; Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Success Screen (auto-dismisses in 4s) */}
      {step === "success" && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)",
          display: "grid", placeItems: "center", zIndex: 3000, padding: "20px"
        }}>
          <div style={{
            background: "var(--card-bg, #fff)", borderRadius: "28px",
            padding: "48px 40px", maxWidth: "420px", width: "100%", textAlign: "center",
            boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 24px", fontSize: "36px", boxShadow: "0 8px 24px rgba(34,197,94,0.3)" }}>✓</div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>Transfer Successful!</h2>
            <p style={{ color: "var(--muted, #666)", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
              <strong>{txnData?.cryptoAmount} {txnData?.cryptoCurrency}</strong> has been credited to your wallet.
            </p>
            <div style={{ background: "#f0f0f0", borderRadius: "100px", height: "6px", marginBottom: "20px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: "100px", width: `${(successTimer / 4) * 100}%`, transition: "width 1s linear" }} />
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted, #999)", marginBottom: "24px" }}>Closing automatically in {successTimer}s...</p>
            <button onClick={handleReset} className="rl-btn rl-btn-primary" style={{ width: "100%", height: "48px", fontSize: "15px", fontWeight: 700 }}>Buy More Crypto</button>
          </div>
        </div>
      )}
    </div>
  );
}
