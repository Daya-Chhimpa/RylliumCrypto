"use client";
import { useMemo } from "react";

export default function VisualCreditCard({ cardNumber, holderName, expiry, cardType }) {
  const displayCardNumber = useMemo(() => {
    if (!cardNumber) return "#### #### #### ####";
    const clean = cardNumber.replace(/\D/g, "").slice(0, 16);
    let formatted = "";
    for (let i = 0; i < clean.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " ";
        formatted += clean[i];
    }
    while (formatted.length < 19) {
        if (formatted.length > 0 && formatted.replace(/ /g, "").length % 4 === 0 && formatted.slice(-1) !== " ") formatted += " ";
        formatted += "#";
    }
    return formatted;
  }, [cardNumber]);

  const displayExpiry = expiry || "MM/YY";
  const displayHolder = holderName || "YOUR NAME";

  return (
    <div style={{
        background: "linear-gradient(135deg, #00C6FF 0%, #0072FF 100%)",
        borderRadius: "16px",
        padding: "24px",
        color: "white",
        fontFamily: "'Courier New', monospace",
        boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
        marginBottom: "24px",
        maxWidth: "400px",
        margin: "0 auto 24px auto"
    }}>
      <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>{cardType || "VISA"}</div>
      <div style={{ fontSize: "22px", letterSpacing: "2px", textAlign: "center", marginBottom: "20px" }}>
        {displayCardNumber}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", textTransform: "uppercase" }}>
        <div>
            <div>Card Holder</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{displayHolder}</div>
        </div>
        <div>
            <div>Expires</div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{displayExpiry}</div>
        </div>
      </div>
    </div>
  );
}
