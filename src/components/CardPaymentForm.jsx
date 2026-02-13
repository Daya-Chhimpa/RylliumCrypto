"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { preAuthorizePayment, capturePayment, selectPaymentState } from "@/store/slices/paymentSlice";
import VisualCreditCard from "./VisualCreditCard";

export default function CardPaymentForm(props) {
  const dispatch = useDispatch();
  const { loading, error, paymentId, paymentStatus } = useSelector(selectPaymentState);
  
  const [cardNumber, setCardNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("VISA"); 

  // Format Card Number
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(val);
    
    // Simple card type detection
    if (val.startsWith("4")) setCardType("VISA");
    else if (val.startsWith("5")) setCardType("MASTERCARD");
    else setCardType("VISA");
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
        val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    setExpiry(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !holderName || !expiry || !cvv) return;

    const cleanNumber = cardNumber;
    const parts = expiry.split("/");
    if (parts.length !== 2) return;
    const [expMonth, expYear] = parts;
    
    const payload = {
        amount: props.amount, 
        currency: props.currency,
        paymentBrand: cardType,
        cryptoAmount: props.cryptoAmount,
        cryptoCurrency: props.cryptoCurrency,
        card: { 
            number: cleanNumber, 
            holder: holderName, 
            expiryMonth: expMonth, 
            expiryYear: "20" + expYear, 
            cvv 
        }
    };
    dispatch(preAuthorizePayment(payload));
  };

  // Auto-Capture Effect
  useEffect(() => {
    if (paymentStatus === "authorized" && paymentId) {
        dispatch(capturePayment({ paymentId, captureData: { amount: props.amount, currency: props.currency } }));
    } else if (paymentStatus === "captured") {
        if (props.onSuccess) props.onSuccess(); 
    }
  }, [paymentStatus, paymentId, dispatch, props]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <VisualCreditCard cardNumber={cardNumber} holderName={holderName} expiry={expiry} cardType={cardType} />
      
      <form onSubmit={handleSubmit} className="rl-form" style={{ marginTop: "2rem" }}>
        <div className="rl-form-group">
            <label className="rl-label" style={{ display: "block", marginBottom: "0.5rem" }}>Card Number</label>
            <div className="rl-form-control">
                <input 
                    type="text" 
                    className="rl-input" 
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={16}
                />
            </div>
        </div>

        <div className="rl-form-group">
            <label className="rl-label" style={{ display: "block", marginBottom: "0.5rem" }}>Card Holder</label>
            <div className="rl-form-control">
                <input 
                    type="text" 
                    className="rl-input" 
                    placeholder="YOUR NAME"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                />
            </div>
        </div>

        <div className="rl-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="rl-form-group">
                <label className="rl-label" style={{ display: "block", marginBottom: "0.5rem" }}>Expiry (MM/YY)</label>
                <div className="rl-form-control">
                    <input 
                        type="text" 
                        className="rl-input" 
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                    />
                </div>
            </div>
            <div className="rl-form-group">
                <label className="rl-label" style={{ display: "block", marginBottom: "0.5rem" }}>CVV</label>
                <div className="rl-form-control">
                    <input 
                        type="password" 
                        className="rl-input" 
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                    />
                </div>
            </div>
        </div>

        <div style={{ marginTop: "2rem" }}>
            <button type="submit" className="rl-btn rl-btn-primary" style={{ width: "100%", height: "48px", fontSize: "16px" }} disabled={loading}>
            {loading ? "Processing..." : `Pay ${props.amount} ${props.currency}`}
            </button>
        </div>
        
        {error && <div style={{ color: "#ef4444", marginTop: "1rem", textAlign: "center", background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>{typeof error === "string" ? error : JSON.stringify(error)}</div>}
      </form>
    </div>
  );
}
