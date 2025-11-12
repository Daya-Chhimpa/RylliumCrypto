"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "@/store/slices/authSlice";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const authStatus = useSelector((s) => s.auth.status);
  const authError = useSelector((s) => s.auth.error);

  // If token exists, redirect away from sign-in
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("authToken");
    const hasAuthCookie = document.cookie.split("; ").some((c) => c.startsWith("auth=1"));
    if (token && hasAuthCookie) {
      const next = searchParams.get("next");
      if (next) router.replace(next);
      else router.replace("/dashboard");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email"),
      password: form.get("password"),
      twoFactorCode: form.get("twoFactorCode") || "",
    };
    
    console.log("📤 Submitting login with payload:", payload);
    const res = await dispatch(loginThunk(payload));
    console.log("📥 Login response:", res);
    
    if (res.meta.requestStatus === "fulfilled") {
      const next = searchParams.get("next");
      router.push(next || "/dashboard");
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
          <div className="auth-title">Sign in</div>
          <p className="auth-sub">Welcome back! Access your account to continue trading.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input name="email" className="auth-input" type="email" placeholder="Email" required />
            <input name="password" className="auth-input" type="password" placeholder="Password" required />
            <input name="twoFactorCode" className="auth-input" type="text" placeholder="Two-factor code (optional)" inputMode="numeric" pattern="[0-9]*" />
            <button className="auth-btn" type="submit" disabled={authStatus === "loading"}>
              {authStatus === "loading" ? "Signing in..." : "Continue"}
            </button>
          </form>
          {authError && <p style={{marginTop:12,color:'#ef4444',fontWeight:600,fontSize:'14px'}}>{authError}</p>}
          <div className="auth-alt">
            <Link href="/forgot-password">Forgot password?</Link>
            <Link href="/signup">Create account</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <img src="/crypto.png" alt="Crypto Trading" className="auth-crypto-img" />
            <div className="auth-brand" style={{justifyContent:'center', marginTop: '16px'}}>
              <img src="/NB.png" alt="NB" style={{width: '36px', height: '36px', borderRadius: '9px'}} />
              <div className="Tag" style={{fontSize: '16px'}}>NB Crypto</div>
            </div>
            <h2>Trade smarter with NB Crypto</h2>
            <p>Bank-grade security, lightning-fast execution, and powerful analytics.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="auth-wrap"><div className="auth-side"><div className="auth-title">Sign in</div><p>Loading...</p></div></div>}>
      <SignInContent />
    </Suspense>
  );
}
