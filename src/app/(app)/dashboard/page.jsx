"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ExchangeForm from "@/components/ExchangeForm";
import CardPaymentForm from "@/components/CardPaymentForm";
import TransferConfirmation from "@/components/TransferConfirmation";
import { selectPaymentState, initiateTransfer, resetPaymentState } from "@/store/slices/paymentSlice";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { paymentStatus, transferStatus, error } = useSelector(selectPaymentState);

  const [step, setStep] = useState("exchange"); // "exchange" | "payment" | "confirmation" | "success"
  const [txnData, setTxnData] = useState(null);

  // Reset payment state on mount
  useEffect(() => {
    dispatch(resetPaymentState());
  }, [dispatch]);

  // Handle flow transitions based on Redux state
  useEffect(() => {
    if (paymentStatus === "captured" && step === "payment") {
      setStep("confirmation");
    }
    if (transferStatus === "success" && step === "confirmation") {
      setStep("success");
    }
  }, [paymentStatus, transferStatus, step]);

  const handleBuy = (data) => {
    setTxnData(data);
    setStep("payment");
  };

  const handleTransfer = () => {
     if (txnData) {
        dispatch(initiateTransfer({ amount: txnData.cryptoAmount, currency: txnData.cryptoCurrency }));
     }
  };

  const handleSuccessClose = () => {
      dispatch(resetPaymentState());
      setStep("exchange");
      setTxnData(null);
  };

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Buy <span>Crypto</span></h1>
      <div id="exchange" style={{ height: 24 }} />

      {step === "exchange" && (
        <ExchangeForm onBuy={handleBuy} />
      )}

      {step === "payment" && txnData && (
        <div className="animate-slide-up">
          <button 
             onClick={() => setStep("exchange")} 
             className="rl-btn rl-btn-secondary" 
             style={{ marginBottom: "1rem" }}
          >
            ← Back
          </button>
          <CardPaymentForm 
            amount={txnData.fiatAmount}
            currency={txnData.fiatCurrency}
            cryptoAmount={txnData.cryptoAmount}
            cryptoCurrency={txnData.cryptoCurrency}
          />
        </div>
      )}

      {step === "confirmation" && txnData && (
        <div className="animate-fade-in">
             <TransferConfirmation 
               cryptoAmount={txnData.cryptoAmount}
               cryptoCurrency={txnData.cryptoCurrency}
               onConfirm={handleTransfer}
               loading={transferStatus === "loading"}
             />
        </div>
      )}

      {step === "success" && (
          <div className="rl-card" style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
              <h2>Transaction Successful!</h2>
              <p>Your wallet has been credited with {txnData?.cryptoAmount} {txnData?.cryptoCurrency}.</p>
              <button 
                className="rl-btn rl-btn-primary" 
                style={{ marginTop: "2rem" }}
                onClick={handleSuccessClose}
              >
                Buy More
              </button>
          </div>
      )}
    </div>
  );
}


