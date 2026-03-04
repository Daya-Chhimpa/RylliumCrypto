"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentHistory, cancelPayment, selectPaymentState } from "@/store/slices/paymentSlice";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { history, loading, error, cancellationLoading } = useSelector(selectPaymentState);
  const orders = Array.isArray(history) ? history : [];
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  return (
    <div className="rl-content animate-fade-in">
      <h1 className="rl-page-title">Your <span>orders</span></h1>

      <div className="tabbar" style={{ marginBottom: 32 }}>
        <button className="rl-btn tab active">Open orders</button>
        <button className="rl-btn tab secondary">Order history</button>
      </div>

      {loading && <div style={{ padding: 20, color: "var(--muted)" }}>Loading history...</div>}
      {error && <div style={{ padding: 20, color: "#ef4444" }}>Error: {error}</div>}

      {!loading && !error && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 12px" }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: "13px" }}>
                <th style={{ padding: "0 20px 8px" }}>Order ID</th>
                <th style={{ padding: "0 20px 8px" }}>Asset</th>
                <th style={{ padding: "0 20px 8px" }}>Status</th>
                <th style={{ padding: "0 20px 8px" }}>Date</th>
                <th style={{ padding: "0 20px 8px" }}>Amount</th>
                <th style={{ padding: "0 20px 8px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "60px", textAlign: "center", background: "var(--card-bg)", borderRadius: "20px", color: "var(--muted)", border: "1px solid var(--card-border)" }}>
                     No payment history found.
                  </td>
                </tr>
              ) : (
                orders.map((o, index) => (
                  <tr key={o.id || index} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "20px", borderRadius: "16px 0 0 16px", fontWeight: 700, fontSize: "14px", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)", borderLeft: "1px solid var(--card-border)" }}>
                      #{o.paymentId || o.id || "N/A"}
                    </td>
                    <td style={{ padding: "20px", fontSize: "14px", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary), var(--primary-2))", display: "grid", placeItems: "center", fontSize: "12px", fontWeight: 800, color: "#fff" }}>
                          {(o.currency || "B")[0].toUpperCase()}
                        </div>
                        {o.currency || "BTC"}
                      </div>
                    </td>
                    <td style={{ padding: "20px", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
                      <span style={{
                        padding: "6px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700",
                        background: (o.status || "").toLowerCase().includes("success") ? "rgba(34, 197, 94, 0.15)"
                          : (o.status || "").toLowerCase().includes("fail") ? "rgba(239, 68, 68, 0.15)" : "rgba(156, 163, 175, 0.15)",
                        color: (o.status || "").toLowerCase().includes("success") ? "#22c55e"
                          : (o.status || "").toLowerCase().includes("fail") ? "#ef4444" : "#9ca3af",
                        border: "1px solid currentColor"
                      }}>
                        {o.status || "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "20px", fontSize: "14px", color: "var(--muted)", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : (o.date || "N/A")}
                    </td>
                    <td style={{ padding: "20px", fontWeight: "800", fontSize: "15px", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)" }}>
                      {o.amount} {o.currency}
                    </td>
                    <td style={{ padding: "20px", borderRadius: "0 16px 16px 0", textAlign: "right", borderTop: "1px solid var(--card-border)", borderBottom: "1px solid var(--card-border)", borderRight: "1px solid var(--card-border)" }}>
                      {["pending", "success", "successful"].includes((o.status || "").toLowerCase()) && (
                        <button
                          onClick={() => setCancellingOrder(o)}
                          className="rl-btn rl-btn-secondary"
                          style={{
                            padding: "6px 18px", borderRadius: "100px", fontSize: "12px",
                            fontWeight: "700", cursor: "pointer", color: "#ef4444", 
                            border: "1px solid rgba(239,68,68,0.4)",
                            background: "rgba(239, 68, 68, 0.05)",
                            whiteSpace: "nowrap",
                            height: "36px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                          }}
                        >
                          Request Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingOrder && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          display: "grid", placeItems: "center", zIndex: 3000, padding: "20px"
        }}>
          <div className="animate-slide-up" style={{
            background: "#111118", border: "1px solid rgba(255,255,255,0.08)",
            padding: "40px 32px", borderRadius: "28px",
            width: "100%", maxWidth: "420px", textAlign: "center",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5)"
          }}>
            <div style={{ 
              width: "64px", height: "64px", background: "rgba(239, 68, 68, 0.1)", 
              color: "#ef4444", borderRadius: "50%", display: "grid", placeItems: "center", 
              margin: "0 auto 24px", fontSize: 28, border: "1px solid rgba(239, 68, 68, 0.2)" 
            }}>
              ✕
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>Cancel Order?</h2>
            <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: "1.6", marginBottom: "32px" }}>
              Are you sure you want to request cancellation for order <b style={{ color: "#fff" }}>#{cancellingOrder.paymentId || cancellingOrder.id}</b>? Admin will review your request.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <button
                onClick={() => setCancellingOrder(null)}
                className="rl-btn rl-btn-secondary"
                style={{ height: "52px", borderRadius: "14px", fontWeight: "700" }}
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  dispatch(cancelPayment(cancellingOrder.paymentId || cancellingOrder.id));
                  setCancellingOrder(null);
                }}
                disabled={cancellationLoading}
                className="rl-btn rl-btn-primary"
                style={{ height: "52px", borderRadius: "14px", fontWeight: "700", background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
              >
                {cancellationLoading ? "Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
