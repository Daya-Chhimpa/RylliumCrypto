"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignInContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - just for UI demo
    setTimeout(() => {
      // Store demo token
      if (typeof window !== "undefined") {
        window.localStorage.setItem("authToken", "demo-token");
        document.cookie = `auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
      }
      router.push("/dashboard");
    }, 1000);
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
            <button className="auth-btn" type="submit" disabled={isLoading}>
{isLoading ? "Signing in..." : "Continue"}
            </button>
          </form>
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



