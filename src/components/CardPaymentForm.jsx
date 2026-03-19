"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { preAuthorizePayment, capturePayment, selectPaymentState, resetPaymentState } from "@/store/slices/paymentSlice";
import { getWallets } from "@/lib/walletService";

// Simple icons using SVG (no react-icons dependency needed)
const VisaIcon = () => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
    <rect width="38" height="24" rx="4" fill="#1A1F71"/>
    <text x="6" y="17" fill="#fff" fontSize="12" fontWeight="bold" fontFamily="Arial">VISA</text>
  </svg>
);
const MCIcon = () => (
  <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
    <rect width="38" height="24" rx="4" fill="#EB001B" opacity="0.9"/>
    <circle cx="14" cy="12" r="8" fill="#EB001B"/>
    <circle cx="24" cy="12" r="8" fill="#F79E1B"/>
    <path d="M19 6.8a8 8 0 0 1 0 10.4A8 8 0 0 1 19 6.8z" fill="#FF5F00"/>
  </svg>
);
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const WalletIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
    <path d="M16 3H8L4 7h16l-4-4z"/><circle cx="17" cy="14" r="1" fill="#000"/>
  </svg>
);

export default function CardPaymentForm({ amount, currency, cryptoAmount, cryptoCurrency, network: initialNetwork, walletAddress: initialWallet, onSuccess }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, paymentId, paymentStatus } = useSelector(selectPaymentState);

  // ── Card Fields ──
  const [cardNumber, setCardNumber]     = useState("");
  const [holderName, setHolderName]     = useState("");
  const [expiry, setExpiry]             = useState("");
  const [cvv, setCvv]                   = useState("");
  const [cardType, setCardType]         = useState(null); // 'VISA' | 'MASTERCARD'

  // ── Shipping Fields ──
  const [shippingName, setShippingName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity]                 = useState("");
  const [state, setState]               = useState("");
  const [pincode, setPincode]           = useState("");
  const [country, setCountry]           = useState("PL");

  // ── Wallet Fields ──
  const [walletAddress, setWalletAddress] = useState(initialWallet || "");
  const [network, setNetwork]             = useState(initialNetwork || "ERC20");
  const [wallets, setWallets]             = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(false);

  const [formError, setFormError] = useState("");

  // Fetch saved wallets
  useEffect(() => {
    setLoadingWallets(true);
    getWallets()
      .then((data) => setWallets(data || []))
      .catch(() => {})
      .finally(() => setLoadingWallets(false));
  }, []);

  // ── Input Handlers ──
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    if (val.startsWith("4"))      setCardType("VISA");
    else if (val.startsWith("5")) setCardType("MASTERCARD");
    else                          setCardType(null);
    setCardNumber(val.replace(/(\d{4})/g, "$1 ").trim());
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
    setExpiry(val);
  };

  const handleWalletSelect = (e) => {
    const val = e.target.value;
    if (val === "custom") { setWalletAddress(""); return; }
    const w = wallets.find((w) => (w.walletAddress || w.address) === val);
    if (w) {
      setWalletAddress(w.walletAddress || w.address);
      setNetwork(w.network || w.chain || "ERC20");
    }
  };

  // ── Validation ──
  const validate = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) return "Enter a valid 16-digit card number.";
    if (!cardType) return "Only Visa and Mastercard are supported.";
    if (!holderName.trim()) return "Cardholder name is required.";
    if (!expiry || expiry.length !== 5) return "Enter a valid expiry date (MM/YY).";
    if (!cvv || cvv.length < 3) return "Enter a valid CVV.";
    if (!shippingName.trim() || !addressLine1.trim() || !city.trim() || !pincode.trim())
      return "Shipping details are incomplete.";
    if (!walletAddress.trim()) return "Wallet address is required.";
    return null;
  };

  // ── Submit → Pre-Authorize ──
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    const err = validate();
    if (err) { setFormError(err); return; }

    const [expMonth, expYearYY] = expiry.split("/");

    dispatch(preAuthorizePayment({
      amount,
      currency,
      paymentBrand: cardType,
      shipping_name: shippingName,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state,
      pincode: pincode.replace(/\D/g, ""),
      country,
      card: {
        number: cardNumber.replace(/\s/g, ""),
        holder: holderName,
        expiryMonth: expMonth,
        expiryYear: "20" + expYearYY,
        cvv,
      },
      walletAddress,
      network,
      cryptoAmount,
      cryptoCurrency,
    }));
  };

  // ── Capture ("Transfer Crypto Now") ──
  const handleCapture = () => {
    if (paymentId) {
      dispatch(capturePayment({ paymentId, captureData: { amount, currency } }));
    }
  };

  // After capture succeeds → notify parent (dashboard handles success screen)
  useEffect(() => {
    if (paymentStatus === "captured") {
      if (onSuccess) onSuccess();
      dispatch(resetPaymentState());
    }
  }, [paymentStatus]);

  // ── AUTHORIZED VIEW ──
  if (paymentStatus === "authorized") {
    return (
      <div style={{
        padding: "40px 32px", textAlign: "center",
        background: "var(--card-bg, #fff)", borderRadius: "20px",
        border: "1px solid var(--card-border, #eee)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "500px", margin: "0 auto"
      }}>
        <div style={{
          width: "64px", height: "64px", background: "#f6f6f8",
          borderRadius: "15px", display: "grid", placeItems: "center", margin: "0 auto 20px"
        }}>
          <WalletIcon />
        </div>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Payment Authorized</h3>
        <p style={{ color: "var(--muted, #666)", fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" }}>
          Your payment of <strong>{currency} {amount}</strong> has been authorized.
          Click below to transfer <strong>{cryptoAmount} {cryptoCurrency}</strong> to your wallet.
        </p>
        <div style={{
          background: "#f0fff4", border: "1px solid #9ae6b4",
          borderRadius: "12px", padding: "12px 16px",
          color: "#276749", fontSize: "13px", fontWeight: "600", marginBottom: "24px"
        }}>
          ✅ Wallet: {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
        </div>
        <button
          onClick={handleCapture}
          disabled={loading}
          style={{
            width: "100%", background: "#000", color: "#fff", fontWeight: "700",
            padding: "16px", borderRadius: "50px", border: "none", fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {loading ? "Transferring..." : "🚀 Transfer Crypto Now"}
        </button>
      </div>
    );
  }

  // ── MAIN FORM VIEW ──
  return (
    <div style={{ maxWidth: "560px", overflowX: "hidden" }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>

        {/* ── Card Information ── */}
        <div style={{ padding: "20px", border: "1px solid var(--card-border, #eee)", borderRadius: "14px", background: "var(--card-bg, #fff)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>Card Information</h3>
            <div style={{ display: "flex", gap: "8px", opacity: cardType === "VISA" || !cardType ? 1 : 0.25 }}>
              <VisaIcon />
            </div>
            <div style={{ display: "flex", gap: "8px", opacity: cardType === "MASTERCARD" || !cardType ? 1 : 0.25 }}>
              <MCIcon />
            </div>
          </div>

          <FieldGroup label="Card Number">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                style={inputStyle}
              />
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                <LockIcon />
              </span>
            </div>
          </FieldGroup>

          <FieldGroup label="Cardholder Name">
            <input
              type="text"
              placeholder="FULL NAME"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value.toUpperCase())}
              style={inputStyle}
            />
          </FieldGroup>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FieldGroup label="Expiry (MM/YY)">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                style={inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="CVV">
              <input
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                maxLength={3}
                style={inputStyle}
              />
            </FieldGroup>
          </div>
        </div>

        {/* ── Shipping Address ── */}
        <div style={{ padding: "20px", border: "1px solid var(--card-border, #eee)", borderRadius: "14px", background: "var(--card-bg, #fff)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "18px", marginTop: 0 }}>Billing Address</h3>

          <FieldGroup label="Full Name">
            <input
              type="text"
              placeholder="James Wilson"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Address Line 1">
            <input
              type="text"
              placeholder="10 Downing Street"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Address Line 2 (optional)">
            <input
              type="text"
              placeholder="Apt, suite, etc."
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              style={inputStyle}
            />
          </FieldGroup>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FieldGroup label="City">
              <input
                type="text"
                placeholder="London"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
              />
            </FieldGroup>
            <FieldGroup label="Zipcode">
              <input
                type="text"
                placeholder="999077"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                style={inputStyle}
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Country">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="PL">Poland</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="US">United States</option>
              <option value="IN">India</option>
              <option value="AE">UAE</option>
              <option value="OTHER">Other</option>
            </select>
          </FieldGroup>
        </div>

        {/* ── Wallet Address ── */}
        <div style={{ padding: "16px", background: "var(--bg-soft, #f8f9fa)", borderRadius: "12px", border: "1px solid var(--card-border, #eee)" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "12px", marginTop: 0 }}>
            🔗 Destination Wallet
          </h3>

          {loadingWallets ? (
            <p style={{ fontSize: "13px", color: "var(--muted, #666)" }}>Loading saved wallets...</p>
          ) : (
            <>
              {wallets.length > 0 && (
                <FieldGroup label="Select Your External Wallet">
                  <select
                    onChange={handleWalletSelect}
                    value={wallets.some((w) => (w.walletAddress || w.address) === walletAddress) ? walletAddress : "custom"}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="custom">-- Enter New Address --</option>
                    {wallets.map((w, i) => (
                      <option key={i} value={w.walletAddress || w.address}>
                        {w.network || w.chain}: {(w.walletAddress || w.address).slice(0, 8)}...{(w.walletAddress || w.address).slice(-6)}
                      </option>
                    ))}
                  </select>
                </FieldGroup>
              )}
            </>
          )}

          {(!wallets.some((w) => (w.walletAddress || w.address) === walletAddress)) && (
            <FieldGroup 
              label="Wallet Address"
              extra={wallets.length === 0 && (
                <span 
                  onClick={() => router.push('/wallets')}
                  style={{ 
                    fontSize: '10px', color: '#8b5cf6', cursor: 'pointer', 
                    fontWeight: '700', textDecoration: 'underline', 
                    textTransform: 'none', letterSpacing: '0'
                  }}
                >
                  Click to add external wallet
                </span>
              )}
            >
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Paste destination wallet address"
                style={{ ...inputStyle, fontSize: "12px", fontFamily: "monospace" }}
              />
            </FieldGroup>
          )}


          {walletAddress && wallets.some((w) => (w.walletAddress || w.address) === walletAddress) && (
            <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted, #666)", wordBreak: "break-all" }}>
              Address: <span style={{ color: "var(--text, #000)", fontWeight: 600 }}>{walletAddress}</span>
            </div>
          )}

          {/* Network is set from dashboard selection — not editable here */}
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted, #888)" }}>
            Network: <strong style={{ color: "var(--text, #000)" }}>{network}</strong>
          </div>
        </div>

        {/* ── Error ── */}
        {(formError || error) && (
          <div style={{
            color: "#e53e3e", background: "#fff5f5",
            padding: "12px 16px", borderRadius: "10px",
            fontSize: "14px", border: "1px solid #fed7d7", fontWeight: "500"
          }}>
            ⚠️ {formError || (typeof error === "string" ? error : JSON.stringify(error))}
          </div>
        )}

        {/* ── Submit Button ── */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg,#8b5cf6,#7c3aed)",
            color: "#fff", fontWeight: "700",
            padding: "16px", borderRadius: "50px", border: "none", fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s",
            boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.4)",
          }}
        >
          {loading ? "Processing..." : `Pay ${currency} ${amount}`}
        </button>
      </form>
    </div>
  );
}

// Helper Components
function FieldGroup({ label, children, style = {}, extra }) {
  return (
    <div style={{ marginBottom: "14px", ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "6px" }}>
        <label style={{
          fontSize: "10px", fontWeight: "700",
          color: "var(--muted, #888)",
          textTransform: "uppercase", letterSpacing: "0.5px"
        }}>
          {label}
        </label>
        {extra}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid var(--card-border, #e0e0e0)",
  fontSize: "14px",
  background: "var(--bg-soft, #f9f9f9)",
  color: "var(--text, #000)",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};
