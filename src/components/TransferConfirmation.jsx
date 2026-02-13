"use client";

export default function TransferConfirmation({ cryptoAmount, cryptoCurrency, onConfirm, loading }) {
  return (
    <div className="rl-card confirmation-card" style={{ maxWidth: "500px", margin: "0 auto", padding: "2rem", textAlign: "center" }}>
      <h3 className="rl-page-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Confirmation</h3>
      <div className="success-banner" style={{ background: "rgba(0, 255, 0, 0.1)", color: "#00ff00", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
        <strong>Payment Successful</strong>
        <p style={{ margin: "0.5rem 0 0" }}>Your card payment is complete. Please confirm the transfer below.</p>
      </div>
      <div style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>
          <span>You Receive: </span>
          <strong style={{ color: "#fff" }}>{cryptoAmount} {cryptoCurrency}</strong>
      </div>
      <button className="rl-btn rl-btn-primary" onClick={onConfirm} disabled={loading} style={{ width: "100%" }}>
          {loading ? "Processing Transfer..." : "Confirm Transfer"}
      </button>
    </div>
  );
}
