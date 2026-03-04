"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, sendLoginOtpThunk, verifyTwoFaThunk, clearTwoFa } from "@/store/slices/authSlice";

// ── Hero panel ──
function AuthHero() {
  const [card, setCard] = useState({ number:"", name:"", expiry:"", cvv:"" });
  const [ship, setShip] = useState({ fname:"", addr:"", city:"", zip:"" });
  const [success, setSuccess] = useState(false);

  const cardDone = card.number.replace(/\s/g,"").length===16 && card.name.trim() && card.expiry.length===5 && card.cvv.length===3;
  const shipDone = ship.fname.trim() && ship.addr.trim() && ship.city.trim() && ship.zip.trim();

  function handleCard(e) {
    let val = e.target.value;
    if (e.target.name==="number") val = val.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
    if (e.target.name==="expiry") { val=val.replace(/\D/g,"").slice(0,4); if(val.length>2) val=val.slice(0,2)+"/"+val.slice(2); }
    if (e.target.name==="cvv") val=val.replace(/\D/g,"").slice(0,3);
    setCard({...card, [e.target.name]: val});
  }

  function handleShip(e) {
    const v = {...ship, [e.target.name]: e.target.value};
    setShip(v);
    if (cardDone && v.fname.trim() && v.addr.trim() && v.city.trim() && v.zip.trim()) {
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setCard({ number:"", name:"", expiry:"", cvv:"" });
          setShip({ fname:"", addr:"", city:"", zip:"" });
        }, 2800);
      }, 400);
    }
  }

  const inp = (disabled) => ({
    width:"100%", height:40, borderRadius:8,
    background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.06)",
    border: disabled ? "1.5px solid rgba(255,255,255,0.05)" : "1.5px solid rgba(139,92,246,0.22)",
    padding:"0 12px", color: disabled ? "#2d2d4a" : "#fff",
    fontSize:13, outline:"none", fontFamily:"inherit", transition:"all 0.2s",
    cursor: disabled ? "not-allowed" : "text",
    boxSizing:"border-box",
  });

  const lbl = (disabled) => ({
    fontSize:10, letterSpacing:"0.06em", textTransform:"uppercase",
    color: disabled ? "#2d2d4a" : "#6b7280",
    marginBottom:5, display:"block", fontWeight:600,
  });

  return (
    <div style={{
      height:"100%", minHeight:"100vh",
      background:"linear-gradient(135deg,rgba(139,92,246,0.08) 0%,#0a0a1a 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px 20px",
    }}>
      <style>{`
        .co2:focus { border-color:#8b5cf6 !important; box-shadow:0 0 0 3px rgba(139,92,246,0.18) !important; }
        .co2::placeholder { color:#2d2d4a; }
        @keyframes successPop { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .co-anim { animation: fadeSlide 0.3s ease both; }
      `}</style>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 200px", gap:16, width:"100%", maxWidth:680, alignItems:"start" }}>

        {/* ── LEFT: Checkout Form ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:3 }}>Checkout</div>
            <div style={{ fontSize:12, color:"#4b5563" }}>Secure pre-authorization for your crypto purchase.</div>
          </div>

          {/* SUCCESS */}
          {success && (
            <div className="co-anim" style={{
              background:"rgba(20,20,42,0.95)", border:"1px solid rgba(34,197,94,0.3)",
              borderRadius:14, padding:"32px 20px", textAlign:"center",
            }}>
              <div style={{
                width:56, height:56, borderRadius:"50%", margin:"0 auto 14px",
                background:"linear-gradient(135deg,#22c55e,#16a34a)",
                display:"grid", placeItems:"center",
                boxShadow:"0 0 28px rgba(34,197,94,0.4)",
                animation:"successPop 0.5s ease both",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:"#fff", marginBottom:5 }}>Payment Submitted!</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>Your transaction is being processed securely.</div>
            </div>
          )}

          {!success && (<>
            {/* Card Information */}
            <div style={{
              background:"rgba(20,20,42,0.9)", border:"1px solid rgba(139,92,246,0.22)",
              borderRadius:14, padding:"16px 18px",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>Card Information</span>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <svg width="30" height="20" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1e3a8a"/><text x="6" y="17" fill="#fff" fontSize="12" fontWeight="900" fontFamily="Arial">VISA</text></svg>
                  <svg width="30" height="20" viewBox="0 0 38 24"><rect width="38" height="24" rx="3" fill="#1a1a2e"/><circle cx="15" cy="12" r="8" fill="#eb001b" opacity="0.85"/><circle cx="23" cy="12" r="8" fill="#f79e1b" opacity="0.85"/><circle cx="19" cy="12" r="4.5" fill="#ff5f00" opacity="0.75"/></svg>
                </div>
              </div>
              <div style={{ display:"grid", gap:10 }}>
                <div>
                  <label style={lbl(false)}>Card Number</label>
                  <input className="co2" style={inp(false)} name="number" value={card.number} onChange={handleCard} placeholder="0000 0000 0000 0000" maxLength={19}/>
                </div>
                <div>
                  <label style={lbl(false)}>Cardholder Name</label>
                  <input className="co2" style={inp(false)} name="name" value={card.name} onChange={handleCard} placeholder="FULL NAME"/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <label style={lbl(false)}>Expiry (MM/YY)</label>
                    <input className="co2" style={inp(false)} name="expiry" value={card.expiry} onChange={handleCard} placeholder="MM/YY" maxLength={5}/>
                  </div>
                  <div>
                    <label style={lbl(false)}>CVV</label>
                    <input className="co2" style={{...inp(false), letterSpacing:card.cvv?4:0}} name="cvv" value={card.cvv} onChange={handleCard} placeholder="···" maxLength={3}/>
                  </div>
                </div>
                {cardDone && <div style={{ fontSize:11, color:"#22c55e", textAlign:"center", fontWeight:600 }}>✓ Card verified — fill shipping to continue</div>}
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{
              background: cardDone ? "rgba(20,20,42,0.9)" : "rgba(15,15,30,0.55)",
              border: `1px solid ${cardDone ? "rgba(139,92,246,0.22)" : "rgba(139,92,246,0.07)"}`,
              borderRadius:14, padding:"16px 18px",
              opacity: cardDone ? 1 : 0.5,
              transition:"all 0.3s",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <span style={{ fontSize:14, fontWeight:700, color: cardDone?"#fff":"#374151" }}>Shipping Address</span>
                {!cardDone && <span style={{ fontSize:10, color:"#374151", background:"rgba(139,92,246,0.08)", padding:"2px 8px", borderRadius:20, fontWeight:600 }}>Complete card info first</span>}
              </div>
              <div style={{ display:"grid", gap:10 }}>
                <div>
                  <label style={lbl(!cardDone)}>Full Name</label>
                  <input className={cardDone?"co2":""} style={inp(!cardDone)} name="fname" value={ship.fname} onChange={handleShip} placeholder="James Wilson" disabled={!cardDone}/>
                </div>
                <div>
                  <label style={lbl(!cardDone)}>Address Line 1</label>
                  <input className={cardDone?"co2":""} style={inp(!cardDone)} name="addr" value={ship.addr} onChange={handleShip} placeholder="10 Downing Street" disabled={!cardDone}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <label style={lbl(!cardDone)}>City</label>
                    <input className={cardDone?"co2":""} style={inp(!cardDone)} name="city" value={ship.city} onChange={handleShip} placeholder="London" disabled={!cardDone}/>
                  </div>
                  <div>
                    <label style={lbl(!cardDone)}>Postal Code</label>
                    <input className={cardDone?"co2":""} style={inp(!cardDone)} name="zip" value={ship.zip} onChange={handleShip} placeholder="SW1A 1AA" disabled={!cardDone}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div style={{
              height:44, borderRadius:12, display:"grid", placeItems:"center",
              background: cardDone && shipDone ? "linear-gradient(135deg,#8b5cf6,#7c3aed)" : "#0f0f1e",
              color: cardDone && shipDone ? "#fff" : "#2d2d4a",
              fontWeight:700, fontSize:14,
              border: `1px solid ${cardDone && shipDone ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.04)"}`,
              cursor: cardDone && shipDone ? "pointer" : "default",
              transition:"all 0.3s",
              boxShadow: cardDone && shipDone ? "0 4px 20px rgba(139,92,246,0.35)" : "none",
            }}>
              Pay EUR 1
            </div>
          </>)}
        </div>

        {/* ── RIGHT: Order Summary + Payment Badges ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Order Summary — dark card */}
          <div style={{
            background:"#111118",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:20, padding:"20px 18px",
            boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
          }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#fff", marginBottom:18 }}>Order Summary</div>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{
                width:40, height:40, borderRadius:12, flexShrink:0,
                background:"linear-gradient(135deg,#f59332,#e07000)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:900, fontSize:18, color:"#fff",
                boxShadow:"0 4px 12px rgba(245,147,50,0.4)",
              }}>B</div>
              <div>
                <div style={{ fontSize:11, color:"#6b7280", marginBottom:3 }}>Receiving</div>
                <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>0.00001703 BTC</div>
              </div>
            </div>

            <div style={{ display:"grid", gap:12, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#6b7280" }}>Exchange Rate</span>
                <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>1 BTC ≈ EUR 65,000</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#6b7280" }}>Network</span>
                <span style={{ fontSize:12, color:"#9ca3af", fontWeight:600 }}>BTC</span>
              </div>
            </div>

            <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:12, color:"#6b7280" }}>Total Due</span>
              <span style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:-1 }}>EUR 1</span>
            </div>
          </div>

          {/* Payment Badges — white card */}
          <div style={{
            background:"#ffffff",
            borderRadius:16, padding:"16px 14px",
            boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
          }}>
            {/* Logos row */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-around", marginBottom:14 }}>

              {/* Mastercard */}
              <svg width="40" height="28" viewBox="0 0 40 28" fill="none">
                <circle cx="15" cy="14" r="11" fill="#EB001B"/>
                <circle cx="25" cy="14" r="11" fill="#F79E1B"/>
                <path d="M20 6.5a11 11 0 0 1 0 15A11 11 0 0 1 20 6.5z" fill="#FF5F00"/>
              </svg>

              {/* VISA */}
              <span style={{ fontWeight:900, fontSize:17, color:"#1434CB", fontStyle:"italic", letterSpacing:-0.5 }}>VISA</span>

              {/* Google Pay */}
              <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ fontWeight:600, fontSize:12, color:"#202124" }}>Pay</span>
              </div>

              {/* Apple Pay */}
              <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                <svg width="13" height="16" viewBox="0 0 14 17" fill="#000000">
                  <path d="M11.76 8.9c-.02-1.96 1.6-2.9 1.67-2.95-.91-1.33-2.33-1.51-2.84-1.53-1.2-.12-2.36.71-2.97.71-.62 0-1.56-.7-2.57-.68-1.31.02-2.53.77-3.2 1.94-1.38 2.38-.35 5.89.97 7.82.66.94 1.43 1.99 2.45 1.95.99-.04 1.36-.63 2.56-.63 1.19 0 1.53.63 2.57.61 1.06-.02 1.72-.95 2.37-1.9.75-1.08 1.06-2.14 1.07-2.19-.02-.01-2.06-.79-2.08-3.15zM9.8 2.9c.54-.66.92-1.58.82-2.52-.82.04-1.8.56-2.35 1.21-.5.58-.94 1.52-.82 2.42.91.07 1.85-.46 2.35-1.11z"/>
                </svg>
                <span style={{ fontWeight:600, fontSize:12, color:"#000000" }}>Pay</span>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ fontSize:9, color:"#9ca3af", lineHeight:1.5, marginBottom:12 }}>
              Cardholders are responsible for retaining transaction records and complying with all local laws and regulatory requirements related to virtual currency transactions.
            </div>

            {/* SSL */}
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize:11, color:"#22c55e", fontWeight:700 }}>SSL Encrypted &amp; Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Back button ──
function BackBtn({ label = "Back", onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: 0, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6,
      color: "#9ca3af", fontWeight: 600, fontSize: 13,
      padding: "6px 10px 6px 4px", borderRadius: 8,
      transition: "color 0.2s",
      marginBottom: 20,
    }}
      onMouseEnter={e => e.currentTarget.style.color = "#c4b5fd"}
      onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      {label}
    </button>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { status, error, requiresTwoFa, twoFaMethods } = useSelector((s) => s.auth);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPwd, setShowPwd] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);
  const cooldownRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("authToken");
      const hasAuthCookie = document.cookie.split("; ").some((c) => c.startsWith("auth=1"));
      if (token && hasAuthCookie && !requiresTwoFa) {
        const next = searchParams.get("next");
        router.replace(next || "/dashboard");
      }
    }
  }, [router, searchParams, requiresTwoFa]);

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await dispatch(loginThunk({ email: form.get("email"), password: form.get("password") }));
    if (res.meta.requestStatus === "fulfilled" && res.payload?.token) {
      router.push(searchParams.get("next") || "/dashboard");
    }
  }

  async function handleSelectMethod(method) {
    setSelectedMethod(method);
    if (method === "email") {
      await dispatch(sendLoginOtpThunk());
      startResendCooldown();
    }
  }

  function startResendCooldown() {
    setResendCooldown(60);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const handleOtpChange = (i, val) => {
    if (val.length > 1) val = val[val.length - 1];
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    [...pasted].forEach((ch, i) => { if (i < 6) newOtp[i] = ch; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  async function handleVerify(e) {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return;
    const res = await dispatch(verifyTwoFaThunk({ code, method: selectedMethod }));
    if (res.meta.requestStatus === "fulfilled") {
      router.push(searchParams.get("next") || "/dashboard");
    }
  }

  useEffect(() => {
    if (otp.join("").length === 6 && selectedMethod) handleVerify();
  }, [otp]);

  function handleBack() {
    dispatch(clearTwoFa());
    setSelectedMethod("");
    setOtp(["", "", "", "", "", ""]);
  }

  const sideStyle = {
    background: "#141428",
    padding: "40px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRight: "1px solid #1f1f35",
    height: "100vh",
    overflow: "hidden",
  };

  const wrapStyle = {
    height: "100vh",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "480px 1fr",
    background: "#0a0a1a",
  };

  // ── OTP Step ──
  if (selectedMethod) {
    const isEmail = selectedMethod === "email";
    return (
      <>
        <link rel="stylesheet" href="/custom-style.css" />
        <style>{`
          @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes spin { to { transform: rotate(360deg); } }
          .auth-side-inner { animation: fadeSlideIn 0.35s ease both; }
          .otp-field-pro { width:48px; height:56px; border-radius:12px; border:2px solid #2a2a40; background:#1a1a2e; color:#fff; font-size:22px; font-weight:700; text-align:center; transition:border-color 0.2s,box-shadow 0.2s,transform 0.15s; outline:none; font-family:inherit; }
          .otp-field-pro:focus { border-color:#8b5cf6; box-shadow:0 0 0 3px rgba(139,92,246,0.2); transform:scale(1.06); }
          .otp-field-pro:not(:placeholder-shown) { border-color:rgba(139,92,246,0.5); color:#a78bfa; }
          .auth-btn-pro { height:48px; border-radius:12px; border:0; font-weight:700; font-size:15px; background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; cursor:pointer; box-shadow:0 4px 16px rgba(139,92,246,0.4); transition:opacity 0.2s,transform 0.2s; font-family:inherit; }
          .auth-btn-pro:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
          .auth-btn-pro:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
          .auth-input-pro { height:48px; border:2px solid #1f1f35; background:#1a1a2e; border-radius:12px; padding:0 44px 0 14px; width:100%; color:#fff; font-size:15px; outline:none; font-family:inherit; transition:border-color 0.2s,box-shadow 0.2s; }
          .auth-input-pro::placeholder { color:#4b5563; }
          .auth-input-pro:focus { border-color:#8b5cf6; box-shadow:0 0 0 3px rgba(139,92,246,0.15); }
          .resend-btn { background:none; border:0; cursor:pointer; color:#8b5cf6; font-weight:700; font-size:14px; padding:0; font-family:inherit; transition:color 0.2s; }
          .resend-btn:hover:not(:disabled) { color:#a78bfa; }
          .resend-btn:disabled { color:#4b5563; cursor:not-allowed; }
          .error-banner { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:10px; padding:10px 14px; margin-top:12px; color:#f87171; font-size:13px; display:flex; align-items:center; gap:8px; }
          @media (max-width:900px) { .auth-layout { grid-template-columns:1fr !important; } .auth-hero-panel { display:none !important; } .auth-left-panel { padding:32px 24px !important; } }
        `}</style>
        <div className="auth-layout" style={wrapStyle}>
          <div className="auth-left-panel" style={sideStyle}>
            <div className="auth-side-inner">
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"grid", placeItems:"center", fontWeight:800, fontSize:18, color:"#fff", boxShadow:"0 4px 12px rgba(139,92,246,0.4)" }}>S</span>
                <span style={{ fontSize:18, fontWeight:700 }}>Satorem</span>
              </div>
              <BackBtn label="Back to method" onClick={() => setSelectedMethod("")} />
              <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.2))", border:"1px solid rgba(139,92,246,0.3)", display:"grid", placeItems:"center", marginBottom:20 }}>
                {isEmail
                  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                }
              </div>
              <div style={{ fontSize:26, fontWeight:800, color:"#fff", marginBottom:8 }}>Verify it&apos;s you</div>
              <p style={{ color:"#9ca3af", fontSize:14, marginBottom:28, lineHeight:1.6 }}>
                {isEmail ? "We've sent a 6-digit verification code to your registered email address." : "Open your authenticator app and enter the 6-digit code shown for Satorem."}
              </p>
              <form onSubmit={handleVerify}>
                <div style={{ display:"flex", gap:10, marginBottom:24, justifyContent:"center" }}>
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => (otpRefs.current[i] = el)} type="text" inputMode="numeric" className="otp-field-pro" value={digit} placeholder="·" onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} onPaste={i===0 ? handleOtpPaste : undefined} maxLength={1} autoFocus={i===0}/>
                  ))}
                </div>
                <button className="auth-btn-pro" type="submit" style={{ width:"100%" }} disabled={status==="loading" || otp.join("").length!==6}>
                  {status==="loading" ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation:"spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Verifying...</span> : "Verify & Continue →"}
                </button>
              </form>
              {isEmail && (
                <p style={{ marginTop:20, textAlign:"center", fontSize:14, color:"#6b7280" }}>
                  Didn&apos;t receive a code?{" "}
                  <button className="resend-btn" disabled={resendCooldown>0} onClick={() => { dispatch(sendLoginOtpThunk()); startResendCooldown(); }}>
                    {resendCooldown>0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </button>
                </p>
              )}
              {error && <div className="error-banner"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{error}</div>}
            </div>
          </div>
          <div className="auth-hero-panel"><AuthHero /></div>
        </div>
      </>
    );
  }

  // ── 2FA Method Select ──
  if (requiresTwoFa) {
    return (
      <>
        <link rel="stylesheet" href="/custom-style.css" />
        <style>{`
          @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .auth-side-inner { animation: fadeSlideIn 0.35s ease both; }
          .method-card { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:12px; border:2px solid #1f1f35; background:#1a1a2e; cursor:pointer; transition:border-color 0.2s,background 0.2s,transform 0.2s,box-shadow 0.2s; margin-bottom:10px; }
          .method-card:hover { border-color:#8b5cf6; background:rgba(139,92,246,0.05); transform:translateY(-2px); box-shadow:0 8px 24px rgba(139,92,246,0.15); }
          @media (max-width:900px) { .auth-layout { grid-template-columns:1fr !important; } .auth-hero-panel { display:none !important; } .auth-left-panel { padding:32px 24px !important; } }
        `}</style>
        <div className="auth-layout" style={wrapStyle}>
          <div className="auth-left-panel" style={sideStyle}>
            <div className="auth-side-inner">
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"grid", placeItems:"center", fontWeight:800, fontSize:16, color:"#fff", boxShadow:"0 4px 12px rgba(139,92,246,0.4)" }}>S</span>
                <span style={{ fontSize:17, fontWeight:700 }}>Satorem</span>
              </div>
              <BackBtn label="Back to Sign in" onClick={handleBack} />
              <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.2))", border:"1px solid rgba(139,92,246,0.3)", display:"grid", placeItems:"center", marginBottom:14 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginBottom:6 }}>Two-factor auth</div>
              <p style={{ color:"#9ca3af", fontSize:14, marginBottom:20, lineHeight:1.5 }}>Choose a verification method to secure your account access.</p>
              <div>
                {twoFaMethods.includes("totp") && (
                  <div className="method-card" onClick={() => handleSelectMethod("totp")}>
                    <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.2))", border:"1px solid rgba(139,92,246,0.25)", display:"grid", placeItems:"center", flexShrink:0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:2 }}>Authenticator App</div>
                      <div style={{ fontSize:12, color:"#6b7280" }}>Use Google Authenticator or similar app</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                )}
                {twoFaMethods.includes("email") && (
                  <div className="method-card" onClick={() => handleSelectMethod("email")}>
                    <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(124,58,237,0.2))", border:"1px solid rgba(139,92,246,0.25)", display:"grid", placeItems:"center", flexShrink:0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:2 }}>Email Code</div>
                      <div style={{ fontSize:12, color:"#6b7280" }}>Send a 6-digit code to your registered email</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="auth-hero-panel"><AuthHero /></div>
        </div>
      </>
    );
  }

  // ── Login Form ──
  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-side-inner { animation: fadeSlideIn 0.35s ease both; }
        .auth-input-pro { height:48px; border:2px solid #1f1f35; background:#1a1a2e; border-radius:12px; padding:0 44px 0 14px; width:100%; color:#fff; font-size:15px; outline:none; font-family:inherit; transition:border-color 0.2s,box-shadow 0.2s; }
        .auth-input-pro::placeholder { color:#4b5563; }
        .auth-input-pro:focus { border-color:#8b5cf6; box-shadow:0 0 0 3px rgba(139,92,246,0.15); }
        .auth-btn-pro { height:48px; border-radius:12px; border:0; font-weight:700; font-size:15px; background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; cursor:pointer; width:100%; box-shadow:0 4px 16px rgba(139,92,246,0.4); transition:opacity 0.2s,transform 0.2s; font-family:inherit; }
        .auth-btn-pro:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
        .auth-btn-pro:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
        .error-banner { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:10px; padding:10px 14px; margin-top:12px; color:#f87171; font-size:13px; display:flex; align-items:center; gap:8px; }
        @media (max-width:900px) { .auth-layout { grid-template-columns:1fr !important; } .auth-hero-panel { display:none !important; } .auth-left-panel { padding:32px 24px !important; } }
      `}</style>
      <div className="auth-layout" style={wrapStyle}>
        <div className="auth-left-panel" style={sideStyle}>
          <div className="auth-side-inner">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"grid", placeItems:"center", fontWeight:800, fontSize:18, color:"#fff", boxShadow:"0 4px 12px rgba(139,92,246,0.4)" }}>S</span>
              <span style={{ fontSize:18, fontWeight:700 }}>Satorem</span>
            </div>
            <div style={{ fontSize:28, fontWeight:800, color:"#fff", marginBottom:6 }}>Welcome back</div>
            <p style={{ color:"#9ca3af", fontSize:14, marginBottom:28, lineHeight:1.6 }}>Sign in to your Satorem account to continue trading.</p>
            <form style={{ display:"grid", gap:14 }} onSubmit={handleSubmit}>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input name="email" type="email" placeholder="Email address" required className="auth-input-pro" style={{ paddingLeft:40 }}/>
              </div>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input name="password" type={showPwd?"text":"password"} placeholder="Password" required className="auth-input-pro" style={{ paddingLeft:40 }}/>
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:0, cursor:"pointer", color:"#4b5563", padding:0 }}>
                  {showPwd
                    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div style={{ textAlign:"right", marginTop:-4 }}>
                <Link href="/forgot-password" style={{ fontSize:13, color:"#8b5cf6", fontWeight:500 }}>Forgot password?</Link>
              </div>
              <button className="auth-btn-pro" type="submit" disabled={status==="loading"}>
                {status==="loading"
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation:"spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Signing in...</span>
                  : "Continue →"
                }
              </button>
            </form>
            {error && <div className="error-banner"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{error}</div>}
            <p style={{ marginTop:24, textAlign:"center", fontSize:14, color:"#6b7280" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color:"#8b5cf6", fontWeight:700 }}>Create account</Link>
            </p>
          </div>
        </div>
        <div className="auth-hero-panel"><AuthHero /></div>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0a1a" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"grid", placeItems:"center", margin:"0 auto 16px", fontWeight:800, fontSize:20, color:"#fff" }}>S</div>
          <p style={{ color:"#6b7280", fontSize:14 }}>Loading...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
