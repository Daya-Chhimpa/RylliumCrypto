"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, sendLoginOtpThunk, verifyTwoFaThunk, clearTwoFa } from "@/store/slices/authSlice";

// ── Hero panel ──
function AuthHero() {
  return (
    <div style={{
      height:"100%", width:"100%",
      background:"linear-gradient(135deg,rgba(139,92,246,0.1) 0%,#0a0a1a 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"40px", position:"relative", overflow:"hidden"
    }}>
      {/* Decorative Orbs */}
      <div style={{ position:"absolute", top:"-10%", right:"-10%", width:"400px", height:"400px", background:"rgba(139,92,246,0.06)", borderRadius:"50%", filter:"blur(100px)" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-10%", width:"350px", height:"350px", background:"rgba(139,92,246,0.04)", borderRadius:"50%", filter:"blur(80px)" }} />

      <div style={{ position:"relative", zIndex:2, maxWidth:"520px", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:24 }}>
          <span style={{ width:48, height:48, borderRadius:12, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"grid", placeItems:"center", fontWeight:800, fontSize:24, color:"#fff", boxShadow:"0 8px 20px rgba(139,92,246,0.3)" }}>S</span>
          <span style={{ fontSize:22, fontWeight:700, color:"#fff", letterSpacing:"1px" }}>Satorem</span>
        </div>
        
        <h2 style={{ fontSize:48, fontWeight:800, color:"#fff", marginBottom:16, letterSpacing:"-0.02em", lineHeight:1.2 }}>Secure Access</h2>
        <p style={{ fontSize:18, color:"#9ca3af", lineHeight:1.6 }}>
          Your security is our top priority. We use military-grade encryption to keep your assets safe.
        </p>
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
    padding: "32px 36px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRight: "1px solid #1f1f35",
    height: "100vh",
    overflow: "hidden",
  };

  const wrapStyle = {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "420px 1fr",
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
                  {status==="loading" ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation:"spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Verifying...</span> : "Verify & Continue"}
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
          <div className="auth-side-content">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)", display:"grid", placeItems:"center", fontWeight:800, fontSize:16, color:"#fff", boxShadow:"0 4px 12px rgba(139,92,246,0.4)" }}>S</span>
              <span style={{ fontSize:16, fontWeight:700 }}>Satorem</span>
            </div>
            <div style={{ fontSize:30, fontWeight:800, color:"#fff", marginBottom:6 }}>Welcome back</div>
            <p style={{ color:"#9ca3af", fontSize:13, marginBottom:24, lineHeight:1.6 }}>Sign in to your account to continue.</p>
            <form style={{ display:"grid", gap:12 }} onSubmit={handleSubmit}>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input name="email" type="email" placeholder="Email address" required className="auth-input-pro" style={{ paddingLeft:36, height: 40 }}/>
              </div>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input name="password" type={showPwd?"text":"password"} placeholder="Password" required className="auth-input-pro" style={{ paddingLeft:36, height: 40 }}/>
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:0, cursor:"pointer", color:"#4b5563", padding:0 }}>
                  {showPwd
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div style={{ textAlign:"right", marginTop:-4 }}>
                <Link href="/forgot-password" style={{ fontSize:13, color:"#8b5cf6", fontWeight:500 }}>Forgot password?</Link>
              </div>
              <button className="auth-btn-pro" type="submit" disabled={status==="loading"} style={{ height: 42 }}>
                {status==="loading"
                  ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation:"spin 0.8s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Signing in...</span>
                  : "Continue"
                }
              </button>
            </form>
            {error && <div className="error-banner"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{error}</div>}
            <p style={{ marginTop:20, textAlign:"center", fontSize:13, color:"#6b7280" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color:"#8b5cf6", fontWeight:700 }}>Create account</Link>
            </p>
          </div>
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
