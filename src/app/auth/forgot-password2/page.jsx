"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordThunk } from "@/store/slices/authSlice";

function ForgotPassword2Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);
  const [localError, setLocalError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = form.get("newPassword");
    const confirmPassword = form.get("confirmPassword");
    const token = searchParams.get("token");
    
    if (newPassword !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    
    setLocalError("");
    
    if (!token) {
      setLocalError("Invalid or missing reset token");
      return;
    }
    
    console.log("📤 Resetting password with token:", token);
    const res = await dispatch(resetPasswordThunk({ token, newPassword }));
    console.log("📥 Reset password response:", res);
    
    if (res.meta.requestStatus === "fulfilled") {
      alert("Password reset successful! You can now sign in with your new password.");
      router.push("/signin");
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-brand">
            <img src="/NB.png" alt="NB" style={{width: '40px', height: '40px', borderRadius: '10px'}} />
            <div className="Tag" style={{fontSize: '16px'}}>NB Crypto</div>
          </div>
          <div className="auth-title">Set new password</div>
          <p className="auth-sub">Enter your new password to reset your account.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input 
              name="newPassword" 
              className="auth-input" 
              type="password" 
              placeholder="New password" 
              minLength="6"
              required 
            />
            <input 
              name="confirmPassword" 
              className="auth-input" 
              type="password" 
              placeholder="Confirm new password" 
              minLength="6"
              required 
            />
            <button className="auth-btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Resetting..." : "Reset password"}
            </button>
          </form>
          {localError && <p style={{marginTop:12,color:'#ef4444',fontWeight:600,fontSize:'14px'}}>{localError}</p>}
          {error && <p style={{marginTop:12,color:'#ef4444',fontWeight:600,fontSize:'14px'}}>{error}</p>}
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <img src="/crypto.png" alt="Crypto Security" className="auth-crypto-img" />
            <div className="auth-brand" style={{justifyContent:'center', marginTop: '16px'}}>
              <img src="/NB.png" alt="NB" style={{width: '36px', height: '36px', borderRadius: '9px'}} />
              <div className="Tag" style={{fontSize: '16px'}}>NB Crypto</div>
            </div>
            <h2>Secure your account</h2>
            <p>Choose a strong password to keep your crypto safe.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ForgotPassword2Page() {
  return (
    <Suspense fallback={
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-title">Set new password</div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ForgotPassword2Content />
    </Suspense>
  );
}
